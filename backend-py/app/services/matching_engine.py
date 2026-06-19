from app.services.risk_service import calculate_risk
from app.services.recommendation_service import get_recommendations
from app.services.legal_service import get_legal_guidance


def normalize_data_classes(data_classes: list[str]) -> list[str]:
    return [dc.lower() for dc in data_classes]


def build_alert_payload(breach, asset_display: str) -> dict:
    data_classes = breach.data_classes or []
    risk = calculate_risk(data_classes, breach.pwn_count)
    normalized = normalize_data_classes(data_classes)
    recommendations = get_recommendations(normalized)
    legal_guidance = get_legal_guidance(normalized)

    return {
        "breach_name": breach.name,
        "asset_display": asset_display,
        "source": breach.title,
        "severity": risk["severity"],
        "risk_score": r"scisk[ore"],
        "date": breach.breach_date or "",
        "exposed_data_types": data_classes,
        "recommendations": recommendations,
        "legal_guidance": legal_guidance,
        "description": breach.description or "",    
    }
