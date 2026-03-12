# 🚀 Project Setup Guide

## 📋 Prerequisites

- **Node.js**: v18.x or higher (Recommended: Latest LTS).
- **Package Manager**: `npm` or `pnpm`.
- **Database**: Ensure SQLite (default) or your configured DB is accessible.

---

## 🛠️ Installation Steps

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/6GinT0/CustosERP.git
    cd CustosERP
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory and configure your `DATABASE_URL`.

4.  **Database Initialization**:
    Generate the Prisma client and run migrations:
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```

---

## 🏃 Scripts

| Command         | Description                                           |
| :-------------- | :---------------------------------------------------- |
| `npm run dev`   | Starts the Electron app in development mode with HMR. |
| `npm run build` | Compiles and packages the app for production.         |
| `npm run test`  | Executes the Vitest suite.                            |
| `npm run lint`  | Runs ESLint to check code quality.                    |

---

## 🧪 Testing the Setup

To verify everything is working correctly:

1. Run `npm run dev`.
2. Check if the Vuetify dashboard loads.
3. Verify that `window.api` is available in the browser console.
