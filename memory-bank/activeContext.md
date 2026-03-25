# Active Context – Greenbite Order Management

This document captures the **current focus**, **recent changes**, and **next steps** in the Greenbite Order Management project. It is the primary operational view used after each memory reset.

It must stay aligned with:
- `projectbrief.md` – scope and goals.
- `productContext.md` – product/UX intent.
- `systemPatterns.md` – architecture and flows.
- `techContext.md` – concrete tech setup.
- `progress.md` – status and outstanding work.

---

## 1. Current Focus

- Establish and maintain the **Memory Bank** as the single source of truth for the project.
- Understand the high-level architecture and constraints from existing repo structure:
  - `backend/`
  - `frontend/`
  - `docs/` (PDF/DOCX requirements and designs).
- Prepare to:
  - Inspect backend and frontend implementations.
  - Align actual code with the patterns and expectations defined in the Memory Bank.
  - Start documenting concrete tech choices and implemented flows.

At this moment, the focus is **documentation and context-building**, not yet detailed feature implementation.

---

## 2. Recent Changes (This Session)

- Created initial Memory Bank and populated core documents:
  - `projectbrief.md` – high-level description, goals, and definition of done.
  - `productContext.md` – problems solved and UX expectations.
  - `systemPatterns.md` – architecture, domain model, state machine, and critical flows.
  - `techContext.md` – expected stack and development setup assumptions.

These are currently **assumption-based** and must be validated against real code and docs.

---

## 3. Next Steps (High Level)

1. **Inspect Backend**
   - Open `backend/`:
     - Identify stack (Node/TS/Java, frameworks, structure).
     - Identify how orders are represented (models/entities).
     - Identify existing endpoints for orders (create, read, list, status update, cancel).
   - Update:
     - `techContext.md` with actual frameworks, libraries, and scripts.
     - `systemPatterns.md` if architectural patterns differ from assumptions.

2. **Inspect Frontend**
   - Open `frontend/`:
     - Determine framework (React/Angular/Vue/etc.).
     - Identify flows for:
       - Creating an order.
       - Listing orders.
       - Viewing order details / statuses.
   - Update:
     - `techContext.md` with actual tooling and commands.
     - `systemPatterns.md` for any concrete integration patterns (fetch layer, state management).

3. **Connect Implementation to Flows**
   - Map code to the critical flows documented in `systemPatterns.md`:
     - Create order.
     - Update order status.
     - View orders.
   - Document which flows are:
     - Implemented.
     - Partially implemented.
     - Not implemented.
   - Reflect this mapping primarily in `progress.md`.

4. **Refine Memory Bank**
   - Replace assumptions with facts from code and `/docs`:
     - Reconcile with PDFs/DOCX in `/docs` (functional analysis, technical design, user stories).
   - Keep `activeContext.md` in sync whenever:
     - New feature work begins.
     - Significant architecture or tech decisions are made.

---

## 4. Active Decisions & Preferences

- **Documentation-first workflow**
  - Every substantial technical or product decision must be captured in the Memory Bank.
- **Clean architecture bias**
  - Clear separation of API, application services, domain logic, and persistence is preferred.
- **Explicit state machine**
  - Order status transitions must be explicit and validated at the domain level.
- **Incremental refinement**
  - Initial Memory Bank content contains assumptions that must be validated and refined once code is fully inspected.

---

## 5. Important Patterns & Learnings (So Far)

- The project is centered on:
  - Strong order lifecycle management.
  - Clear separation between frontend UX and backend domain logic.
- The Memory Bank itself is a **core project artifact**:
  - It must be read at the start of every session.
  - It must be updated after significant changes.

As of now, learnings are mostly conceptual; concrete implementation learnings will be added after inspecting `backend/` and `frontend/`.

---

## 6. Immediate TODO Snapshot

- Validate assumptions in:
  - `techContext.md` against actual backend/frontend code.
  - `systemPatterns.md` against real domain models and endpoints.
- Build an accurate, code-informed status in `progress.md`:
  - What endpoints and flows already exist.
  - What parts of the frontend are wired to the backend.
  - What remains to implement for the baseline definition of done from `projectbrief.md`.
