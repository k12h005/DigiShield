from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.alert import AlertStatusUpdate
from app.services import alert_service

router = APIRouter()


@router.get("")
def get_alerts(
    status: str | None = Query(default=None),
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if status and status not in alert_service.ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status filter")
    return alert_service.list_alerts(db, user.id, status=status)


@router.get("/summary")
def get_alerts_summary(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return alert_service.get_alert_summary(db, user.id)


@router.patch("/{alert_id}")
def update_alert_status(
    alert_id: str,
    payload: AlertStatusUpdate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        updated = alert_service.update_alert_status(db, alert_id, user.id, payload.status)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if not updated:
        raise HTTPException(status_code=404, detail="Alert not found")
    return updated
