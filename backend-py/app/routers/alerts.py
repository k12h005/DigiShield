from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.alert import AlertStatusUpdate
from app.services import alert_service

router = APIRouter()


@router.get("/")
def get_alerts(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return alert_service.list_alerts(db, user.id)


@router.patch("/{alert_id}")
def update_alert_status(
    alert_id: str,
    payload: AlertStatusUpdate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    updated = alert_service.update_alert_status(db, alert_id, user.id, payload.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Alert not found")
    return updated
