# School Management SaaS Demo Context

Last updated: 2026-10-10

This file is the handoff note for continuing the demo project from another PC or another Codex session.

## Project Goal

Build a small demo that proves this workflow:

```txt
Platform Super Admin login
-> create school
-> central platform DB record
-> separate PostgreSQL database per school
-> tenant schema initialization
-> initial School Admin account
-> school status ACTIVE or FAILED
```

This is not the full School Management System. Student admission, attendance, fees, exams, payroll, accounting, OMR, SMS/email campaign, subscription/billing, and full custom-domain automation are intentionally out of scope for this demo.

## Tech Stack

- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: Node.js + Express.js + TypeScript
- ORM: Prisma
- Database: PostgreSQL
- Password hashing: bcryptjs
- Auth token: jsonwebtoken

## Current Run Commands

Backend:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Production-style local backend build:

```bash
cd backend
npm run build
npm run start
```

Production-style frontend build:

```bash
cd frontend
npm run build
```

Default local URLs:

```txt
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

## Environment Variables

Backend `.env` currently needs:

```txt
PORT=5000
DATABASE_URL="postgresql://..."
POSTGRES_ADMIN_URL="postgresql://..."   # optional; falls back to DATABASE_URL
JWT_SECRET="change-this"
SUPER_ADMIN_EMAIL="superadmin@example.com"
SUPER_ADMIN_PASSWORD="Admin@12345"
CORS_ORIGIN="http://localhost:3000"
```

Notes:

- `DATABASE_URL` is used for the central platform database.
- `POSTGRES_ADMIN_URL` is used for `CREATE DATABASE`. If missing, `DATABASE_URL` is used.
- Current Neon URL works, but Node/pg prints an SSL warning for `sslmode=require`. Later consider `sslmode=verify-full`.
- Do not commit real secrets.

Frontend can optionally use:

```txt
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

If not set, frontend falls back to `http://localhost:5000`.

## Seeded Credentials

Platform Super Admin:

```txt
email: superadmin@example.com
password: Admin@12345
```

School Admin credentials are created during school provisioning:

```txt
email: schoolEmail entered in Create School form
password: initialAdminPassword entered in Create School form
```

Example known demo school credential from previous smoke test:

```txt
email: demo142108@example.com
password: School@12345
```

## Backend Structure

Main files:

```txt
backend/src/app.ts
backend/src/server.ts
backend/src/config/index.ts
backend/src/shared/prisma.ts
backend/src/errors/AppError.ts
backend/src/middleware/globalErrorHandler.ts
```

Module file pattern:

```txt
*.controller.ts
*.interface.ts
*.route.ts
*.service.ts
*.validation.ts
```

Implemented modules:

```txt
backend/src/modules/auth
backend/src/modules/school
backend/src/modules/school-auth
backend/src/modules/school-admin
```

Shared middleware:

```txt
backend/src/shared/auth.middleware.ts
backend/src/shared/schoolAuth.middleware.ts
```

There is also `backend/src/middleware/auth.ts`, currently empty, and `backend/src/middleware/globalErrorHandler.ts`, now implemented. Later cleanup should standardize middleware locations.

## Database Work Done

Prisma schema now includes central platform models:

- `PlatformUser`
- `PlatformRole`
- `PlatformUserRole`
- `School`
- `TenantDatabase`
- `AuditLog`

Enums:

- `PlatformUserStatus`
- `SchoolStatus`
- `TenantDatabaseStatus`

Initial migration created:

```txt
backend/prisma/migrations/20261010081043_init_platform/migration.sql
```

Seed script:

```txt
backend/prisma/seed.ts
```

Seed creates:

- `SUPER_ADMIN` role
- platform Super Admin user
- platform user role link

## Tenant Database Initialization

When a school is created:

1. Backend checks duplicate `schoolEmail`.
2. Central `schools` row is created with `PROVISIONING`.
3. Central `tenant_databases` row is created with `PENDING`.
4. Backend generates safe database name like `school_<uuid>`.
5. PostgreSQL `CREATE DATABASE` runs.
6. Tenant DB tables are created with raw SQL:
   - `roles`
   - `users`
   - `school_settings`
7. Initial `SCHOOL_ADMIN` role is inserted.
8. Initial School Admin user is inserted with bcrypt hashed password.
9. School becomes `ACTIVE`; tenant DB becomes `INITIALIZED`.
10. If provisioning fails, school becomes `FAILED`.

## Implemented API Endpoints

Health:

```txt
GET /
GET /health
```

Platform auth:

```txt
POST /api/v1/auth/login
```

Body:

```json
{
  "email": "superadmin@example.com",
  "password": "Admin@12345"
}
```

Platform schools:

```txt
GET /api/v1/schools
POST /api/v1/schools
```

Requires:

```txt
Authorization: Bearer <platform token>
```

Create school body:

```json
{
  "schoolName": "ABC School",
  "schoolEmail": "admin@abc.edu",
  "initialAdminPassword": "School@12345"
}
```

School auth:

```txt
POST /api/v1/school-auth/login
```

Body:

```json
{
  "email": "admin@abc.edu",
  "password": "School@12345"
}
```

School admin:

```txt
GET /api/v1/school-admin/me
```

Requires:

