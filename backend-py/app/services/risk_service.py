DATA_CLASS_WEIGHTS = {
    "passwords": 50,
    "password hints": 40,
    "email addresses": 20,
    "phone numbers": 30,
    "physical addresses": 40,
    "ip addresses": 15,
    "usernames": 10,
    "names": 5,
    "credit cards": 45,
    "financial": 45,
    "aadhaar": 60,
    "government issued ids": 55,
}


def calculate_risk(data_classes: list[str], pwn_count: int = 0) -> dict:
    score = 0
    for dc in data_classes:
        key = dc.lower()
        score += DATA_CLASS_WEIGHTS.get(key, 10)

    if pwn_count > 10_000_000:
        score += 15
    elif pwn_count > 1_000_000:
        score += 10
    elif pwn_count > 100_000:
        score += 5

    normalized = min(score, 100)
    if normalized > 80:
        severity = "Critical"
    elif normalized > 50:
        severity = "High"
    elif normalized > 25:
        severity = "Medium"
    else:
        severity = "Low"

    return {"score": normalized, "severity": severity}
