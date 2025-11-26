# Implementation Plan - Adaptive Service Ecosystem (ASE)

# Goal Description
Define the technical foundation for the Adaptive Service Ecosystem (ASE), a cloud-based SaaS platform for automotive service providers. This plan outlines the high-level architecture, technology stack, and core data models required to support the "Trust," "Efficiency," and "Capability" pillars.

## User Review Required
> [!IMPORTANT]
> **Microservices vs. Monolith**: We are proposing a **Microservices** architecture from the start to support independent scaling of modules (e.g., Scheduling vs. Billing). This adds initial complexity but ensures long-term scalability.
> **AI/ML Integration**: We are assuming the use of managed AI services (e.g., Vertex AI / OpenAI API) for the "Dynamic Scheduling" and "Predictive Maintenance" features to reduce operational overhead.

## Proposed Architecture

### High-Level Design
The system will be built as a **Microservices Architecture** with a **Frontend-Backend separation**.

*   **Frontend**: Single Page Application (SPA) / Progressive Web App (PWA) for cross-platform accessibility (Desktop for admins, Mobile/Tablet for technicians and customers).
*   **API Gateway**: Central entry point for routing, authentication, and rate limiting.
*   **Backend Services**:
    *   **Identity Service**: AuthN/AuthZ, User Management (Staff, Customers).
    *   **Core Service**: Job management, Vehicle data, Customer profiles.
    *   **Scheduling Service**: AI-driven booking, Bay management, Technician availability.
    *   **Inventory Service**: Parts tracking, Stock levels, Replenishment.
    *   **Billing Service**: Invoicing, Payments, Financial reporting.
    *   **Notification Service**: SMS, Email, Push notifications.
*   **Data Layer**: Polyglot persistence (Relational for core data, NoSQL for logs/telemetry, Blob storage for images/videos).

### Technology Stack

#### Frontend
*   **Framework**: **Next.js** (React) - for SEO, performance, and rich ecosystem.
*   **Styling**: **Tailwind CSS** - for rapid, custom design.
*   **State Management**: **Zustand** or **TanStack Query** - for efficient server state management.

#### Backend
*   **Language**: **Node.js (TypeScript)** or **Python (FastAPI)**.
    *   *Recommendation*: **Node.js (TypeScript)** for shared types with frontend and high I/O performance. **Python** for the specific AI/Scheduling service.
*   **Framework**: **NestJS** (if Node) or **FastAPI** (if Python).
*   **API**: **REST** for standard CRUD, **GraphQL** for complex data fetching (optional), **WebSockets** for real-time updates (status changes).

#### Database
*   **Relational (Core)**: **PostgreSQL** - robust, reliable, supports JSONB.
*   **Caching**: **Redis** - for session management and real-time data.
*   **Object Storage**: **AWS S3** or **Google Cloud Storage** - for vehicle photos/videos.

#### Infrastructure / DevOps
*   **Containerization**: **Docker**.
*   **Orchestration**: **Kubernetes** (K8s) or **Serverless Containers** (e.g., Google Cloud Run, AWS Fargate).
*   **CI/CD**: **GitHub Actions**.

## Data Model (Core Entities)

### Customers
*   `id`: UUID
*   `name`: String
*   `contact_info`: JSON (Email, Phone)
*   `preferences`: JSON

### Vehicles
*   `id`: UUID
*   `customer_id`: UUID (FK)
*   `vin`: String (Unique)
*   `make`: String
*   `model`: String
*   `year`: Integer
*   `telematics_id`: String (Optional)

### Service_Jobs
*   `id`: UUID
*   `vehicle_id`: UUID (FK)
*   `status`: Enum (Pending, In_Progress, Blocked, Completed, Paid)
*   `technician_id`: UUID (FK)
*   `bay_id`: UUID (FK)
*   `scheduled_start`: Timestamp
*   `estimated_end`: Timestamp
*   `actual_start`: Timestamp
*   `actual_end`: Timestamp

