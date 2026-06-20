from datetime import datetime

from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.models.asset import Asset
from app.services.alert_service import alert_to_dict, get_alert_summary


def build_user_report(db: Session, user_id: str) -> dict:
    assets = db.query(Asset).filter(Asset.user_id == user_id).order_by(Asset.created_at.desc()).all()
    alerts = (
        db.query(Alert)
        .filter(Alert.user_id == user_id)
        .order_by(Alert.created_at.desc())
        .all()
    )
    summary = get_alert_summary(db, user_id)

    critical_pending = [
        alert_to_dict(alert)
        for alert in alerts
        if alert.status == "pending" and alert.severity in {"Critical", "High"}
    ]

    return {
        "generatedAt": datetime.utcnow().isoformat(),
        "title": "DigiShield Security Report",
        "summary": {
            "assetsMonitored": len(assets),
            "totalAlerts": summary["total"],
            "pendingAlerts": summary["pending"],
            "resolvedAlerts": summary["resolved"],
            "severityBreakdown": summary["bySeverity"],
        },
        "assets": [
            {
                "id": asset.id,
                "type": asset.type,
                "value": asset.value_masked,
                "status": asset.status,
                "lastChecked": asset.last_checked.isoformat(),
            }
            for asset in assets
        ],
        "criticalPendingAlerts": critical_pending[:10],
        "recentAlerts": [alert_to_dict(alert) for alert in alerts[:20]],
    }
