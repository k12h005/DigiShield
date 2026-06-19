from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON as SQLiteJSON

from app.database import Base

JsonType = JSON().with_variant(SQLiteJSON, "sqlite")


class Breach(Base):
    __tablename__ = "breaches"

    name: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String)
    domain: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    breach_date: Mapped[str | None] = mapped_column(String, nullable=True)
    added_date: Mapped[str | None] = mapped_column(String, nullable=True)
    modified_date: Mapped[str | None] = mapped_column(String, nullable=True)
    pwn_count: Mapped[int] = mapped_column(Integer, default=0)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    logo_path: Mapped[str | None] = mapped_column(String, nullable=True)
    data_classes: Mapped[list] = mapped_column(JsonType, default=list)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True)
    is_sensitive: Mapped[bool] = mapped_column(Boolean, default=False)
    synced_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
