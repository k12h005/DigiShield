from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.schemas.asset import AssetCreateRequest
from app.services import asset_service

router = APIRouter()


@router.get("/")
def get_assets(user=Depends(get_current_user), db: Session = Depends(get_db)):
    return asset_service.list_assets(db, user.id)


@router.post("/", status_code=201)
def create_asset(
    payload: AssetCreateRequest,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    asset_service.create_asset(db, user.id, payload.type, payload.value)
    assets = asset_service.list_assets(db, user.id)
    return assets[0]


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_asset(
    asset_id: str,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = asset_service.delete_asset(db, asset_id, user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Asset not found or unauthorized")
    return None
