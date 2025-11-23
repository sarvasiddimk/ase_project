# MVP Definition - Red Panther ASE

## Phase 1: The "Trust & Efficiency" Core
The MVP focuses on the two most critical pain points: **Customer Trust** (Transparency) and **Operational Efficiency** (Workflow). We will build the "Happy Path" for a standard service appointment.

### Core Features

#### 1. Digital Service Workflow (The Backbone)
*   **Technician App (Mobile/Tablet)**:
    *   View assigned jobs.
    *   Digital inspection checklist.
    *   Photo/Video capture for defects.
    *   Clock-in/Clock-out on jobs.
*   **Service Advisor Dashboard (Desktop)**:
    *   Create/Edit appointments.
    *   View technician status.
    *   Generate estimates.

#### 2. Customer Transparency Portal (The Differentiator)
*   **"Uber-style" Status Tracker**: Real-time updates (e.g., "Inspecting", "Waiting for Approval", "Ready").
*   **Digital Approval**: View photos of defects, see costs, and approve/decline work with one click.
*   **Online Payment**: Secure checkout via Stripe/Payment Gateway.

#### 3. Basic Inventory & Customer Management
*   **Customer/Vehicle Database**: CRUD operations for clients and cars.
*   **Parts Lookup**: Simple inventory check (In Stock / Out of Stock).

### User Stories

#### Customer
*   **US-C1**: As a customer, I want to receive a text message with a link to track my car's status so I don't have to call the shop.
*   **US-C2**: As a customer, I want to see a photo of the worn-out part alongside the quote so I trust that the replacement is necessary.
*   **US-C3**: As a customer, I want to approve additional work from my phone so the mechanic can continue without delay.
*   **US-C4**: As a customer, I want to pay my invoice online so I can just pick up my keys and leave.

#### Technician
*   **US-T1**: As a technician, I want to see my daily schedule on a tablet so I know what jobs to prepare for.
*   **US-T2**: As a technician, I want to take a photo of a leak and attach it to the job card so the advisor can show the customer.
*   **US-T3**: As a technician, I want to mark a job as "Complete" to automatically notify the advisor.

#### Service Advisor / Manager
*   **US-A1**: As an advisor, I want to see all active jobs on a dashboard so I can identify bottlenecks.
*   **US-A2**: As an advisor, I want to generate a digital estimate with one click to send to the customer.
*   **US-A3**: As a manager, I want to see a daily report of revenue and completed jobs to track performance.

## Out of Scope for MVP (Phase 2)
*   AI-driven Dynamic Scheduling (Use manual scheduling for MVP).
*   Predictive Maintenance (IoT integration).
*   Advanced Inventory Replenishment Automation.
*   Gamified Technician Performance Tracking.
