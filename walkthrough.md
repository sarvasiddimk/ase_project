# Walkthrough - Phase 2: Job Creation & Invoicing

## Overview
This phase introduces a streamlined **Job Creation Wizard** and professional **Invoicing** capabilities. These features are designed to improve efficiency for service advisors and provide a better experience for customers.

## New Features

### 1. Job Creation Wizard
Located at `/jobs/new`, this multi-step wizard guides you through the intake process:

*   **Step 1: Customer Selection**: Search for an existing customer by name, email, or phone, or quickly create a new customer profile.
*   **Step 2: Vehicle Selection**: Select from the customer's existing vehicles or add a new vehicle (VIN, Make, Model, Year).
*   **Step 3: Job Details**: Enter the initial description of the issue and an optional estimated cost.
*   **Step 4: Review**: Verify all details before creating the job.

### 2. Professional Invoicing
Located at `/invoices/[id]`, the invoice view provides a clean, professional financial document:

*   **Web View**: clear display of line items, totals, and customer/vehicle details.
*   **Print View**: Optimized for printing or saving as PDF. Hides navigation and buttons, ensuring a clean layout on paper.
*   **Automatic Generation**: Invoices are generated based on the job's line items and status.

## Verification

### Automated Tests
*   **Backend Build**: Verified with `npm run build --workspace=apps/api`.
*   **Frontend Build**: Verified with `npm run build --workspace=apps/web`.

### Manual Verification Steps
1.  **Start the App**: Run `npm run dev:web` and `npm run dev:api`.
2.  **Create a Job**:
    *   Navigate to `/jobs/new`.
    *   Search for "John" or create a new customer.
    *   Select a vehicle.
    *   Enter "Oil Change" as the description.
    *   Review and submit.
3.  **View Invoice**:
    *   Navigate to `/invoices/1` (or the ID of the invoice generated).
    *   Click "Print" to see the print-optimized layout.

### 3. Inventory Management
Located at `/inventory`, the dashboard provides real-time stock tracking:

*   **List View**: View all parts with stock levels, prices, and locations.
*   **Low Stock Alerts**: Items below their reorder level are highlighted with a red warning.
*   **Stock Adjustment**: Quickly add or remove stock using the +/- buttons (mock functionality for now).

## Next Steps
*   Integrate the Wizard with the real backend API (currently using mock data/local state).
*   Implement PDF generation on the backend for emailing invoices.
*   Connect Inventory UI to the backend API.
