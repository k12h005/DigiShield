LEGAL_RULES = [
    {
        "framework": "Digital Personal Data Protection Act (DPDP) 2023",
        "trigger": ["email", "phone", "password", "name", "address", "aadhaar"],
        "guidance": "Data fiduciaries must notify affected individuals and the Data Protection Board of significant breaches without undue delay.",
    },
    {
        "framework": "CERT-In Directions 2022",
        "trigger": ["password", "financial", "government", "email"],
        "guidance": "Incidents involving sensitive personal or financial data must be reported to CERT-In within 6 hours of detection.",
    },
    {
        "framework": "Information Technology Act, 2000 (Section 43A)",
        "trigger": ["password", "financial", "email", "phone"],
        "guidance": "Organizations handling sensitive personal data must implement reasonable security practices and may face liability for negligence.",
    },
    {
        "framework": "RBI Cybersecurity Framework",
        "trigger": ["financial", "credit", "bank", "payment"],
        "guidance": "Regulated entities must activate incident response, customer notification, and fraud monitoring protocols immediately.",
    },
]


def get_legal_guidance(exposed_data_types: list[str]) -> list[dict]:
    joined = " ".join(exposed_data_types)
    guidance = []

    for rule in LEGAL_RULES:
        if any(term in joined for term in rule["trigger"]):
            guidance.append({
                "framework": rule["framework"],
                "guidance": rule["guidance"],
            })

    if not guidance:
        guidance.append({
            "framework": "General Cybersecurity Best Practice",
            "guidance": "Document the incident, preserve evidence, and follow your organization's breach response policy.",
        })

    return guidance
