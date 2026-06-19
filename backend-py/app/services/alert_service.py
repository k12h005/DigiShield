from sqlalchemy.orm import Session

from app.models.alert import Alert


def list_alerts(db: Session, user_id: str) -> list[dict]:
    alerts = (
        db.query(Alert)
        .filter(Alert.user_id == user_id)
        .order_by(Alert.created_at.desc())
        .all()
    )
    return [alert_to_dict(alert) for alert in alerts]


def update_alert_status(db: Session, alert_id: str, user_id: str, status: str) -> dict | None:
    alert = (
        db.query(Alert)
        .filter(Alert.id == alert_id, Alert.user_id == user_id)
        .first()
    )
    if not alert:
        return None
    alert.status = status
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