```txt
Authorization: Bearer <school token>
```

This endpoint proves the user can login through the school tenant DB and read profile/settings from that same tenant DB.

## Frontend Work Done

Main frontend file:

```txt
frontend/src/app/page.tsx
```

Implemented UI:

- Platform/School login toggle
- Platform Super Admin login
- School Admin login
- School provisioning dashboard
- School count summary
- Create School form
- School list table with tenant DB status
- School Admin dashboard showing tenant-loaded profile/settings

Layout metadata updated:

```txt
frontend/src/app/layout.tsx
```

## Global Error Handling Done

Added:

```txt
backend/src/errors/AppError.ts
backend/src/middleware/globalErrorHandler.ts
```

`app.ts` now includes:

- not-found handler
- global error handler at the end

Known response examples:

Invalid login:

```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": {
    "code": "INVALID_CREDENTIALS"
  }
}
```

Unknown route:

```json
{
  "success": false,
  "message": "Route not found",
  "error": {
    "code": "ROUTE_NOT_FOUND"
  }
}
```

Duplicate school:

```json
{
  "success": false,
  "message": "A school with email adcschool@gmail.com already exists",
  "error": {
    "code": "DUPLICATE_SCHOOL_EMAIL",
    "details": {
      "field": "schoolEmail"
    }
  }
}
```

## Duplicate School Handling Done

School creation now:

- trims and lowercases `schoolEmail`
- checks central DB before provisioning
- returns clean `409 Conflict`
- does not create another central record or tenant database when duplicate email is found

## Verification Already Run

Backend:

```txt
npm run prisma:generate
npx prisma migrate dev --name init_platform
npm run prisma:seed
npm run typecheck
npm run build
```

Frontend:

```txt
npm run lint
npm run build
```

Manual smoke tests run:

- Platform Super Admin login works
- School create works
- Separate tenant DB is created
- Tenant DB tables are initialized
- School Admin login works from tenant DB
- School Admin profile loads from tenant DB
- Duplicate school email returns clean 409
- Invalid login uses global error handler
- Unknown route uses global error handler

## Work Done So Far

1. Read root `README.md` and architecture document.
2. Added backend scripts/config/health route.
3. Added auth module pattern:
   - `auth.controller.ts`
   - `auth.interface.ts`
   - `auth.route.ts`
   - `auth.service.ts`
   - `auth.validation.ts`
4. Added Prisma central platform schema.
5. Added migration and seed for Super Admin.
6. Added real Platform Super Admin login.
7. Added School module:
   - list schools
   - create school
   - automatic tenant database provisioning
   - tenant DB initialization
8. Added frontend Super Admin dashboard.
9. Added School Admin login from tenant DB.
10. Added School Admin tenant profile endpoint and dashboard.
11. Polished duplicate school email handling.
12. Added global error handler and `AppError`.

## Remaining Work

High-priority remaining items:

1. **Middleware cleanup**
   - There is `backend/src/shared/auth.middleware.ts`.
   - There is also `backend/src/middleware/auth.ts`, currently empty.
   - Decide one location and standardize.

2. **Audit log API and UI**
   - Audit rows are being created for provisioning start/completed/failed.
   - Need endpoint to list audit logs.
   - Need frontend panel/table to show audit events.

3. **Provisioning failure UI**
   - Failed status and error message exist.
   - UI can be improved with clearer failure reason and retry guidance.

4. **Frontend token persistence**
   - Current token is kept in React state only.
   - Refresh loses login.
   - For demo, localStorage is acceptable.
   - For production, use secure HttpOnly cookie/session strategy.

5. **Acceptance test script**
   - README has TC-01 to TC-08.
   - Add automated smoke test or documented manual checklist.

6. **Security polish**
   - Move `JWT_SECRET`, `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD` into `.env`.
   - Remove unsafe fallback defaults before any production-like usage.
   - Review npm audit output: install reported 4 high severity vulnerabilities.

7. **API response consistency**
   - Most responses use `{ success, data, message, error }`.
   - Can standardize all controllers fully.

8. **Tenant database lifecycle cleanup**
   - If tenant DB initialization fails after database creation, failed DB remains.
   - For demo this is acceptable.
   - Later add retry/delete/manual cleanup strategy.

9. **Connection pooling**
   - Tenant profile/login opens a new `pg.Pool` per request.
   - For demo this is OK.
   - Later add bounded tenant connection manager/cache.

10. **README encoding**
   - `README.md` displays mojibake in terminal output.
   - Content appears Bengali but encoding/rendering is not clean.
   - Consider rewriting README as UTF-8 clean Markdown later.

## Suggested Next Step

Recommended next task:

```txt
Audit log API and frontend audit panel
```

Reason: README explicitly includes Basic Audit Log, and backend already writes audit rows. This is a natural next demo-completeness step.

Implementation plan:

1. Add `audit` module:
   - `audit.controller.ts`
   - `audit.interface.ts`
   - `audit.route.ts`
   - `audit.service.ts`
2. Add `GET /api/v1/audit-logs`.
3. Protect it with Platform Super Admin auth.
4. Show latest audit logs in frontend Platform dashboard.

Alternative next task:

```txt
Middleware cleanup
```

Reason: reduces confusion before the codebase grows.
