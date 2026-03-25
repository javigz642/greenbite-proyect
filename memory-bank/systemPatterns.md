# System Patterns – Greenbite Order Management

This document captures the architectural patterns, key technical decisions, and critical flows of the Greenbite Order Management system. It must remain consistent with `projectbrief.md` and `productContext.md`.

---

## 1. High-Level Architecture

### 1.1 Overall Structure

- **Monorepo layout**
  - `backend/` – API, domain logic, persistence.
  - `frontend/` – UI for customers and/or staff.
- **Separation of concerns**
  - Frontend focuses on presentation and UX.
  - Backend owns business rules, validations, and data consistency.

### 1.2 Conceptual Layers (Backend)

Depending on the actual implementation framework, we conceptually use layers:

1. **API Layer (Controllers / Handlers)**
   - Receives HTTP requests.
   - Maps them to use cases / services.
   - Handles HTTP-specific concerns: routing, status codes, serialization.

2. **Application / Service Layer**
   - Implements use cases: create order, get order, list orders, update status, cancel.
   - Coordinates domain logic and persistence.
   - Enforces workflows and authorization checks (where needed).

3. **Domain Layer**
   - Core domain models: `Order`, `OrderItem`, `CustomerInfo`, etc.
   - Contains business rules:
     - Valid status transitions.
     - Invariants (e.g., an order must have at least one item).
   - Prefer rich models instead of anemic DTOs where feasible.

4. **Infrastructure Layer**
   - Persistence (database/repository implementations, in-memory store for MVP).
   - External integrations (future: payment providers, notification services, etc.).
   - Technical utilities (logging, configuration).

### 1.3 Conceptual Layers (Frontend)

1. **View / Components**
   - React/Vue/other components (exact tech defined in `techContext.md`).
   - Responsible for rendering, user interaction, and basic state.

2. **State / Data Layer**
   - Hooks/stores/services wrapping API calls to backend.
   - Centralizes side-effects and data caching where appropriate.

3. **Routing / Navigation**
   - Routes like:
     - `/orders` – list.
     - `/orders/:id` – detail.
     - `/new-order` – create.

---

## 2. Domain Model and Key Entities

### 2.1 Core Entities

- **Order**
  - Identifier: `id`.
  - Customer details: name, contact, address (if delivery).
  - Items: list of `OrderItem`.
  - Monetary fields: totals, taxes, etc. (can be simplified).
  - Status: lifecycle state.
  - Metadata: creation time, updated time, channel, notes.

- **OrderItem**
  - Product reference (id, name, price snapshot).
  - Quantity.
  - Optional modifiers (e.g., preferences, extras) – loosened in MVP.

- **CustomerInfo**
  - Name.
  - Contact details.
  - Optional address/notes.

### 2.2 Order Status State Machine (Conceptual)

A typical lifecycle (names may vary depending on implementation):

- **Initial States**
  - `CREATED` / `PENDING_CONFIRMATION`

- **In-Progress States**
  - `ACCEPTED`
  - `IN_PREPARATION`
  - `READY_FOR_PICKUP` / `READY`

- **Terminal States**
  - `DELIVERED` / `COMPLETED`
  - `CANCELLED`

**Pattern:** We model this as a **finite state machine**:

- Status is always one of the defined states.
- Only allowed transitions are permitted, e.g.:
  - `CREATED → ACCEPTED → IN_PREPARATION → READY → DELIVERED`
  - `CREATED → CANCELLED`
  - `ACCEPTED → CANCELLED` (possibly with conditions).

Invalid transitions (like `DELIVERED → CREATED`) are rejected at the domain level.

---

## 3. Key Patterns and Practices

### 3.1 API Design Patterns

- **Resource-Oriented Endpoints**
  - `/orders` – create, list.
  - `/orders/{id}` – get details.
  - `/orders/{id}/status` – update status or patch order.
- **Clear Response Shapes**
  - Use consistent JSON structures for:
    - `Order` representation.
    - Error responses (`code`, `message`, optional `details`).

- **Validation**
  - Use input DTOs or schemas for:
    - Order creation.
    - Order updates (especially status updates).
  - Validation occurs at the boundary (API layer) before hitting core logic.

### 3.2 Error Handling

