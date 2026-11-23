# Nexora — Business Operations SaaS

Portfolio-oriented full-stack starter built with React + Vite, Java 21 + Spring Boot, Spring Security/JWT, and MySQL.

## Features
- Register/login with JWT and BCrypt password hashing
- Role-based access: ADMIN, MANAGER, MEMBER
- Dashboard summary with project/task metrics
- Create and list projects
- Create, assign, filter, and update tasks
- Team directory
- Calendar and deadline planning
- Workspace notifications
- Delivery insights
- Profile settings and team role management
- Responsive light SaaS dashboard UI
- Request validation and centralized API error handling

This is a portfolio/learning project, not a production-ready multi-tenant SaaS. Before public deployment, add automated tests, email verification, password reset, rate limiting, audit logs, tenant isolation, observability, and secret management.

## Requirements
- Java 21
- Maven 3.9+
- Node.js 20+
- MySQL 8+

## 1. Create database
In MySQL Workbench:
```sql
CREATE DATABASE nexora;
```

## 2. Configure backend
Edit `backend/src/main/resources/application.properties`. Set DB username/password for your MySQL installation. Defaults are `root` / `root`.

## 3. Run backend
Open VS Code terminal:
```bash
cd backend
mvn spring-boot:run
```
Backend: `http://localhost:8080/api`

Hibernate creates/updates tables on first run.

## 4. Run frontend
Open a second VS Code terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

## 5. First use
- Register an account. The first registered user becomes ADMIN; later registrations become MEMBER.
- ADMIN/MANAGER can create projects and tasks.
- Tasks can be assigned to team members.
- Use dashboard filters and task status controls to demonstrate the workflow.

For a demo manager account, register a second account, then update that user role to MANAGER in MySQL only for local portfolio testing:
```sql
UPDATE users SET role='MANAGER' WHERE email='manager@example.com';
```

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard/summary`
- `GET /api/team`
- `GET /api/projects`
- `POST /api/projects` (ADMIN/MANAGER)
- `GET /api/tasks`
- `POST /api/tasks` (ADMIN/MANAGER)
- `PATCH /api/tasks/{id}/status`
- `PATCH /api/tasks/{id}/assign` (ADMIN/MANAGER)
- `DELETE /api/tasks/{id}`
- `PUT /api/projects/{id}` (ADMIN/MANAGER)
- `PATCH /api/projects/{id}/status` (ADMIN/MANAGER)
- `DELETE /api/projects/{id}` (ADMIN/MANAGER)
- `GET /api/notifications`
- `PATCH /api/notifications/{id}/read`
- `PATCH /api/notifications/read-all`
- `PATCH /api/team/{id}/profile`
- `PATCH /api/team/{id}/role` (ADMIN)

## Security
Set `JWT_SECRET` to a long random secret outside local development. Do not commit real passwords or secrets.
