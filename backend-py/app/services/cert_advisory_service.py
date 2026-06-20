import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ADVISORY_PATHS = [
    ROOT / "data" / "certAdvisories.json",
    ROOT.parent / "backend" / "data" / "certAdvisories.json",
]

_cache: list[dict] | None = None


def _load_advisories() -> list[dict]:
    global _cache
    if _cache is not None:
        return _cache

    for path in ADVISORY_PATHS:
        if path.exists():
            with open(path, encoding="utf-8") as handle:
                _cache = json.load(handle)
                return _cache

    _cache = []
    return _cache


def get_cert_advisories(
    *,
    search: str = "",
    severity: str | None = None,
    category: str | None = None,
    limit: int = 100,
    offset: int = 0,
) -> dict:
    records = _load_advisories()
    filtered = records

    if search:
        query = search.lower()
        filtered = [
            item
            for item in filtered
            if query in item.get("title", "").lower()
            or query in item.get("reference", "").lower()
            or query in item.get("category", "").lower()
        ]

    if severity:
        filtered = [item for item in filtered if item.get("severity") == severity]

    if category:
        filtered = [item for item in filtered if item.get("category") == category]

    total = len(filtered)
    page = filtered[offset : offset + limit]

    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "items": page,
    }


def get_cert_analytics() -> dict:
    records = _load_advisories()
    by_severity: dict[str, int] = {}
    by_category: dict[str, int] = {}
    by_month: dict[str, int] = {}

    for item in records:
        sev = item.get("severity", "Unknown")
        cat = item.get("category", "Unknown")
        by_severity[sev] = by_severity.get(sev, 0) + 1
        by_category[cat] = by_category.get(cat, 0) + 1
        month = (item.get("date") or "")[:7]
        if month:
            by_month[month] = by_month.get(month, 0) + 1

    severity_distribution = [
        {"name": name, "value": value}
        for name, value in sorted(by_severity.items(), key=lambda x: x[1], reverse=True)
    ]
    category_distribution = [
        {"name": name, "value": value}
        for name, value in sorted(by_category.items(), key=lambda x: x[1], reverse=True)
    ]
    monthly_trend = [
        {"name": key, "count": value}
        for key, value in sorted(by_month.items())[-12:]
    ]

    return {
        "totalAdvisories": len(records),
        "severityDistribution": severity_distribution,
        "categoryDistribution": category_distribution,
        "monthlyTrend": monthly_trend,
        "criticalCount": by_severity.get("Critical", 0),
        "highCount": by_severity.get("High", 0),
    }
