# DigiShield Production Setup & Deployment Guide

This document outlines the steps to deploy the DigiShield Cyber Intelligence Platform in a production-ready environment using Docker and Prisma.

## Prerequisites
- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js v20+](https://nodejs.org/) (for local development)

---

## 🚀 Quick Deployment with Docker

The easiest way to get the entire platform (Frontend, Backend, and Database) running is using Docker Compose.

1. **Clone and Configure**:
   ```bash
   # Create a .env file in the backend directory
   cp backend/.env.example backend/.env
   ```

2. **Start Services**:
   ```bash
   docker compose up --build
   ```
   This will:
   - Start a **PostgreSQL 15** container.
   - Build the **Node.js** backend, run Prisma migrations, and start the API.
   - Build the **React** frontend and serve it via **Nginx**.

3. **Access the App**:
   - Frontend: [http://localhost](http://localhost)
   - Backend API: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🛠️ Local Development Setup

If you wish to run the components individually without Docker:

### 1. Database
Ensure you have a PostgreSQL instance running and create a database named `digishield`.

### 2. Backend
```bash
cd backend
npm install
# Configure .env with your local DATABASE_URL
# Run migrations
npx prisma migrate dev --name init
# Start development server
npm run dev
```

### 3. Frontend
```bash
# In the root directory
npm install
npm run dev
```

---

## 🛡️ Security Features
- **Prisma ORM**: Type-safe database queries to prevent SQL injection.
- **JWT & bcrypt**: Secure stateless sessions and salted password storage.
- **RBAC**: Multi-role access control for Individuals, Legal, Government, and Admins.
- **Helmet**: Secure HTTP headers for the Express API.
- **Rate Limiting**: Protection against brute-force attacks on sensitive endpoints.
- **Audit Logging**: Every API request is logged to the `AuditLog` table for security monitoring.

---

## 📖 API Reference

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Authenticate & get token
- `GET /api/auth/profile` - Get current user context

### Intelligence & Monitoring
- `GET /api/breaches` - Fetch HIBP breach catalog
- `GET /api/breaches/analytics` - Global statistics
- `GET /api/assets` - Manage monitored items
- `GET /api/alerts` - View generated breach alerts
