from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.breach import Breach
from app.services.hibp_sync import (
    breach_to_hibp_shape,
    get_analytics,
    get_dashboard_stats,
    get_recent_breaches,
)

router = APIRouter()


@router.get("/")
def get_all_breaches(db: Session = Depends(get_db)):
    breaches = db.query(Breach).order_by(Breach.breach_date.desc().nullslast()).all()
    return [breach_to_hibp_shape(b) for b in breaches]


@router.get("/analytics")
def get_breach_analytics(db: Session = Depends(get_db)):
    return get_analytics(db)


@router.get("/dashboard")
def get_breach_dashboard(db: Session = Depends(get_db)):
    return get_dashboard_stats(db)


@router.get("/recent")
def get_recent(limit: int = 20, db: Session = Depends(get_db)):
    return get_recent_breaches(db, min(limit, 100))


@router.get("/{name}")
def get_breach_by_name(name: str, db: Session = Depends(get_db)):
    breach = db.get(Breach, name)
    if not breach:
        raise HTTPException(status_code=404, detail="Breach not found")
    return breach_to_hibp_shape(breach)
