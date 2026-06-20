import hashlib
import hmac
import re

from app.config import settings

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_DOMAIN_RE = re.compile(r"^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$")
_PHONE_RE = re.compile(r"^\+?[\d\s\-().]{7,20}$")


def normalize_domain(value: str) -> str:
    domain = value.strip().lower()
    domain = domain.replace("https://", "").replace("http://", "")
    domain = domain.split("/")[0].split("?")[0].split("#")[0]
    if domain.startswith("www."):
        domain = domain[4:]
    return domain


def domain_matches(monitored_key: str, breach_domain: str) -> bool:
    monitored = monitored_key.lower().strip()
    breach = breach_domain.lower().strip()
    if not monitored or not breach:
        return False
    return monitored == breach or monitored.endswith(f".{breach}")


def canonical_value(asset_type: str, value: str) -> str:
    cleaned = value.strip()
    if asset_type == "domain":
        return normalize_domain(cleaned)
    if asset_type == "email":
        return cleaned.lower()
    if asset_type == "phone":
        return re.sub(r"\D", "", cleaned)
    return cleaned.lower()


def compute_hmac(value: str) -> str:
    normalized = value.strip().lower()
    return hmac.new(
        settings.hmac_secret.encode(),
        normalized.encode(),
        hashlib.sha256,
    ).hexdigest()


def compute_asset_fingerprint(asset_type: str, value: str) -> str:
    return compute_hmac(canonical_value(asset_type, value))


def mask_value(asset_type: str, value: str) -> str:
    value = value.strip()
    if asset_type == "email" and "@" in value:
        local, domain = value.split("@", 1)
        visible = local[0] if local else "*"
        return f"{visible}***@{domain.lower()}"
    if asset_type == "phone":
        digits = re.sub(r"\D", "", value)
        if len(digits) >= 4:
            return f"***{digits[-4:]}"
        return "***"
    if asset_type == "domain":
        return normalize_domain(value)
    return value[:2] + "***"


def extract_match_key(asset_type: str, value: str) -> str | None:
    value = value.strip().lower()
    if asset_type == "email" and "@" in value:
        return normalize_domain(value.split("@", 1)[1])
    if asset_type == "domain":
        return normalize_domain(value)
    if asset_type == "phone":
        return None
    return None


def validate_asset_value(asset_type: str, value: str) -> None:
    cleaned = value.strip()
    if not cleaned:
        raise ValueError("Asset value is required")

    if asset_type == "email":
        if not _EMAIL_RE.match(cleaned.lower()):
            raise ValueError("Invalid email format")
    elif asset_type == "domain":
        if not _DOMAIN_RE.match(normalize_domain(cleaned)):
            raise ValueError("Invalid domain format")
    elif asset_type == "phone":
        if not _PHONE_RE.match(cleaned):
            raise ValueError("Invalid phone number format")
    else:
        raise ValueError("Unsupported asset type")