### Inventory_Items
*   `id`: UUID
*   `sku`: String
*   `name`: String
*   `quantity_on_hand`: Integer
*   `reorder_level`: Integer
*   `cost_price`: Decimal
*   `sell_price`: Decimal

## Verification Plan

### Automated Tests
*   **Unit Tests**: Jest/Vitest for frontend and backend logic.
*   **Integration Tests**: Supertest for API endpoints.
*   **E2E Tests**: Playwright for critical user flows (Booking -> Service -> Payment).

### Manual Verification
*   **Prototype Walkthrough**: Verify the "Trust" flow (Customer receives link, views photos, approves work).

# Phase 2: Job Creation & Invoicing

## Goal Description
Streamline the intake process with a multi-step wizard for creating new service jobs and provide professional invoicing capabilities. This addresses the "Efficiency" pillar by reducing data entry time and the "Trust" pillar by providing clear, professional financial documents.

## Proposed Changes

### Backend (`apps/api`)

#### [NEW] Invoice Module
*   **Entity**: `Invoice`
    *   `id`: UUID
    *   `job_id`: UUID (FK to ServiceJob)
    *   `invoice_number`: String (Sequential, e.g., INV-2024-001)
    *   `issued_at`: Timestamp
    *   `due_date`: Timestamp
    *   `status`: Enum (Draft, Issued, Paid, Void)
    *   `total_amount`: Decimal
    *   `tax_amount`: Decimal
    *   `line_items`: JSONB (Snapshot of job items at time of invoicing)
*   **Controller/Service**:
    *   `POST /invoices`: Generate invoice from Job ID.
    *   `GET /invoices/:id`: Get invoice details.
    *   `GET /jobs/:id/invoice`: Get invoice for a specific job.

#### [MODIFY] ServiceJob Module
*   Add `invoice_id` (FK, nullable) to `ServiceJob` entity to link back to the invoice.

### Frontend (`apps/web`)

#### [NEW] Job Creation Wizard (`/jobs/new`)
A multi-step form using a wizard pattern:
1.  **Customer**: Search existing or create new.
2.  **Vehicle**: Select from customer's vehicles or add new.
3.  **Job Details**: Initial status, description, estimated completion.
4.  **Review**: Summary before creation.

#### [NEW] Invoice View (`/invoices/:id`)
*   **Web View**: Standard React component displaying invoice details.
*   **Print View**: CSS `@media print` styles to ensure the invoice looks professional when printed/saved as PDF.
    *   Hide navigation/sidebar.
    *   Clean layout with logo, address, line items, and totals.

## Verification Plan

### Automated Tests
*   **Backend**: Unit tests for `InvoiceService` (calculation logic).
*   **E2E**: Playwright test for the full flow: Create Customer -> Create Vehicle -> Create Job -> Generate Invoice.

### Manual Verification
*   **Wizard Usability**: Test the wizard with various edge cases (new customer, existing customer, new vehicle).
*   **Print Layout**: Use browser "Print to PDF" to verify the invoice layout.

# Phase 3: Inventory Management

## Goal Description
Implement a robust inventory tracking system to manage parts, fluids, and supplies. This ensures that the shop knows what is in stock, what needs reordering, and allows for accurate costing of jobs.

## Proposed Changes

### Backend (`apps/api`)

#### [NEW] Inventory Module
*   **Entity**: `InventoryItem`
    *   `id`: UUID
    *   `sku`: String (Unique)
    *   `name`: String
    *   `description`: String (Optional)
    *   `quantityOnHand`: Integer
    *   `reorderLevel`: Integer
    *   `costPrice`: Decimal
    *   `sellPrice`: Decimal
    *   `location`: String (Optional - e.g., "Shelf A1")
*   **Service Methods**:
    *   `create(dto)`: Create new item.
    *   `findAll(query)`: Search/Filter items.
    *   `adjustStock(id, quantity, reason)`: Increment/Decrement stock.
*   **Controller**:
    *   Standard CRUD endpoints.
    *   `POST /inventory/:id/adjust`: Endpoint for stock adjustments.

### Frontend (`apps/web`)

