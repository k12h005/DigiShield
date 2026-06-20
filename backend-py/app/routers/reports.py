from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.services import reports_service

router = APIRouter()


@router.get("/summary")
def get_report_summary(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return reports_service.build_user_report(db, user.id)
