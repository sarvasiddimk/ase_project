# Red Panther ASE - MVP Walkthrough

## Overview
This document outlines the **Red Panther Adaptive Service Ecosystem (ASE)** MVP. The project is a monorepo containing a **NestJS Backend** and a **Next.js Frontend**.

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   npm

### 1. Installation
Install dependencies for the entire monorepo:
```bash
npm install
```

### 2. Running the Backend (API)
The backend runs on port `3000` and uses a local SQLite database (`ase.sqlite`).
```bash
# Terminal 1
cd apps/api
npm run start:dev
```
*   **API Root**: `http://localhost:3000`
*   **Resources**: `/customers`, `/vehicles`, `/service-jobs`, `/job-items`

### 3. Running the Frontend (Web)
The frontend runs on port `3001` (or `3000` if API is on a different port, usually Next.js detects it).
```bash
# Terminal 2
cd apps/web
npm run dev
```
*   **Web App**: `http://localhost:3001`

## 🏗️ Architecture

### Backend (`apps/api`)
Built with **NestJS** and **TypeORM**.
*   **Database**: SQLite (Dev), PostgreSQL (Prod ready).
*   **Modules**:
    *   `Customers`: Manage client profiles.
    *   `Vehicles`: Linked to customers.
    *   `ServiceJobs`: The core workflow entity (Pending -> In Progress -> Completed).
    *   `JobItems`: Parts and Labor line items for billing.

### Frontend (`apps/web`)
Built with **Next.js 14** (App Router) and **Tailwind CSS**.
*   **Layout**: `AppLayout` with sidebar navigation.
*   **Dashboard**: Technician view showing active jobs.
*   **Job Detail**: Dynamic route `/jobs/[id]` showing job status and billing breakdown.

## ✅ Features Implemented (MVP)

### Core Workflow
1.  **Technician Dashboard**: View assigned jobs and their status.
2.  **Job Management**: Track service jobs through their lifecycle.
3.  **Billing Engine**: Calculate totals based on parts and labor items.

### Data Models
*   **Customer**: Name, Contact Info.
*   **Vehicle**: VIN, Make, Model, Year.
*   **ServiceJob**: Status, Description, Linked Vehicle/Customer.
*   **JobItem**: Type (Part/Labor), Quantity, Unit Price.

## 🔮 Next Steps (Phase 2)
*   Connect Frontend to Backend API (currently using mock data in UI).
*   Implement "Customer Portal" for remote approvals.
*   Add Authentication (Auth0 or JWT).
