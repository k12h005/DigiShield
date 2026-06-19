from apscheduler.schedulers.background import BackgroundScheduler
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.models import AuditLog
from app.routers import alerts, assets, auth, breaches, intelligence
from app.services.asset_service import rescan_all_assets
from app.services.hibp_sync import sync_breaches

scheduler = BackgroundScheduler()


def create_app() -> FastAPI:
    app = FastAPI(title="DigiShield API", version="2.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.client_url, "http://localhost:5173", "http://localhost"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def audit_middleware(request: Request, call_next):
        response = await call_next(request)
        if request.url.path.startswith("/api/"):
            db = SessionLocal()
            try:
                user_id = None
                auth_header = request.headers.get("authorization", "")
                if auth_header.startswith("Bearer "):
                    from app.core.security import decode_access_token

                    payload = decode_access_token(auth_header.split(" ", 1)[1])
                    if payload:
                        user_id = payload.get("id")

                db.add(
                    AuditLog(
                        user_id=user_id,
                        action=f"{request.method} {request.url.path}",
                        ip=request.client.host if request.client else None,
                        resource=request.url.path,
                        status=response.status_code,
                    )
                )
                db.commit()
            except Exception:
                db.rollback()
            finally:
                db.close()
        return response

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        status_code = 500
        if hasattr(exc, "status_code"):
            status_code = exc.status_code
        return JSONResponse(
            status_code=status_code,
            content={"message": str(exc)},
        )

    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(assets.router, prefix="/api/assets", tags=["assets"])
    app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
    app.include_router(breaches.router, prefix="/api/breaches", tags=["breaches"])
    app.include_router(intelligence.router, prefix="/api/intelligence", tags=["intelligence"])

    @app.get("/")
    def root():
        return {"message": "DigiShield API is running securely."}

    @app.on_event("startup")
    def startup():
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            sync_breaches(db)
            rescan_all_assets(db)
        finally:
            db.close()

        scheduler.add_job(run_scheduled_sync, "interval", hours=settings.breach_sync_hours, id="hibp_sync")
        scheduler.start()

    @app.on_event("shutdown")
    def shutdown():
        if scheduler.running:
            scheduler.shutdown()

    return app


def run_scheduled_sync():
    db = SessionLocal()
    try:
        sync_breaches(db)
        rescan_all_assets(db)
    finally:
        db.close()


app = create_app()
