# DigiShield

**DigiShield** is a Real-Time Data Breach Alert & Cyber Intelligence Platform for Legal & Government ecosystems.

## Repository Structure
- `/`: Frontend (React + TypeScript + Vite + Tailwind)
- `/backend-py`: Python API (FastAPI + SQLAlchemy + PostgreSQL/SQLite)

## Quick Start (Conda)

```bash
conda create -n hackathon python=3.12 -y
conda activate hackathon

cd backend-py
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 5000
```

In another terminal:

```bash
npm install
npm run dev
```

Demo tip: add a monitored domain like `adobe.com` or `linkedin.com` to trigger real breach alerts.

## Docker

```bash
docker compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:5000/api

## License
MIT
