# Product Context – Greenbite Order Management

## 1. Why This Project Exists

Greenbite requires a reliable and coherent way to manage customer orders from the moment they are placed until they are fulfilled or cancelled. The project exists to:

- Reduce operational chaos around order intake and tracking.
- Provide a single source of truth for order status.
- Improve the experience for customers, staff, and managers by making order flows visible and predictable.
- Establish a foundation that future Greenbite services and tools can build upon.

Without this system, orders risk being:

- Lost or duplicated across channels (web, phone, in-person, etc.).
- Handled inconsistently by different staff members.
- Difficult to audit or analyze over time.

## 2. Problems It Solves

### Operational Problems

- **Fragmented Order Handling**
  - Orders might be stored in spreadsheets, emails, or ad-hoc tools.
  - Hard to coordinate between kitchen, delivery, and front-of-house.

- **Poor Visibility**
  - Staff and management lack a clear, unified view of what’s pending, in progress, or done.
  - Customers aren’t clearly informed about where their order is in the process.

- **Inconsistent Processes**
  - Each staff member might follow their own informal rules for handling orders.
  - No central enforcement of valid status transitions or deadlines.

### Customer Experience Problems

- **Unclear Status & Expectations**
  - Customers don’t know when their order will be ready or delivered.
  - Limited feedback when something goes wrong (e.g., item unavailable).

- **Limited Self-Service**
  - Customers can’t easily review or track existing orders.
  - Cancellations or changes require manual interventions and phone calls.

### Data & Growth Problems

- **Limited Reporting**
  - Hard to answer basic questions like:
    - How many orders were placed today?
    - What are peak times?
    - Which products are most frequently ordered?
  - Difficult to make data-driven decisions.

- **Difficult to Integrate**
  - Without a clean order management core, integrating new channels (mobile app, partner platforms, etc.) becomes expensive and error-prone.

## 3. How the Product Should Work (Conceptual)

### High-Level Flow

1. **Order Placement**
   - A customer initiates an order via the frontend (web or app).
   - They select items, quantities, and provide required details (e.g., delivery address, notes).

2. **Order Validation & Creation**
   - Backend validates the request (required fields, formats, basic business rules).
   - An order is created with an initial status (e.g., `CREATED` or `PENDING_CONFIRMATION`).
   - The customer receives an order identifier.

3. **Order Processing**
   - Staff view the order in an operations UI or dashboard.
   - They confirm and move it through the internal workflow (e.g., `ACCEPTED → IN_PREPARATION → READY`).
   - If needed, they can mark it as `CANCELLED` with reasons.

4. **Fulfillment**
   - Once fulfilled (e.g., picked up or delivered), the order moves to a terminal state (`DELIVERED`, `COMPLETED`, or similar).
   - The system records relevant timestamps and metadata.

5. **Post-Order**
   - Historical orders are viewable for both customers (recent history) and staff (operational history).
   - Aggregated data can be used for analysis and reporting.

### Core Product Capabilities

- **Order Capture**
  - Capture all relevant information for an order in a structured, consistent way.

- **Order Status Tracking**
  - Provide a clear status field with well-defined transitions.
  - Allow both frontend and backend to understand current state at a glance.

- **Order Search & Filter**
  - Allow staff to search and filter orders by status, customer, timeframe, etc.
  - Allow customers to see their recent orders.

- **Notification Hooks (Conceptual / Future)**
  - Send confirmations or updates to customers when status changes.
  - Notify staff when new orders arrive.

## 4. User Experience Goals

### For Customers

- **Clarity**
  - They can easily see:
    - Whether their order was accepted.
    - What the current status is.
    - Any relevant timing information (if provided, e.g., estimated ready/delivery time).

- **Trust**
  - Status updates feel consistent and reliable.
  - Errors (e.g., invalid data, unavailable items) are clearly communicated.

- **Simplicity**
  - Ordering flow is straightforward and predictable.
  - No unnecessary steps; required information is clearly requested.

### For Staff / Operators

- **Situational Awareness**
  - A clear overview of active orders, with priority or timing cues where relevant.
  - Ability to quickly spot bottlenecks (e.g., too many pending orders).

- **Efficiency**
  - Minimal clicks / friction to update statuses.
  - Easy to filter and find specific orders (e.g., by status, by customer, by time).

- **Consistency**
  - The system guides them to follow the same workflow for all orders.
  - Valid transitions enforced by the backend prevent mistakes.

### For Administrators / Managers

- **Control**
  - Visibility into high-level metrics (volumes, cancellations, time windows).
  - Understanding of where operational issues may be occurring.

- **Confidence in Data**
  - Orders and statuses are trustworthy and can be used for reporting and forecasting.

## 5. Product Boundaries and Scope (Current)

### In-Scope Behaviors (Initial Phases)

- Creating and reading orders through a consistent API.
- Updating order status according to defined rules.
- Viewing lists of orders (at least basic list + detail views).
- Handling basic validation and clear error messages.
- Providing the basis for simple operational dashboards.

### Out-of-Scope (Until Explicitly Included)

- Full-featured inventory management.
- Payment gateway integrations and full payment lifecycle.
- Complex loyalty programs, coupons, and promotions.
- Omni-channel orchestration across many external partners.

## 6. UX Principles & Quality Bar

- **Predictability:** Same actions produce the same results; status transitions are always coherent.
- **Feedback:** Actions that change state (create, update, cancel) should confirm success/failure clearly.
- **Resilience:** The system should handle typical edge cases gracefully (invalid requests, missing data, not found orders).
- **Transparency:** Where possible, expose clear reasons for failures or rejected operations.

## 7. Relationship to Other Memory Bank Files

- This document describes the **product perspective**: why the system exists and what experience it should deliver.
- It must stay aligned with:
  - `projectbrief.md` for scope and high-level goals.
  - `systemPatterns.md` for how the architecture realizes these product needs.
  - `techContext.md` for the actual technologies chosen to implement the product.
  - `activeContext.md` and `progress.md` for what is currently implemented and under active development.
