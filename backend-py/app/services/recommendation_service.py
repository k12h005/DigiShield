def get_recommendations(exposed_data_types: list[str]) -> list[str]:
    recommendations: list[str] = []
    joined = " ".join(exposed_data_types)

    if "password" in joined:
        recommendations.extend([
            "Change your password immediately on the affected service.",
            "Enable Multi-Factor Authentication (MFA) on all critical accounts.",
            "Do not reuse this password on any other platform.",
        ])

    if "phone" in joined:
        recommendations.extend([
            "Monitor for suspicious SMS or calls.",
            "Contact your telecom provider to review SIM security options.",
        ])

    if any(term in joined for term in ["financial", "credit", "bank", "payment"]):
        recommendations.extend([
            "Contact your bank to freeze or monitor affected accounts.",
            "Review recent transactions for unauthorized activity.",
        ])

    if "aadhaar" in joined or "government" in joined:
        recommendations.extend([
            "Monitor for identity fraud and suspicious government-service activity.",
            "Report suspicious activity through official channels immediately.",
        ])

    if "email" in joined and "password" not in joined:
        recommendations.append("Be alert for targeted phishing emails referencing this breach.")

    if not recommendations:
        recommendations.append("Monitor the affected account for unusual activity.")

    return list(dict.fromkeys(recommendations))
