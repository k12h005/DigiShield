import json
import random
from datetime import datetime, timedelta
from pathlib import Path

CATEGORIES = [
    "Credential Security",
    "Phishing",
    "Malware",
    "Ransomware",
    "Network Security",
    "Cloud Security",
    "Government Systems",
    "Data Protection",
    "Mobile Security",
    "Web Application Security",
]

SEVERITIES = ["Low", "Medium", "High", "Critical"]

AFFECTED_SYSTEMS = [
    "Windows",
    "Linux",
    "Android",
    "iOS",
    "Government Portals",
    "Email Systems",
    "Cloud Infrastructure",
    "Databases",
    "Web Applications",
    "Citizen Service Platforms",
    "Authentication Servers",
    "Public Sector Networks",
]

ADVISORY_TEMPLATES = [
    {
        "title": "Critical Credential Exposure Detected",
        "recommendation": "Immediately reset affected passwords and enable MFA.",
    },
    {
        "title": "Phishing Campaign Targeting Government Employees",
        "recommendation": "Verify sender identity and avoid opening suspicious links.",
    },
    {
        "title": "Ransomware Activity Observed",
        "recommendation": "Isolate affected systems and restore from verified backups.",
    },
    {
        "title": "Cloud Storage Misconfiguration Risk",
        "recommendation": "Review storage permissions and enforce least privilege access.",
    },
    {
        "title": "API Authentication Vulnerability",
        "recommendation": "Rotate API keys and enforce strong authentication mechanisms.",
    },
    {
        "title": "Citizen Data Exposure Risk",
        "recommendation": "Audit data access logs and encrypt sensitive information.",
    },
    {
        "title": "Database Security Advisory",
        "recommendation": "Apply latest security patches and review access permissions.",
    },
    {
        "title": "Remote Code Execution Vulnerability",
        "recommendation": "Update affected software immediately.",
    },
    {
        "title": "Unauthorized Access Attempts Detected",
        "recommendation": "Investigate login activity and enable MFA.",
    },
    {
        "title": "Web Application Injection Risk",
        "recommendation": "Validate inputs and implement secure coding practices.",
    },
]


def random_date():
    start = datetime(2024, 1, 1)
    end = datetime(2026, 12, 31)
    delta = end - start
    random_days = random.randint(0, delta.days)
    return (start + timedelta(days=random_days)).strftime("%Y-%m-%d")


def generate_advisories(count=300):
    advisories = []
    for i in range(1, count + 1):
        template = random.choice(ADVISORY_TEMPLATES)
        advisories.append({
            "id": i,
            "title": template["title"],
            "severity": random.choice(SEVERITIES),
            "category": random.choice(CATEGORIES),
            "affectedSystems": random.sample(AFFECTED_SYSTEMS, k=random.randint(1, 3)),
            "recommendation": template["recommendation"],
            "date": random_date(),
            "reference": f"CERT-DS-{i:04d}",
        })
    return advisories


def main():
    root = Path(__file__).resolve().parents[1]
    output_paths = [
        root / "backend-py" / "data" / "certAdvisories.json",
        root / "backend" / "data" / "certAdvisories.json",
    ]

    advisories = generate_advisories(300)

    for output_path in output_paths:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(advisories, f, indent=2)
        print(f"Saved {len(advisories)} advisories to: {output_path}")


if __name__ == "__main__":
    main()
