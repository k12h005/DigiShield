from sqlalchemy.orm import Session

from app.models.alert import Alert

ALLOWED_STATUSES = {"pending", "resolved", "acknowledged", "dismissed"}


def list_alerts(db: Session, user_id: str, status: str | None = None) -> list[dict]:
    query = db.query(Alert).filter(Alert.user_id == user_id)
    if status:
        query = query.filter(Alert.status == status)
    alerts = query.order_by(Alert.created_at.desc()).all()
    return [alert_to_dict(alert) for alert in alerts]


def get_alert_summary(db: Session, user_id: str) -> dict:
    alerts = db.query(Alert).filter(Alert.user_id == user_id).all()
    by_severity: dict[str, int] = {}
    by_status: dict[str, int] = {}

    for alert in alerts:
        by_severity[alert.severity] = by_severity.get(alert.severity, 0) + 1
        by_status[alert.status] = by_status.get(alert.status, 0) + 1

    return {
        "total": len(alerts),
        "pending": by_status.get("pending", 0),
        "resolved": by_status.get("resolved", 0),
        "acknowledged": by_status.get("acknowledged", 0),
        "dismissed": by_status.get("dismissed", 0),
        "bySeverity": by_severity,
    }


def update_alert_status(db: Session, alert_id: str, user_id: str, status: str) -> dict | None:
    normalized = status.strip().lower()
    if normalized not in ALLOWED_STATUSES:
        raise ValueError(f"Invalid status. Allowed values: {', '.join(sorted(ALLOWED_STATUSES))}")

    alert = (
        db.query(Alert)
        .filter(Alert.id == alert_id, Alert.user_id == user_id)
        .first()
    )
    if not alert:
        return None
    alert.status = normalized
    db.commit()
    db.refresh(alert)
    return alert_to_dict(alert)


def alert_to_dict(alert: Alert) -> dict:
    return {
        "id": alert.id,
        "asset": alert.asset_display,
        "source": alert.source,
        "severity": alert.severity,
        "riskScore": alert.risk_score,
        "date": alert.date,
        "status": alert.status,
        "description": alert.description,
        "exposedDataTypes": alert.exposed_data_types or [],
        "recommendations": alert.recommendations or [],
        "legalGuidance": alert.legal_guidance or [],
        "createdAt": alert.created_at.isoformat(),
    }
