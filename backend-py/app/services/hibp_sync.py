import json
from datetime import datetime
from pathlib import Path

import httpx
from sqlalchemy.orm import Session

from app.config import settings
from app.models.breach import Breach
from app.models.sync_status import SyncStatus


def breach_to_hibp_shape(breach: Breach) -> dict:
    return {
        "Name": breach.name,
        "Title": breach.title,
        "Domain": breach.domain,
        "BreachDate": breach.breach_date,
        "AddedDate": breach.added_date,
        "ModifiedDate": breach.modified_date,
        "PwnCount": breach.pwn_count,
        "Description": breach.description,
        "LogoPath": breach.logo_path,
        "DataClasses": breach.data_classes or [],
        "IsVerified": breach.is_verified,
        "IsSensitive": breach.is_sensitive,
    }


def _upsert_breach(db: Session, record: dict) -> None:
    name = record.get("Name")
    if not name:
        return

    breach = db.get(Breach, name)
    if breach is None:
        breach = Breach(name=name)
        db.add(breach)

    breach.title = record.get("Title") or name
    breach.domain = record.get("Domain")
    breach.breach_date = record.get("BreachDate")
    breach.added_date = record.get("AddedDate")
    breach.modified_date = record.get("ModifiedDate")
    breach.pwn_count = record.get("PwnCount") or 0
    breach.description = record.get("Description")
    breach.logo_path = record.get("LogoPath")
    breach.data_classes = record.get("DataClasses") or []
    breach.is_verified = bool(record.get("IsVerified", True))
    breach.is_sensitive = bool(record.get("IsSensitive", False))
    breach.synced_at = datetime.utcnow()


def _load_fallback_json() -> list[dict]:
    base_dir = Path(__file__).resolve().parents[2]
    fallback_path = base_dir / settings.fallback_breaches_path
    if not fallback_path.exists():
        fallback_path = base_dir / "data" / "breaches.json"
    with open(fallback_path, encoding="utf-8") as handle:
        return json.load(handle)


def fetch_hibp_breaches() -> tuple[list[dict], str]:
    try:
        with httpx.Client(timeout=60.0) as client:
            response = client.get(
                settings.hibp_api_url,
                headers={"User-Agent": settings.hibp_user_agent},
            )
            response.raise_for_status()
            return response.json(), "hibp_live"
    except Exception as exc:
        return _load_fallback_json(), f"fallback_json ({exc})"


def sync_breaches(db: Session) -> SyncStatus:
    records, source_message = fetch_hibp_breaches()

    for record in records:
        _upsert_breach(db, record)

    status = db.get(SyncStatus, 1)
    if status is None:
        status = SyncStatus(id=1)
        db.add(status)

    status.source = "hibp" if source_message == "hibp_live" else "fallback"
    status.last_sync_at = datetime.utcnow()
    status.breach_count = db.query(Breach).count()
    status.status = "success"
    status.message = source_message
    db.commit()
    db.refresh(status)
    return status


def get_recent_breaches(db: Session, limit: int = 20) -> list[dict]:
    breaches = (
        db.query(Breach)
        .order_by(Breach.added_date.desc().nullslast(), Breach.breach_date.desc().nullslast())
        .limit(limit)
        .all()
    )
    return [breach_to_hibp_shape(b) for b in breaches]


def get_monthly_trend(db: Session) -> list[dict]:
    breaches = db.query(Breach).all()
    month_counts: dict[str, int] = {}

    for breach in breaches:
        date_value = breach.breach_date or breach.added_date
        if not date_value:
            continue
        month_key = date_value[:7]
        month_counts[month_key] = month_counts.get(month_key, 0) + 1

    sorted_months = sorted(month_counts.items())[-6:]
    return [{"name": key, "count": value} for key, value in sorted_months]


def get_analytics(db: Session) -> dict:
    breaches = db.query(Breach).all()
    data_class_counts: dict[str, int] = {}

    for breach in breaches:
        for dc in breach.data_classes or []:
            data_class_counts[dc] = data_class_counts.get(dc, 0) + 1

    most_common = sorted(
        [{"name": name, "value": value} for name, value in data_class_counts.items()],
        key=lambda item: item["value"],
        reverse=True,
    )[:5]

    def severity_bucket(pwn_count: int) -> str:
        if pwn_count > 10_000_000:
            return "Critical"
        if pwn_count > 1_000_000:
            return "High"
        if pwn_count > 100_000:
            return "Medium"
        return "Low"

    severity_distribution = []
    for label in ["Critical", "High", "Medium", "Low"]:
        severity_distribution.append({
            "name": label,
            "value": len([b for b in breaches if severity_bucket(b.pwn_count or 0) == label]),
        })

    return {
        "totalBreaches": len(breaches),
        "totalPwnCount": sum(b.pwn_count or 0 for b in breaches),
        "mostCommonData": most_common,
        "severityDistribution": severity_distribution,
        "monthlyTrend": get_monthly_trend(db),
    }


def get_dashboard_stats(db: Session) -> dict:
    analytics = get_analytics(db)
    critical = next(
        (item for item in analytics["severityDistribution"] if item["name"] == "Critical"),
        {"value": 0},
    )

    latest = (
        db.query(Breach)
        .order_by(Breach.breach_date.desc().nullslast())
        .first()
    )

    return {
        "totalIntelligenceRecords": analytics["totalBreaches"],
        "globalImpactEstimate": analytics["totalPwnCount"],
        "criticalAlertsActive": critical["value"],
        "latestBreach": breach_to_hibp_shape(latest) if latest else None,
    }
