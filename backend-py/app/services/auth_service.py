from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User

ROLE_ALIASES = {
    "citizen": "individual",
    "individual": "individual",
    "legal": "legal",
    "government": "government",
    "admin": "admin",
}


def normalize_role(role: str | None) -> str:
    if not role:
        return "individual"
    return ROLE_ALIASES.get(role.lower(), "individual")


def register_user(db: Session, payload: dict) -> dict:
    email = payload["email"].strip().lower()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise ValueError("User already exists")

    user = User(
        email=email,
        password_hash=hash_password(payload["password"]),
        first_name=payload.get("firstName"),
        last_name=payload.get("lastName"),
        role=normalize_role(payload.get("role")),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user_response(user)


def login_user(db: Session, email: str, password: str) -> dict:
    user = db.query(User).filter(User.email == email.strip().lower()).first()
    if not user or not verify_password(password, user.password_hash):
        raise ValueError("Invalid email or password")
    return user_response(user)


def user_response(user: User, include_token: bool = True) -> dict:
    data = {
        "id": user.id,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "email": user.email,
        "role": user.role,
    }
    if include_token:
        data["token"] = create_access_token(user.id, user.role)
    return data


def update_profile(db: Session, user_id: str, payload: dict) -> dict:
    user = db.get(User, user_id)
    if not user:
        raise ValueError("User not found")

    if payload.get("firstName") is not None:
        user.first_name = payload["firstName"]
    if payload.get("lastName") is not None:
        user.last_name = payload["lastName"]

    db.commit()
    db.refresh(user)
    return user_response(user, include_token=False)
