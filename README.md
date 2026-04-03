# Slooze 🍔

Slooze is a premium, full-stack food delivery platform tailored for seamless user ordering and intuitive restaurant management. Built with modern, type-safe technologies.

## Tech Stack

**Frontend**
- Next.js 14+ (App Router)
- React & TypeScript
- Tailwind CSS v4 (Dark Mode Glassmorphism Theme)
- Lucide React (Icons)
- Custom Fetch-based GraphQL Client

**Backend**
- NestJS
- GraphQL (Apollo Server)
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Features

* **Authentication:** Secure signup and login flow leveraging JWTs seamlessly securely stored.
* **Role-Based Access Control:** Separate capabilities for `MEMBER`, `MANAGER`, and `ADMIN`.
* **Dynamic Menu & Cart:** Browse restaurant menus and efficiently build your order with a sticky cart widget.
* **Manager Tools:** Special permissions allowing users with the `MANAGER` role to instantly add new menu items directly from the UI.
* **Orders & Checkout:** End-to-end checkout mocking, creating active orders via GraphQL mutations.
* **Payment Management:** Add, save, and delete personal credit/debit payment methods visually.

## Getting Started

To run this application locally, you will need two terminal tabs open—one for the backend, and one for the frontend.

### 1. Backend Setup (NestJS + Prisma)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file with your PostgreSQL database URL (e.g., `DATABASE_URL="postgresql://user:password@localhost:5432/slooze"`) and JWT secrets if defined.
4. Run database migrations and generate the Prisma Client:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. Start the backend development server (runs on `http://localhost:3000` by default):
   ```bash
   npm run start:dev
   ```

### 2. Frontend Setup (Next.js)

1. Open a new terminal tab and navigate into the frontend framework:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. The frontend will likely start on `http://localhost:3001` (since port 3000 is occupied by NestJS). Open this URL in your browser.

## Walkthrough & Usage

- **Signing Up:** You can create a new account via the `/signup` screen. Choose `MEMBER` to test ordering, or choose `MANAGER` to unlock the "Add Item" interface.
- **Testing Menu Items:** By default, if a restaurant doesn't exist, looking up its ID (e.g., `1`) and trying to add a menu item (as a Manager) will intelligently auto-create the foundational Restaurant model for you in the database.

---
*Developed with modern interface guidelines for top-tier visual excellence.*
