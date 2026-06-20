from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.sync_status import SyncStatus
from app.services.asset_service import rescan_all_assets
from app.services.cert_advisory_service import get_cert_advisories, get_cert_analytics
from app.services.hibp_sync import sync_breaches
from app.services.legal_service import get_legal_guidance

router = APIRouter()


@router.get("/sync-status")
def sync_status(db: Session = Depends(get_db)):
    status = db.get(SyncStatus, 1)
    if not status:
        return {
            "source": "pending",
            "lastSyncAt": None,
            "breachCount": 0,
            "status": "pending",
            "message": "Initial sync not completed yet",
        }
    return {
        "source": status.source,
        "lastSyncAt": status.last_sync_at.isoformat() if status.last_sync_at else None,
        "breachCount": status.breach_count,
        "status": status.status,
        "message": status.message,
    }


@router.get("/legal")
def legal_guidance(dataClasses: str = ""):
    classes = [item.strip() for item in dataClasses.split(",") if item.strip()]
    return get_legal_guidance([c.lower() for c in classes])


@router.get("/cert-advisories")
def cert_advisories(
    search: str = "",
    severity: str | None = None,
    category: str | None = None,
    limit: int = Query(default=50, le=300),
    offset: int = Query(default=0, ge=0),
):
    return get_cert_advisories(
        search=search,
        severity=severity,
        category=category,
        limit=limit,
        offset=offset,
    )


@router.get("/cert-advisories/analytics")
def cert_advisory_analytics():
    return get_cert_analytics()


@router.post("/refresh")
def refresh_intelligence(user=Depends(get_current_user), db: Session = Depends(get_db)):
    status = sync_breaches(db)
    new_alerts = rescan_all_assets(db)
    return {
        "source": status.source,
        "lastSyncAt": status.last_sync_at.isoformat() if status.last_sync_at else None,
        "breachCount": status.breach_count,
        "status": status.status,
        "message": status.message,
        "newAlerts": new_alerts,
    }
