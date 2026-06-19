from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    firstName: str
    lastName: str | None = None
    role: str | None = "individual"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    id: str
    firstName: str | None
    lastName: str | None
    email: str
    role: str
    token: str


class ProfileUpdateRequest(BaseModel):
    firstName: str | None = None
    lastName: str | None = None
