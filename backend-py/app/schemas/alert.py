from pydantic import BaseModel, Field


class AlertStatusUpdate(BaseModel):
    status: str = Field(pattern="^(pending|resolved|acknowledged|dismissed)$")
