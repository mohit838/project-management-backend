# Project Management System - Backend

A robust, role-based project management backend built with Node.js, TypeScript, and PostgreSQL. This system features an invitation-based onboarding process, secure authentication (JWT), and granular access control.

## Features

- **Invitation-Only Registration**: Users can only register via admin-generated invites.
- **Role-Based Access Control (RBAC)**: Defined roles (`ADMIN`, `MANAGER`, `STAFF`) with specific permissions.
- **Authentication**: JWT-based auth with Access and Refresh tokens.
- **Project Management**: Full CRUD for projects with **Soft Delete** mechanism.
- **User Management**: Administrative tools to manage user roles and activation status.
- **Validation**: Strict request validation using Zod.
- **Email Integration**: Automated invitation emails (NodeMailer).
- **Rate Limiting**: Protects APIs against brute-force and DoS attacks using `express-rate-limit`.

---

## Tech Stack

- **Runtime**: Node.js (v22+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT (jsonwebtoken)
- **Testing**: Vitest & Supertest
- **Email**: NodeMailer

---

## Project Structure

```text
src/
├── config/       # Environment & global configurations
├── lib/          # Third-party library initializations (Prisma, JWT, Mailer)
├── middlewares/  # Express middlewares (Auth, Role, Error Handling)
├── modules/      # Feature-based modules (Auth, Users, Projects)
│   ├── [module]/
│   │   ├── [module].routes.ts
│   │   ├── [module].controller.ts
│   │   ├── [module].service.ts
│   │   └── [module].schema.ts
├── routes/       # Route aggregation
├── utils/        # Shared utilities (AsyncHandler, HttpError)
├── app.ts        # App setup
└── server.ts     # Server entry point
```

---

## Setup & Installation

### Prerequisites
- Node.js (v22 or higher)
- pnpm (recommended)
- PostgreSQL database

### 1. Clone & Install
```bash
git clone <repository-url>
cd project-management-backend
pnpm install
```

### 2. Configure Environment
Create a `.env` file from the example:
```bash
cp .env.example .env
```
Fill in your database and SMTP credentials.

### 3. Database Migration & Seeding
```bash
npx prisma migrate dev
pnpm run seed
```
*The seed script creates a default Admin account (see `.env.example`).*

### 4. Run the App
```bash
# Development
pnpm run dev

# Build & Start
pnpm run build
pnpm start
```

---

## Deployment with Docker

The project includes a `docker-compose.yml` for easy deployment with PostgreSQL.

### 1. Prerequisites
- Docker and Docker Compose installed.

### 2. Configure Environment
Docker Compose uses an `.env` file to inject environment variables into the application container. The database service also relies on environment variables for its initial configuration.

Ensure you have a `.env` file with the following minimum variables:
```env
# App
PORT=4000
NODE_ENV=production
DATABASE_URL=postgresql://root:password@db:5432/pm_db?schema=public

# Database
POSTGRES_USER=root
POSTGRES_PASSWORD=password
POSTGRES_DB=pm_db

# External Ports (Experimental)
APP_EXTERNAL_PORT=3214
DB_EXTERNAL_PORT=5432
```

### 3. Start Services
```bash
docker-compose up -d --build
```
This will start:
-   **pm-backend**: The application container.
-   **pm-postgres**: The PostgreSQL 17 database.
-   **pm-network**: A shared bridge network for secure communication between services.

---

## CI/CD with Jenkins

A `Jenkinsfile` is provided to automate the deployment process.

### Pipeline Stages
1.  **Checkout**: Pulls code from the repository.
2.  **Inject Environment Variables**: Creates the `.env` file from Jenkins credentials or parameters.
3.  **Build and Deploy**: Runs `docker-compose up -d --build`.

### Jenkins Setup
- **Credentials**: Store sensitive data (e.g., `POSTGRES_PASSWORD`, `JWT_ACCESS_SECRET`) in **Jenkins -> Manage Credentials** as "Secret text".
- **Parameters**: Use Pipeline Parameters for configurable values like `APP_EXTERNAL_PORT`.

---

## Testing

```bash
pnpm test
```

---

## Architecture & Decisions

### 1. Feature-Based Modularity
Each core entity (`Auth`, `User`, `Project`) is encapsulated within its own module. This improves maintainability and allows for easier scaling of specific features.

### 2. Role-Based Access Control (RBAC)
Used a centralized `requireRole` middleware that checks the role embedded in the JWT payload.
- **Admin**: Full system access (Invite users, update roles, edit/delete any project).
- **Manager/Staff**: Can view projects and create new ones, but cannot edit or delete.

### 4. Rate Limiting
To ensure system stability and security, we implement two levels of rate limiting:
- **Global API Limit**: 100 requests per 15 minutes for all `/api` routes.
- **Auth Limit**: Stricter limit of 20 requests per 15 minutes for `/api/auth` routes to prevent brute-force attacks.

### 3. Soft Delete Implementation
Projects are marked as `isDeleted: true` instead of physical deletion. This preserves historical data and audit trails while filtering them out from standard listing queries.

### 4. JWT Strategy
Implemented an Access + Refresh token strategy. Access tokens are short-lived, while refresh tokens are stored in `HttpOnly` cookies to mitigate XSS risks and maintain secure sessions.

---

## Tradeoffs & Assumptions

- **Invite Expiration**: Set to 24 hours for security.
- **Email Simulation**: While NodeMailer is configured, you can use tools like Mailtrap for development testing.
- **No User Deletion**: Per requirements, users are "deactivated" rather than deleted to maintain database integrity.

---

## Author

**Mohitul Islam**
[GitHub Profile](https://github.com/mohit838)
