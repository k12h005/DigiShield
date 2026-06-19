import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON as SQLiteJSON

from app.database import Base

JsonType = JSON().with_variant(SQLiteJSON, "sqlite")


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"))
    asset_id: Mapped[str] = mapped_column(String, ForeignKey("assets.id"))
    breach_name: Mapped[str] = mapped_column(String)
    asset_display: Mapped[str] = mapped_column(String)
    source: Mapped[str] = mapped_column(String)
    severity: Mapped[str] = mapped_column(String)
    risk_score: Mapped[int] = mapped_column(default=0)
    date: Mapped[str] = mapped_column(String)
    exposed_data_types: Mapped[list] = mapped_column(JsonType, default=list)
    recommendations: Mapped[list] = mapped_column(JsonType, default=list)
    legal_guidance: Mapped[list] = mapped_column(JsonType, default=list)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="alerts")
    asset = relationship("Asset", back_populates="alerts")
