# School Management SaaS Demo Context

Last updated: 2026-10-11

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

## Future Domain Architecture Decision

The project should evolve toward a production-style SaaS domain model with separate concerns for the main SaaS site, platform admin, school admin software, and public school websites.

Target domain structure:

```txt
Main SaaS marketing:
yoursaas.com

Platform Super Admin:
admin.yoursaas.com

School Admin Software:
app.yoursaas.com
or school-slug.yoursaas.com/admin

Public School Website:
custom domain: www.schoolname.com
```

Recommended implementation direction:

- Keep the core SaaS/admin software centralized under `app.yoursaas.com`.
- Keep Platform Super Admin under `admin.yoursaas.com`.
- Give each school a public website URL that can later use either a platform subdomain or a custom domain.
- Use `Website Settings` for public website content/configuration.
- Use `Domain` for DNS/custom-domain setup and verification.
- Use `Go to Website` to open the active public website URL for the current school.

Production routing rule:

```txt
request host
-> central domain registry
-> school
-> tenant database
```

Do not trust tenant database names or tenant identity from the client. Always resolve domain/host to school and tenant database from the central platform database.

Suggested future data model additions:

```txt
schools.slug
school_domains
- id
- school_id
- domain
- status: PENDING_VERIFICATION | VERIFIED | ACTIVE | FAILED | DISABLED
- verification_token
- verified_at
- created_at
- updated_at
```

Suggested future rollout:

1. Add `schools.slug` and support school public URLs such as `school-slug.yoursaas.com`.
2. Add a central `school_domains` table.
3. Add DNS verification flow for custom domains.
4. Add domain resolver middleware that maps `Host` to the active school and tenant database.
5. Add SSL/custom-domain automation later through the hosting provider, CDN, reverse proxy, or a service such as Vercel Domains, Cloudflare for SaaS, Caddy, Traefik, or Nginx plus Certbot.

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
backend/src/middleware/auth.ts
backend/src/middleware/schoolAuth.ts
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
backend/src/modules/audit
backend/src/modules/school
backend/src/modules/school-auth
backend/src/modules/school-admin
```

Middleware:

```txt
backend/src/middleware/auth.ts
backend/src/middleware/schoolAuth.ts
backend/src/middleware/globalErrorHandler.ts
```

Shared utilities:

```txt
backend/src/shared/prisma.ts
```

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

Audit logs:

```txt
GET /api/v1/audit-logs
```

Requires:

```txt
Authorization: Bearer <platform token>
```

Returns the latest platform audit events with actor and school details.

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
- School Admin dashboard polished with a sidebar-style admin UI and module groups
- Platform dashboard showing latest audit logs
- Login session persistence with localStorage for both Platform and School modes

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
- Audit log API returns latest provisioning events
- Frontend restores Platform and School sessions after page refresh

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
13. Added audit log API and frontend audit panel.
14. Cleaned up middleware locations: platform auth and school auth middleware now live under `backend/src/middleware`.
15. Added frontend token persistence with localStorage and session restore.
16. Polished created school dashboard UI:
    - desktop left sidebar
    - mobile quick navigation strip
    - Dashboard, Academic, Exams, Finance & HR, Communication, No-Code Tools, Website, Marketplace, Administration groups
    - summary cards for Students, Teachers, Parents, Staff
    - academic/finance snapshots
    - school settings, quick modules, and today tasks panels
    - `lucide-react` installed for shadcn-style icons
17. Added safe school lifecycle controls for Platform Super Admin:
    - deactivate uses `SUSPENDED` and blocks school login
    - activate restores a school to `ACTIVE`
    - permanent delete requires typing the exact school name and drops the tenant database before deleting the central record
    - archive UI/API was later removed by request; migration `20261011085000_add_archived_school_status` remains applied in DB history

## Remaining Work

High-priority remaining items:

1. **Provisioning failure UI**
   - Failed status and error message exist.
   - UI can be improved with clearer failure reason and retry guidance.

2. **Acceptance test script**
   - README has TC-01 to TC-08.
   - Add automated smoke test or documented manual checklist.

3. **Security polish**
   - Move `JWT_SECRET`, `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD` into `.env`.
   - Remove unsafe fallback defaults before any production-like usage.
   - Review npm audit output: install reported 4 high severity vulnerabilities.

4. **API response consistency**
   - Most responses use `{ success, data, message, error }`.
   - Can standardize all controllers fully.

5. **Tenant database lifecycle cleanup**
   - If tenant DB initialization fails after database creation, failed DB remains.
   - For demo this is acceptable.
   - Later add retry/delete/manual cleanup strategy.

6. **Connection pooling**
   - Tenant profile/login opens a new `pg.Pool` per request.
   - For demo this is OK.
   - Later add bounded tenant connection manager/cache.

7. **README encoding**
   - `README.md` displays mojibake in terminal output.
   - Content appears Bengali but encoding/rendering is not clean.
   - Consider rewriting README as UTF-8 clean Markdown later.

## Suggested Next Step

Recommended next task:

```txt
Provisioning failure UI
```

Reason: failed status exists, but the UI can show clearer recovery guidance.

Implementation plan:

1. Improve failed school row display.
2. Show a clearer failed provisioning panel with error message and next action.
3. Add a small guidance text that failed tenants are not active and may need manual cleanup/retry.
4. Keep destructive retry/delete out of scope unless explicitly requested.

Alternative next task:

```txt
Acceptance test script
```

Reason: README has acceptance cases TC-01 to TC-08, and a scripted smoke test would make demo verification faster.
