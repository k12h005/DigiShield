# DigiShield Backend - Real-Time Cyber Intelligence

Professional Node.js backend for the DigiShield platform, designed for Government & Legal Intelligence Hackathon.

## Features
- **Security-First Architecture**: JWT, Bcrypt, Helmet, CORS, Rate Limiting.
- **Role-Based Access Control (RBAC)**: Individual, Legal, Government, Admin roles.
- **Monitoring Engine**: Structured service layer for asset tracking.
- **Risk Scoring**: Modular engine for calculating breach severity.
- **Legal Intelligence**: API endpoints for CERT-In advisories and compliance.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL (Structure prepared with Sequelize)
- **Security**: JWT, Bcrypt, Helmet, Express-Rate-Limit
- **Validation**: Express-Validator

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Update the `JWT_SECRET` and database credentials.

3. **Running the Server**:
   - Development mode (with nodemon):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

## API Documentation

### Auth
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Get access token
- `GET /api/auth/profile` - Get current user profile

### Assets
- `GET /api/assets` - List monitored assets
- `POST /api/assets` - Add new email, phone, or domain
- `DELETE /api/assets/:id` - Remove asset

### Intelligence
- `GET /api/intelligence/advisories` - Latest CERT-In data
- `GET /api/intelligence/compliance` - Role-specific guidance

### Analytics
- `GET /api/analytics/stats` - Dashboard metrics

## Project Structure
- `src/repositories`: Database abstraction layer (PostgreSQL ready).
- `src/services`: Business logic (Risk scoring, Monitoring logic).
- `src/controllers`: Request handling and response formatting.
- `src/middleware`: Security, Auth, and Audit Logging.
