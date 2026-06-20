from datetime import datetime

from sqlalchemy.orm import Session

from app.core.hashing import (
    compute_asset_fingerprint,
    domain_matches,
    extract_match_key,
    mask_value,
    validate_asset_value,
)
from app.models.alert import Alert
from app.models.asset import Asset
from app.models.breach import Breach
from app.services.matching_engine import build_alert_payload


def _find_matching_breaches(db: Session, match_key: str) -> list[Breach]:
    candidates = db.query(Breach).filter(Breach.domain.isnot(None)).all()
    return [breach for breach in candidates if domain_matches(match_key, breach.domain)]


def scan_asset(db: Session, asset: Asset) -> list[Alert]:
    if not asset.match_key:
        asset.last_checked = datetime.utcnow()
        db.commit()
        return []

    breaches = _find_matching_breaches(db, asset.match_key)
    created_alerts: list[Alert] = []

    for breach in breaches:
        existing = (
            db.query(Alert)
            .filter(
                Alert.user_id == asset.user_id,
                Alert.asset_id == asset.id,
                Alert.breach_name == breach.name,
            )
            .first()
        )
        if existing:
            continue

        payload = build_alert_payload(breach, asset.value_masked)
        alert = Alert(
            user_id=asset.user_id,
            asset_id=asset.id,
            breach_name=breach.name,
            asset_display=payload["asset_display"],
            source=payload["source"],
            severity=payload["severity"],
            risk_score=payload["risk_score"],
            date=payload["date"],
            exposed_data_types=payload["exposed_data_types"],
            recommendations=payload["recommendations"],
            legal_guidance=payload["legal_guidance"],
            description=payload["description"],
            status="pending",
        )
        db.add(alert)
        created_alerts.append(alert)

    asset.last_checked = datetime.utcnow()
    db.commit()
    return created_alerts


def rescan_all_assets(db: Session) -> int:
    assets = db.query(Asset).filter(Asset.match_key.isnot(None)).all()
    total_new = 0
    for asset in assets:
        before = db.query(Alert).filter(Alert.asset_id == asset.id).count()
        scan_asset(db, asset)
        after = db.query(Alert).filter(Alert.asset_id == asset.id).count()
        total_new += max(after - before, 0)
    return total_new


def create_asset(db: Session, user_id: str, asset_type: str, value: str) -> Asset:
    validate_asset_value(asset_type, value)

    value_hmac = compute_asset_fingerprint(asset_type, value)
    duplicate = (
        db.query(Asset)
        .filter(Asset.user_id == user_id, Asset.value_hmac == value_hmac)
        .first()
    )
    if duplicate:
        raise ValueError("This asset is already being monitored")

    match_key = extract_match_key(asset_type, value)
    asset = Asset(
        user_id=user_id,
        type=asset_type,
        value_masked=mask_value(asset_type, value),
        value_hmac=value_hmac,
        match_key=match_key,
        status="monitored" if match_key else "unsupported",
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    scan_asset(db, asset)
    db.refresh(asset)
    return asset


def delete_asset(db: Session, asset_id: str, user_id: str) -> bool:
    asset = db.query(Asset).filter(Asset.id == asset_id, Asset.user_id == user_id).first()
    if not asset:
        return False
    db.delete(asset)
    db.commit()
    return True


def get_asset(db: Session, asset_id: str, user_id: str) -> dict | None:
    asset = db.query(Asset).filter(Asset.id == asset_id, Asset.user_id == user_id).first()
    if not asset:
        return None
    return asset_to_dict(asset, db)


def asset_to_dict(asset: Asset, db: Session) -> dict:
    alert_count = db.query(Alert).filter(Alert.asset_id == asset.id).count()
    return {
        "id": asset.id,
        "type": asset.type,
        "value": asset.value_masked,
        "status": asset.status,
        "lastChecked": asset.last_checked.isoformat(),
        "createdAt": asset.created_at.isoformat(),
        "breaches": alert_count,
    }


def list_assets(db: Session, user_id: str) -> list[dict]:
    assets = db.query(Asset).filter(Asset.user_id == user_id).order_by(Asset.created_at.desc()).all()
    return [asset_to_dict(asset, db) for asset in assets]
