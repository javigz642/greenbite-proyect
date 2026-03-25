# Active Context – Greenbite Order Management

This document captures the **current focus**, **recent changes**, and **next steps** in the Greenbite Order Management project. It is the primary operational view used after each memory reset.

It must stay aligned with:
- `projectbrief.md` – scope and goals.
- `productContext.md` – product/UX intent.
- `systemPatterns.md` – architecture and flows.
- `techContext.md` – concrete tech setup.
- `progress.md` – status and outstanding work.

---

## 1. Current Focus (This Session)

- Use the Memory Bank as the **single source of truth** for the project.
- Work with the **actual implemented stack and code** (not assumptions):
  - Backend: Node.js + TypeScript + Express with clean/hexagonal layering.
  - Frontend: React + TypeScript + Vite.
- Keep memory-bank docs aligned with:
  - Backend domain model, use cases, HTTP routes, and tests.
  - Frontend components, types, and API service.
- Maintain documentation while developing/adjusting:
  - Order lifecycle and status transitions.
  - End‑to‑end flows: create order, list orders, update status, cancel.

At this moment, the focus is **synchronizing documentation with the existing backend/frontend implementation and tests**, so that future feature work starts from accurate, code‑verified context.

---

## 2. Recent Changes (This Session)

- Validated that the repository is a **Node.js + TypeScript + Express backend** and a **React + TypeScript + Vite frontend**, and captured that explicitly in `techContext.md`.
- Confirmed backend structure:
  - `backend/src/domain/order.ts`, `orderStatus.ts` – core domain model and status enum.
  - `backend/src/application/usecases/` – use cases:
    - `createOrder.ts`
    - `getOrderById.ts`
    - `listOrders.ts`
    - `updateOrderStatus.ts`
    - `cancelOrder.ts`
  - `backend/src/infrastructure/repositories/` – repository interface and `InMemoryOrderRepository`.
  - `backend/src/infrastructure/http/routes/orderRoutes.ts` – Express routes for order operations.
  - `backend/src/app.ts`, `backend/src/server.ts` – Express app and server bootstrap.
  - Jest configuration and tests:
    - Unit:
      - `backend/test/unit/domain/order.spec.ts`
      - `backend/test/unit/application/createOrder.spec.ts`
    - Integration:
      - `backend/test/integration/http/orders.e2e-spec.ts`
- Confirmed frontend structure:
  - `frontend/src/main.tsx`, `frontend/src/App.tsx` – entrypoint and main app.
  - Components:
    - `frontend/src/components/CreateOrderForm.tsx`
    - `frontend/src/components/OrderList.tsx`
  - Types and API layer:
    - `frontend/src/types/Order.ts`
    - `frontend/src/services/api.ts`
  - Testing setup:
    - `frontend/src/jest.config.ts`
    - `frontend/src/setupTests.ts`
    - Tests:
      - `frontend/src/App.test.tsx`
      - `frontend/src/components/OrderList.test.tsx`
      - `frontend/src/components/createOrderForm.test.tsx`
- Updated `techContext.md` so it is **aligned with real scripts, tools, and folder structure**, including:
  - Backend: Express + Jest + Supertest + ts-node-dev.
  - Frontend: React + Vite + TypeScript, ESLint, Jest‑based test setup.

---

## 3. Next Steps (High Level)

1. **Deep‑dive Backend Behavior**
   - Inspect domain and use cases for business rules:
     - `backend/src/domain/order.ts` and `orderStatus.ts` for the order lifecycle and allowed transitions.
     - Use cases in `backend/src/application/usecases/` to understand:
       - Input/output DTOs (`orderDTO.ts`).
       - Validation and error handling.
       - Status transitions and cancellation rules.
   - Review HTTP layer:
     - `backend/src/infrastructure/http/routes/orderRoutes.ts` for:
       - Route paths and HTTP verbs (create, get by id, list, update status, cancel).
       - Response shapes and status codes.
   - Cross‑check with tests:
     - `backend/test/unit/*` and `backend/test/integration/http/orders.e2e-spec.ts` to confirm expected behavior and edge cases.
   - Update:
     - `systemPatterns.md` with the **actual** state machine and API endpoints if they differ from original assumptions.
     - `progress.md` with which backend flows are fully implemented and covered by tests.

