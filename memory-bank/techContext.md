# Tech Context – Greenbite Order Management

This document describes the technologies, development setup, and technical constraints for the Greenbite Order Management project. It complements `projectbrief.md`, `productContext.md`, and `systemPatterns.md`.

---

## 1. Repository & Project Layout

- **Root:** `greenbite-order-management/`
  - `backend/` – backend service (HTTP API, domain logic, in‑memory persistence).
  - `frontend/` – frontend React application (UI for customers/staff).
  - `docs/` – functional analysis, technical design, and user stories (PDF/DOCX).
  - `memory-bank/` – project memory and documentation.

This repository is a **TypeScript/Node.js + React/Vite** monorepo with a separated `backend` and `frontend`.

---

## 2. Backend – Actual Tech Stack

### 2.1 Core Technologies

- **Runtime:** Node.js (LTS recommended).
- **Language:** TypeScript.
- **Framework:** Express.
- **Architecture:**
  - Clean‑architecture / hexagonal‑style layering:
    - `domain/` – core domain model and business rules.
    - `application/usecases/` – application services / use cases.
    - `infrastructure/http/` – HTTP layer (Express app & routes).
    - `infrastructure/repositories/` – persistence adapters (currently in‑memory).
- **Data Layer:**
  - In‑memory repository implementation:
    - `InMemoryOrderRepository` for order persistence during development and testing.
  - No external database is wired yet.

### 2.2 Dependencies & Libraries

From `backend/package.json`:

- **Runtime dependencies:**
  - `express` – HTTP framework.
  - `cors` – CORS middleware.
  - `@types/cors` – TypeScript types for CORS.

- **Dev dependencies:**
  - TypeScript toolchain:
    - `typescript`
    - `ts-node-dev` – dev‑time TypeScript runner with restart.
    - `@types/node`
  - Testing:
    - `jest` – test runner.
    - `ts-jest` – Jest TypeScript transformer.
    - `@types/jest`
    - `supertest` – HTTP integration testing.
    - `@types/supertest`
  - Framework typings:
    - `@types/express`

- **API Style:**
  - REST‑style JSON endpoints for orders, via Express routes in `infrastructure/http/routes/orderRoutes.ts`.

---

## 3. Frontend – Actual Tech Stack

### 3.1 Core Technologies

- **Framework:** React.
- **Language:** TypeScript.
- **Bundler / Dev Server:** Vite (`frontend/vite.config.ts`).
- **Structure (high level):**
  - `src/main.tsx` – React entrypoint.
  - `src/App.tsx` – main application component.
  - `src/components/` – UI components, e.g.:
    - `CreateOrderForm.tsx`
    - `OrderList.tsx`
  - `src/services/api.ts` – API client / fetch wrapper to backend.
  - `src/types/Order.ts` – shared frontend type(s) for orders.
  - `src/App.css`, `src/index.css` – styling.

### 3.2 Integration with Backend

- Frontend uses a **REST API** exposed by the backend, via functions defined in `src/services/api.ts`.
- Order shape on the frontend is captured in `src/types/Order.ts` and is expected to mirror the backend DTO (`backend/src/application/dtos/orderDTO.ts`).
- Backend base URL is currently configured directly inside the frontend (in `api.ts`) and should be externalized to environment variables when needed (e.g. via `VITE_API_BASE_URL` in `.env`).

---

## 4. Development Setup

### 4.1 Prerequisites

- **Node.js & npm** installed.
- Recommended:
  - Node LTS version (e.g., 18+).
  - npm as the primary package manager (lockfiles present for backend and frontend).

### 4.2 Backend – Commands

From `backend/package.json` scripts:

- **Install dependencies:**
  - `cd backend && npm install`
- **Run in development (watch mode with TypeScript):**
  - `cd backend && npm run dev`
  - Runs `ts-node-dev --respawn --transpile-only src/server.ts`
- **Build for production:**
  - `cd backend && npm run build`
  - Compiles TypeScript to `dist/`.
- **Start compiled server:**
  - `cd backend && npm start`
  - Runs `node dist/server.js`
- **Testing:**
  - `cd backend && npm test` – all tests.
  - `cd backend && npm run test:unit` – unit tests (e.g. domain, application).
  - `cd backend && npm run test:integration` – integration/e2e tests (HTTP).

Backend is expected to listen on a configurable port defined in `src/server.ts` / `src/app.ts` (Express app), to be aligned with frontend API base URL.

### 4.3 Frontend – Commands

From `frontend` (Vite + React + TypeScript):

- **Install dependencies:**
  - `cd frontend && npm install`
- **Run dev server:**
  - `cd frontend && npm run dev`
  - Starts Vite dev server (default `http://localhost:5173` unless configured otherwise).
- **Build for production:**
  - `cd frontend && npm run build`
- **Preview production build:**
  - `cd frontend && npm run preview` (if script exists in `package.json`).

Environment variables for Vite should be prefixed with `VITE_` (e.g., `VITE_API_BASE_URL`).

---

## 5. Technical Constraints & Considerations

### 5.1 Constraints

- **Single Repo, Local First**
  - Backend and frontend are both run locally; no external services required in the current state.
- **In‑Memory Persistence**
  - Order data is not persisted across restarts; the `InMemoryOrderRepository` is suitable for development and testing but not production.
- **Clean Architecture**
  - Domain model (e.g., `Order`, `orderStatus`) is insulated from infrastructure details via repositories and use cases.

### 5.2 Performance & Scalability

- Current focus is correctness, clarity, and test coverage.
- Once a real database is introduced, consider:
  - Repository implementation backed by DB.
  - Indexing and query optimization.
  - Horizontal scaling for API if needed.

### 5.3 Security

- At this stage, endpoints are likely unsecured and intended for trusted/development environments.
- Future additions may include:
  - Basic auth or token-based auth.
  - CORS configuration tightening.
  - Input validation and sanitization in HTTP layer.

---

## 6. Tooling & Conventions

### 6.1 Code Quality

- TypeScript is the main language on both backend and frontend.
- ESLint and/or Prettier are likely configured on the frontend (see `frontend/eslint.config.js`); backend linting may be added later.
- Recommended conventions:
  - Keep domain, application, and infrastructure concerns separated.
  - Use DTOs (`backend/src/application/dtos/orderDTO.ts`) as the boundary between HTTP and domain.

### 6.2 Testing

- **Backend:**
  - Using Jest and Supertest.
  - Test locations:
    - Unit tests:
      - `backend/test/unit/domain/order.spec.ts`
      - `backend/test/unit/application/createOrder.spec.ts`
    - Integration tests:
      - `backend/test/integration/http/orders.e2e-spec.ts`
- **Frontend:**
  - No explicit test framework is confirmed yet from open files; expected to use Vite-compatible test tooling if needed (e.g. Vitest/RTL in later iterations).

### 6.3 Logging & Observability

- Backend currently likely uses basic `console.log`-style logging within Express middleware/handlers.
- No centralized logging or metrics yet.

---

## 7. Relationship to Other Memory Bank Files

- **Informed by**
  - `projectbrief.md` – defines what must be built.
  - `productContext.md` – expectations from a product/UX perspective.
  - `systemPatterns.md` – domain model, order lifecycle, and API surface.
- **Feeds**
  - `activeContext.md` – concrete tech stack snapshot (Node + TS + Express backend, React + Vite frontend, in‑memory repository).
  - `progress.md` – status of backend API implementation, tests, and frontend wiring.

This file is now aligned with the actual backend and frontend tech stack; it must be revised if:
- A real database is introduced.
- The HTTP/API layer changes structure or framework.
- Frontend state management or routing libraries are added.
