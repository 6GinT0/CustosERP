# 🏗️ CustosERP Architecture

## Overview

CustosERP is built as a **Multi-Process Desktop Application** using **Electron + Vite**. It separates the system-level operations (Main) from the User Interface (Renderer).

## 📡 Communication Flow (IPC Bridge)

We follow a strict **Security-First** approach. The Frontend never communicates directly with Node.js or the Database.

1.  **Renderer**: Invokes methods via `window.api.{service}.{method}`.
2.  **Preload**: Acts as a secure gatekeeper using `contextBridge`.
3.  **Main**: Receives requests via `ipcMain.handle`, executes logic in `services/`, and returns POJOs (Plain Old JavaScript Objects).

## 🗄️ Data Layer (Prisma)

- **Engine**: Prisma ORM.
- **Source of Truth**: The database schema is defined in `prisma/schema.prisma`.
- **Mapping Strategy**:
  - **Backend**: Uses `snake_case` for database fields (e.g., `user_id`).
  - **Frontend**: Uses `camelCase` for reactive properties (e.g., `userId`).
  - **Transformation**: Services in `src/main/services` are responsible for this mapping.

## 🎨 Frontend Organization (`@renderer`)

We use a **Feature-Based Encapsulation** model:

- **Global**: Shared components in `/components` and global state in `/composables` (VueUse).
- **Local**: Each page in `/pages` can have its own `_components/` and `_composables/` to avoid global pollution.
- **Validation**: Zod schemas are centralized in `/schemas` to be reused across different views.

## 🛠️ Tooling & Testing

- **Bundler**: `electron-vite` for optimized builds.
- **Unit Testing**: `vitest` for logic validation.
- **Linting**: ESLint + Prettier.
