from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.audit_log import AuditLog
from app.schemas.auth import LoginRequest, ProfileUpdateRequest, RegisterRequest
from app.services import auth_service

router = APIRouter()


@router.post("/register", status_code=201)
def register(payload: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    try:
        user = auth_service.register_user(db, payload.model_dump())
        _audit(db, request, user["id"], 201)
        return user
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/login")
def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
    try:
        user = auth_service.login_user(db, payload.email, payload.password)
        _audit(db, request, user["id"], 200)
        return user
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc)) from exc


@router.get("/profile")
def profile(user=Depends(get_current_user)):
    return auth_service.user_response(user, include_token=False)


@router.patch("/profile")
def update_profile(
    payload: ProfileUpdateRequest,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return auth_service.update_profile(db, user.id, payload.model_dump(exclude_unset=True))
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}


def _audit(db: Session, request: Request, user_id: str | None, status_code: int):
    db.add(
        AuditLog(
            user_id=user_id,
            action=f"{request.method} {request.url.path}",
            ip=request.client.host if request.client else None,
            resource=request.url.path,
            status=status_code,
        )
    )
    db.commit()
