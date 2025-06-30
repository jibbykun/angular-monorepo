# Angular Monorepo

---

## ✨ Features

- **Modern Angular Dashboard**: Responsive UI with Tailwind CSS, dark mode toggle, and improved UX.
- **Task Management**: Sorting, filtering, categorization, and drag-and-drop reordering (Angular CDK).
- **Role-Based Access Control**: Owner/Admin/Viewer roles enforced in both UI and backend (RBAC).
- **Inline Editing**: Edit tasks directly in the dashboard for non-Viewer roles.
- **Audit Log**: View audit log entries from the backend.
- **Comprehensive Testing**: Jest tests for backend (controllers, services, RBAC) and frontend (UI, logic, role-based access, sorting, editing). E2E scaffolding present.

---

## 🚀 Setup Instructions

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Database setup:**
   - Uses SQLite by default (`db.sqlite`). No manual setup required for development.
   - For production, configure your preferred database in TypeORM config or environment variables.
3. **Environment variables:**
   - Create a `.env` file if needed for secrets, DB config, etc.

---

## 🖥️ How to Run

### Backend (NestJS API)

```sh
nx serve api
```

- Runs on [http://localhost:3333](http://localhost:3333) by default.

### Frontend (Angular Dashboard)

```sh
nx serve dashboard
```

- Runs on [http://localhost:4200](http://localhost:4200) by default.

---

## 🏗️ Architecture Overview

- **Monorepo:** Managed by Nx, containing both frontend (Angular) and backend (NestJS) apps.
- **Apps:**
  - `api`: NestJS backend (REST API, TypeORM, RBAC)
  - `dashboard`: Angular frontend (Tailwind CSS, role-based UI, drag-and-drop, inline editing)
- **E2E:**
  - `api-e2e`, `dashboard-e2e`: End-to-end test scaffolding (expandable)
- **Shared Libraries:**
  - Common code, models, and utilities can be placed in `libs/` (add as needed)

---

## 📦 Monorepo Design

- **Nx** provides project graph, code sharing, and consistent tooling.
- **Apps** are isolated but can share code via libraries.
- **Consistent linting, testing, and build scripts** across all projects.

---

## 🧩 Shared Libraries and Core Modules

- **Common modules:** Guards, decorators, interfaces in `apps/api/src/app/common/`.
- **Models:** `Task`, `User`, `Organisation`, `Role`, `Permission` in their feature folders.
- **Frontend models:** In `apps/dashboard/src/app/models/`.

---

## 🗃️ Data Model Explanation

- **User:** Belongs to an Organisation, has a Role.
- **Organisation:** Contains Users and Tasks.
- **Task:** Has title, assignee, organisation, category, completed status, and order (for drag-and-drop).
- **Role:** Owner, Admin, Viewer (can be extended).
- **Permission:** Linked to roles for access control.

### ERD (Entity Relationship Diagram)

```
[User] -- (many) ---< [Task] >--- (many) -- [Organisation]
   |                                 ^
   |                                 |
   v                                 |
 [Role]                         [Category]
```

_For a full ERD, use a tool like dbdiagram.io or draw.io with the above relationships._

---

## 🔐 Access Control Implementation

- **Roles:** Owner, Admin, Viewer
- **Permissions:**
  - Owner/Admin: Can add, edit, delete, and view tasks
  - Viewer: Can only view tasks
- **Guards:**
  - `roles.guard.ts`: Checks user role for each endpoint (Viewer can only GET tasks)
  - `task-owner.guard.ts`: Ensures only task owners can modify their tasks
- **Organisations:**
  - Users and tasks are scoped to organisations

---

## 🏢 How Roles, Permissions, and Orgs Work

- **Role-based UI:**
  - Only non-Viewer roles see add/edit/delete options in the dashboard
  - All roles can view tasks
- **Backend enforcement:**
  - Guards restrict API access based on user role and organisation

---

## 📚 API Docs

### Get Tasks

`GET /api/tasks`

**Response:**

```json
[
  {
    "id": 1,
    "title": "Sample Task",
    "assignedTo": { "id": 2, "name": "Alice" },
    "organisation": { "id": 1, "name": "Org1" },
    "category": "work",
    "completed": false
  }
]
```

---

### Create Task

`POST /api/tasks`

**Request:**

```json
{
  "title": "New Task",
  "assignedTo": { "id": 2 },
  "organisation": { "id": 1 },
  "category": "personal"
}
```

**Response:**

```json
{
  "id": 2,
  "title": "New Task",
  "assignedTo": { "id": 2, "name": "Alice" },
  "organisation": { "id": 1, "name": "Org1" },
  "category": "personal",
  "completed": false
}
```

---

### Audit Log

`GET /api/audit-log`

**Response:**

```json
["User A created task 1", "User B updated task 2"]
```

---

## 🔮 Future Considerations

- **Persist drag-and-drop order to backend** for consistent ordering across sessions
- **Complex Role Delegation:**
  - Support for custom roles, granular permissions, and delegation chains
- **Production-Ready Security:**
  - Implement JWT authentication and refresh tokens
  - Use HTTPS and secure cookie/session management
  - Audit logging of all sensitive actions
  - Rate limiting and brute-force protection
  - CSRF protection for state-changing endpoints
  - RBAC caching for performance
- **Scaling Permission Checks:**
  - Use in-memory or distributed caching for permission lookups
  - Optimize DB queries for large orgs and user bases
- **Scalability:**
  - Move to a production database (Postgres, MySQL, etc.)
  - Use caching and background jobs for heavy operations
- **Testing:**
  - Expand E2E and integration test coverage

---

## 🧪 Testing Strategy

**Backend (NestJS API):**

- Uses **Jest** for unit and integration tests.
- Test files are in `apps/api/src/app/**/*.spec.ts`.
- RBAC logic, controllers, and services are covered.
- Run all backend tests with:
  ```sh
  nx test api
  ```

**Frontend (Angular Dashboard):**

- Uses **Jest** (with Angular TestBed) for component and state logic tests.
- Main tests in `apps/dashboard/src/app/app.spec.ts`:
  - Rendering, role-based UI, filtering, sorting, drag-and-drop, and inline editing are covered.
- Run all frontend tests with:
  ```sh
  nx test dashboard
  ```

**E2E:**

- Cypress and other e2e tests are scaffolded in `apps/dashboard-e2e` and `apps/api-e2e`.
- Expand E2E coverage as needed for production.

---

## 🟢 Current Test Coverage

- **Backend:** All core RBAC, controller, and service logic is tested and passing.
- **Frontend:** Main dashboard component logic and UI are tested and passing.
- **Role-based UI:** Verified by tests for Owner/Admin/Viewer.
- **Filtering, sorting, drag-and-drop, and editing:** Covered by new tests.

---

## 📝 How to Add More Tests

- Add new `.spec.ts` files alongside components or services.
- Use Angular’s TestBed for component tests.
- Use Jest’s mocking utilities for service and API tests.

---

## ℹ️ Project Status

This project is **stable, modern, and well-documented**. All core features are implemented and tested. See "Future Considerations" for recommended next steps for production or advanced deployments.
