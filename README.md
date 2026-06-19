# DigiShield

**DigiShield** is a Real-Time Data Breach Alert & Cyber Intelligence Platform built for a Government & Legal Intelligence Hackathon.

## Repository Structure
- `/`: Frontend application (React + TypeScript + Vite + Tailwind)
- `/backend`: API Server (Node.js + Express + PostgreSQL architecture)

## Core Capabilities
- **Asset Monitoring**: Real-time tracking of emails, phone numbers, and domains.
- **Threat Intelligence**: Aggregated CERT-In advisories and CVE data.
- **Risk Scoring**: AI-ready modular engine for calculating account risk levels.
- **Legal Intelligence**: Role-specific compliance and regulatory guidance.
- **Role-Based Dashboards**: Tailored experiences for Citizens, Legal Professionals, and Government Organizations.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Recharts, Framer Motion, Axios.
- **Backend**: Node.js, Express, PostgreSQL (Sequelize), JWT.

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Make sure to configure `.env` in the backend folder.*

### 2. Frontend Setup
```bash
# In the root directory
npm install
npm run dev
```

## Security Implementation
- **JWT Authentication**: Secure stateless access.
- **RBAC**: Strict role-based permissions at API and UI levels.
- **Audit Logging**: Request tracking for compliance and security monitoring.
- **Security Headers**: Helmet integration for HTTP protection.
- **Rate Limiting**: Brute-force protection on authentication routes.

## Design Philosophy
- **Clean & Minimal**: Inspired by Google and Notion.
- **Government Friendly**: White theme, high contrast, professional typography.
- **Accessible**: WCAG compliant color palettes and semantic HTML.

## License
MIT