- Centralized error handling strategy in the backend:
  - Map domain/application errors to well-defined HTTP responses.
  - Prefer structured error bodies over plain strings.
- Examples:
  - `404 Not Found` – order does not exist.
  - `400 Bad Request` – validation errors or invalid status transitions.
  - `500 Internal Server Error` – unexpected issues.

### 3.3 Persistence & Repositories

Pattern (regardless of concrete DB):

- **Repository / Data Access Abstraction**
  - `OrderRepository` interface with methods like:
    - `create(order)`
    - `findById(id)`
    - `findManyByFilter(filter)`
    - `update(order)`
  - Implementation may be:
    - In-memory for development/MVP.
    - Database-backed (SQL/NoSQL) later.

- **Separation of Domain vs Persistence Models**
  - Optionally separate domain models from persistence schema/ORM entities.
  - Conversions handled at repository or mapper level.

### 3.4 Configuration and Environments

- Keep configuration (DB URLs, API base URLs, feature flags) outside code where possible.
- Dev/staging/prod differences handled via environment variables or config files.

---

## 4. Frontend–Backend Integration Patterns

### 4.1 Data Contracts

- Shared understanding of the `Order` shape:
  - IDs, status enum values, fields for items, totals, timestamps, etc.
- Backend is the **source of truth** for:
  - Status enum values and semantics.
  - Rules related to allowed transitions.

### 4.2 Client-Side Data Handling

- **Fetch Layer / Service Objects**
  - Wrap raw HTTP calls in a service layer (e.g., `orderApi`).
  - Service returns parsed data or throws standardized errors.

- **State Management**
  - Cache lists of orders and current order where useful.
  - Invalidate or refetch on mutations (status updates, new order).

- **Error and Loading States**
  - Components render loading and error states based on service layer output.

---

## 5. Critical Flows

### 5.1 Create Order Flow

1. Frontend:
   - Collects customer & order data.
   - Calls backend endpoint `POST /orders`.

2. Backend:
   - Validates input (missing fields, invalid formats).
   - Instantiates domain `Order` in initial state.
   - Persists via repository.
   - Returns created order (or at least `id` and `status`).

3. Frontend:
   - Shows confirmation with order ID and status.
   - Optionally redirects to order detail page.

### 5.2 Update Order Status Flow

1. Frontend:
   - Staff selects an order and desired next status.
   - Calls backend endpoint (e.g., `PATCH /orders/{id}/status` with target status).

2. Backend:
   - Loads existing order.
   - Checks whether transition from current to target status is valid.
   - If valid:
     - Applies transition in domain model.
     - Persists.
     - Returns updated order.
   - If invalid:
     - Returns validation error (400) with details.

3. Frontend:
   - Updates UI with new status or shows error.

### 5.3 View Orders Flow

1. Frontend:
   - Calls `GET /orders` with optional filters (status, date range).
2. Backend:
   - Validates filters.
   - Queries repository.
   - Returns paginated list of orders.
3. Frontend:
   - Renders list with status badges and relevant metadata.

---

## 6. Cross-Cutting Concerns

### 6.1 Logging

- Log at least:
  - Order creation events.
  - Status changes (old status → new status, actor).
  - Errors and exceptions with context.

### 6.2 Security & Authorization (Conceptual)

- Separate roles in the future (customer vs staff vs admin).
- Backend endpoints enforce role-based access when implemented:
  - Customers only see their own orders.
  - Staff see operational queues.
  - Admins have broader access.

### 6.3 Testing Patterns

- **Unit Tests**
  - Domain logic: status transitions, validation rules.
  - Repositories (with in-memory/fake implementations).

- **Integration Tests**
  - API endpoints with in-memory DB.
  - End-to-end flows: create → update status → retrieve.

(Details can be expanded in a dedicated testing document when needed.)

---

## 7. Relationship to Other Memory Bank Files

- **Aligns with:**
  - `projectbrief.md` – high-level goals, target outcomes.
  - `productContext.md` – problems solved and user experience focus.
- **Feeds into:**
  - `techContext.md` – concrete tech choices to realize these patterns.
  - `activeContext.md` – what patterns are actively used and where.
  - `progress.md` – which flows and patterns are implemented vs pending.
