from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SyncStatus(Base):
    __tablename__ = "sync_status"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    source: Mapped[str] = mapped_column(String, default="hibp")
    last_sync_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    breach_count: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String, default="pending")
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