#### [NEW] Inventory Dashboard (`/inventory`)
*   **List View**: Table displaying items with columns for SKU, Name, Quantity, Price, and Status (In Stock, Low Stock, Out of Stock).
*   **Search/Filter**: Filter by name, SKU, or low stock status.

#### [NEW] Add/Edit Item (`/inventory/new`, `/inventory/[id]`)
*   Form to create or update inventory items.
*   Validation for unique SKU and non-negative values.

#### [NEW] Stock Adjustment
*   Quick action to add or remove stock (e.g., receiving shipment or manual correction).

## Verification Plan

### Automated Tests
*   **Backend**: Unit tests for `adjustStock` ensuring quantity doesn't drop below zero (unless allowed) and alerts are triggered (future).
*   **E2E**: Create Item -> Adjust Stock -> Verify List View.

### Manual Verification
*   **Low Stock Indicator**: Manually reduce stock below reorder level and verify UI indication.

# Phase 4: Scheduling & Appointments

## Goal Description
Enable efficient management of service appointments and technician schedules. This addresses the "Efficiency" pillar by optimizing bay/technician utilization and the "Trust" pillar by providing reliable appointment times to customers.

## Proposed Changes

### Backend (`apps/api`)

#### [NEW] Scheduling Module
*   **Entity**: `Appointment`
    *   `id`: UUID
    *   `customerId`: UUID (FK)
    *   `vehicleId`: UUID (FK)
    *   `serviceJobId`: UUID (FK, nullable - created later)
    *   `startTime`: Timestamp
    *   `endTime`: Timestamp
    *   `status`: Enum (Scheduled, Confirmed, Cancelled, Completed)
    *   `notes`: String
*   **Service Methods**:
    *   `create(dto)`: Book new appointment.
    *   `findAll(range)`: Get appointments for a date range.
    *   `checkAvailability(date)`: Check open slots.

### Frontend (`apps/web`)

#### [NEW] Scheduling Dashboard (`/schedule`)
*   **Calendar View**: Interactive calendar (using a library like `react-big-calendar` or similar custom implementation) showing appointments.
*   **Booking Modal**: Form to create new appointments, selecting customer, vehicle, and time slot.
*   **Drag-and-Drop**: Ability to reschedule appointments by dragging them to new slots (if library supports).

## Verification Plan

### Automated Tests
*   **Backend**: Unit tests for `checkAvailability` to prevent double booking.
*   **E2E**: Book Appointment -> Verify on Calendar.

### Manual Verification
*   **Conflict Check**: Try to book two appointments at the same time and verify error.

# Phase 5: API Integration & Polish

## Goal Description
Connect the frontend UI components (Job Wizard, Inventory Dashboard, Scheduling Dashboard) to the real backend APIs. This transitions the application from a prototype with mock data to a fully functional MVP.

## Proposed Changes

### Frontend (`apps/web`)

#### [MODIFY] Job Creation Wizard (`/jobs/new`)
*   **Customer Step**: Replace mock search with `GET /customers?search=...`.
*   **Vehicle Step**: Replace mock vehicle list with `GET /vehicles?customerId=...`.
*   **Submit**: POST payload to `/service-jobs` (may need new endpoint or update existing).

#### [MODIFY] Inventory Dashboard (`/inventory`)
*   **List View**: Fetch data from `GET /inventory`.
*   **Stock Adjustment**: Call `POST /inventory/:id/adjust`.

#### [MODIFY] Scheduling Dashboard (`/schedule`)
*   **Calendar**: Fetch appointments from `GET /scheduling`.
*   **Booking**: Submit new appointments to `POST /scheduling`.

### Backend (`apps/api`)
*   **CORS**: Ensure CORS is enabled for the frontend URL.
*   **Validation**: Verify DTO validation is working correctly for all endpoints.

## Verification Plan

### Automated Tests
*   **E2E**: Full system test: Create Customer -> Add Vehicle -> Book Appointment -> Create Job -> Add Parts (Inventory) -> Generate Invoice.

### Manual Verification
*   **Data Persistence**: Create data in UI, refresh page, verify data remains.
