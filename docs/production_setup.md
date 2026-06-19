# DigiShield Deployment Guide

## Docker (recommended for demo)

```bash
docker compose up --build
```

Services:
- PostgreSQL 15
- FastAPI backend (`backend-py`)
- React frontend via Nginx

## Local development

### Backend
```bash
conda activate hackathon
cd backend-py
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 5000
```

### Frontend
```bash
npm install
npm run dev
```

## API overview
- `POST /api/auth/register` / `POST /api/auth/login`
- `GET /api/assets` / `POST /api/assets` / `DELETE /api/assets/{id}`
- `GET /api/alerts` / `PATCH /api/alerts/{id}`
- `GET /api/breaches` / `GET /api/breaches/analytics` / `GET /api/breaches/dashboard`
- `GET /api/intelligence/sync-status`

Breach intelligence syncs from HIBP public corpus on startup and every 6 hours, with `backend-py/data/breaches.json` as offline fallback.