2. **Deep‑dive Frontend Behavior**
   - Inspect UI flows and wiring:
     - `CreateOrderForm.tsx` – how an order is created and validated.
     - `OrderList.tsx` – how orders are fetched, displayed, and refreshed.
     - `App.tsx` – how these components are composed and routed on the main page.
   - Review `frontend/src/services/api.ts`:
     - Endpoints called for:
       - Creating orders.
       - Listing orders.
       - Updating order status.
       - Cancelling orders (if wired).
     - Base URL configuration and error handling.
   - Confirm type alignment:
     - `frontend/src/types/Order.ts` vs backend `orderDTO.ts` and domain model.
   - Check frontend tests:
     - `App.test.tsx`, `OrderList.test.tsx`, `createOrderForm.test.tsx` for:
       - Confirmed UI behavior.
       - Edge cases and error paths covered.
   - Update:
     - `systemPatterns.md` with concrete frontend‑backend integration patterns (how API is used, where state is kept).
     - `progress.md` with which UI flows are implemented, tested, and wired to the backend.

3. **Align Memory Bank with Code & Docs**
   - Compare:
     - Real domain and API behavior vs what is written in:
       - `projectbrief.md`
       - `productContext.md`
       - `systemPatterns.md`
     - Functional/technical docs in `docs/` (PDFs) vs actual implementation.
   - For each mismatch:
     - Decide whether to adjust code or documentation.
     - Capture decisions and rationale in:
       - `systemPatterns.md` (for architecture/domain rules).
       - `progress.md` (for work items).
   - Keep `activeContext.md` focused on:
     - What we are working on **now**.
     - The current, validated picture of the system.

---

## 4. Active Decisions & Preferences

- **Documentation‑aligned development**
  - Code changes should either:
    - Implement what is already documented, or
    - Trigger a documentation update (Memory Bank + `/docs` alignment).
- **Clean architecture enforcement**
  - Keep:
    - Domain logic in `domain/`.
    - Application/use‑case orchestration in `application/usecases/`.
    - HTTP concerns in `infrastructure/http/`.
    - Persistence details in `infrastructure/repositories/`.
- **Explicit order lifecycle**
  - All changes to order status should flow through the domain rules and use cases, not be mutated ad‑hoc in controllers or the frontend.
- **Test‑backed behavior**
  - For any change to domain or endpoints, update or add tests in:
    - `backend/test/unit/...` and/or `backend/test/integration/http/...`
    - `frontend/src/**/*.test.tsx` as relevant.

---

## 5. Important Patterns & Learnings (So Far)

- The project already follows a **layered, testable architecture** on the backend:
  - Domain entities and status enums define core rules.
  - Use cases encapsulate operations on orders.
  - Express routes adapt HTTP calls into use case invocations.
  - Tests exist for both domain and end‑to‑end HTTP behavior.
- The frontend is structured with:
  - Clear separation of concerns:
    - Components for UI (`CreateOrderForm`, `OrderList`).
    - A dedicated API service module (`api.ts`).
    - Shared types for orders.
  - Jest + React Testing Library style tests (via `setupTests.ts` and component tests).
- The Memory Bank is already **partially code‑informed** (especially `techContext.md`), but:
  - `systemPatterns.md` and `progress.md` still need a pass to fully reflect:
    - Actual status transitions, errors, and invariants.
    - Which flows are fully implemented and tested.

---

## 6. Immediate TODO Snapshot

- Backend:
  - [ ] Fully map order lifecycle and transitions from `order.ts`, `orderStatus.ts`, and use cases into `systemPatterns.md`.
  - [ ] Derive a definitive list of order API endpoints and their contracts from `orderRoutes.ts` and integration tests.
- Frontend:
  - [ ] Verify that `CreateOrderForm` and `OrderList` cover all required flows from `projectbrief.md` and `productContext.md`.
  - [ ] Ensure `api.ts` covers all backend order endpoints and that `Order` type matches backend DTOs.
- Memory Bank:
  - [ ] Update `systemPatterns.md` with the code‑accurate domain model, state machine, and API surface.
  - [ ] Update `progress.md` with a clear status matrix:
    - Backend endpoints and tests (done/partial/missing).
    - Frontend flows and tests (done/partial/missing).
  - [ ] Keep this `activeContext.md` in sync as new backend/frontend work is done and new decisions are made.
