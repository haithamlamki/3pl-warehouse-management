# 3PL Warehouse Management System

## 1. Overview

This project is a comprehensive Warehouse Management System (WMS) designed for Third-Party Logistics (3PL) providers. It offers a robust backend API built with NestJS to manage all core warehouse operations, from inventory and order management to billing and reporting. The system is designed to be multi-tenant, allowing a 3PL provider to manage the logistics for multiple customers within a single platform.

## 2. Key Features

The platform is organized into several modules, each handling a distinct area of functionality:

*   **Authentication (`/auth`)**: Handles user registration, login (with JWT), token refreshing, and profile management.
*   **Billing (`/billing`)**: A powerful module for managing all financial aspects, including:
    *   **Rate Cards**: Create and manage customer-specific pricing rules for various services.
    *   **Invoicing**: Generate invoices automatically from unbilled transactions or for specific order types.
    *   **Payments**: Record payments against invoices and track their status.
    *   **Batch Processing**: Run billing cycles for all customers for a given period.
*   **Routes (`/routes`)**: Manages delivery routes and stops.
    *   Create, update, and assign routes to drivers.
    *   Track the completion of stops and capture electronic proof of delivery (ePOD).
*   **Reports (`/reports`)**: Provides endpoints for generating various business reports, including:
    *   A main dashboard with key performance indicators (KPIs).
    *   Detailed inventory, order, and financial reports.
*   **Core WMS (`/wms`)**: Manages core warehouse operations like receiving goods (ASN), picking, packing, and putaway.
*   **Customer Portal (`/customer-portal`)**: Exposes customer-facing endpoints for viewing inventory, orders, and shipments.
*   **And more**: Includes modules for managing customers, items, warehouses, users, and notifications.

## 3. Tech Stack

*   **Backend**: NestJS (TypeScript)
*   **Database**: PostgreSQL (managed with TypeORM)
*   **Testing**: Jest

## 4. Getting Started

Follow these instructions to get the backend development environment set up and running.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm
*   Docker and Docker Compose (for running the database)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up the Environment:**
    *   The application uses a `.env` file for configuration. Create a `.env` file in the `backend` directory by copying the `.env.example` file (if it exists) or creating a new one.
    *   Populate the `.env` file with the necessary environment variables, including database credentials and JWT secrets. A typical setup would look like this:
        ```env
        # Database
        DB_HOST=localhost
        DB_PORT=5432
        DB_USERNAME=your_db_user
        DB_PASSWORD=your_db_password
        DB_DATABASE=wms_db

        # JWT
        JWT_SECRET=your_super_secret_key
        JWT_REFRESH_SECRET=your_super_secret_refresh_key
        JWT_EXPIRES_IN=1h
        JWT_REFRESH_EXPIRES_IN=7d
        ```

5.  **Start the Database:**
    *   The repository should contain a `docker-compose.yml` file to easily spin up a PostgreSQL database.
    *   From the root directory, run:
        ```bash
        docker-compose up -d
        ```

6.  **Run Database Migrations:**
    *   Once the database is running, apply the database schema by running the TypeORM migrations:
        ```bash
        npm run migration:run
        ```

### Running the Application

*   **Development Mode (with hot-reloading):**
    ```bash
    npm run start:dev
    ```
    The application will be available at `http://localhost:3000`.

*   **Production Mode:**
    ```bash
    npm run build
    npm run start:prod
    ```

## 5. Running Tests

The project uses Jest for testing.

*   **Run all tests:**
    ```bash
    npm test
    ```

*   **Run tests with coverage report:**
    ```bash
    npm run test:cov
    ```
    The coverage report will be generated in the `coverage/` directory.