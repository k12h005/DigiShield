from pydantic import BaseModel, Field


class AssetCreateRequest(BaseModel):
    type: str = Field(pattern="^(email|phone|domain)$")
    value: str = Field(min_length=3)
