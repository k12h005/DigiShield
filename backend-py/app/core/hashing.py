import hashlib
import hmac
import re

from app.config import settings


def compute_hmac(value: str) -> str:
    normalized = value.strip().lower()
    return hmac.new(
        settings.hmac_secret.encode(),
        normalized.encode(),
        hashlib.sha256,
    ).hexdigest()


def mask_value(asset_type: str, value: str) -> str:
    value = value.strip()
    if asset_type == "email" and "@" in value:
        local, domain = value.split("@", 1)
        visible = local[0] if local else "*"
        return f"{visible}***@{domain}"
    if asset_type == "phone":
        digits = re.sub(r"\D", "", value)
        if len(digits) >= 4:
            return f"***{digits[-4:]}"
        return "***"
    if asset_type == "domain":
        return value.lower().replace("https://", "").replace("http://", "").split("/")[0]
    return value[:2] + "***"


def extract_match_key(asset_type: str, value: str) -> str | None:
    value = value.strip().lower()
    if asset_type == "email" and "@" in value:
        return value.split("@", 1)[1]
    if asset_type == "domain":
        return value.replace("https://", "").replace("http://", "").split("/")[0]
    if asset_type == "phone":
        return None
    return None
