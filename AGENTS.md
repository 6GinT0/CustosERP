---
name: CustosERP-Orchestrator
description: Global Architect and Lead Orchestrator for CustosERP (Electron + Vue 3 + Prisma). Oversees the integration between Main and Renderer processes.
---

## 🏗️ Project Architecture Overview

CustosERP is a desktop application split into two main processes coordinated by **electron-vite**. All logic must strictly follow the separation of concerns:

1.  **Backend (Main Process)**: Database management (Prisma), file system access, and system security.
2.  **Frontend (Renderer Process)**: User interface, reactivity, and service consumption.

## 🛠️ Global Tech Stack

### 🎨 Frontend (`src/renderer`)

- **Framework**: Vue 3 (Composition API with `<script setup>`).
- **UI**: Vuetify 3 (Prioritize utility classes: `d-flex`, `pa-4`, `text-h5`).
- **Validation**: Vee-Validate + Zod v3 (Centralized schemas).
- **State**: VueUse (`createGlobalState`). **DO NOT use Pinia yet**.
- **Features**: `vue-leaflet` (Argentina Georef Maps), `vue3-apexcharts` (Data Viz).

### ⚙️ Backend & OS (`src/main`)

- **ORM**: Prisma (SQLite/PostgreSQL).
- **Communication**: IPC (Inter-Process Communication) via `contextBridge`.
- **Bundler**: `electron-vite`.

## 🤖 Sub-Agents & Scope

For specific tasks, reference and follow the instructions in the local agent files:

| Agent                    | Location                 | Responsibility                                                       |
| :----------------------- | :----------------------- | :------------------------------------------------------------------- |
| **Backend Orchestrator** | `src/main/AGENTS.md`     | Prisma logic, IPC handlers, app lifecycle, and security.             |
| **UI Architect**         | `src/renderer/AGENTS.md` | `@renderer` folder structure, `_components`, and `window.api` usage. |

## 🛠️ Global Build & Tooling Skills

| Skill       | Path                                         | Activation Triggers                                      |
| :---------- | :------------------------------------------- | :------------------------------------------------------- |
| **Vite**    | `/.agents/skills/vite`                       | `vite.config`, `electron-vite`, `alias`, `env variables` |
| **Testing** | `/.agents/skills/vue-testing-best-practices` | `vitest`, `unit test`, `mock`, `expect`                  |

## 📏 Global Development Rules

1.  **Communication Bridge**: Never expose Node.js modules directly to the frontend. All data flow must pass through the bridge defined in `src/preload/index.ts`.
2.  **Alias Strategy**:
    - `@renderer`: Points to the frontend source folder.
    - `#`: Points to the project root (used for shared `#/types`).
3.  **Data Integrity**: The backend is the single source of truth. The frontend must validate data before submission but rely on Prisma types provided by the main process.
4.  **Argentine Context**: Address searches must integrate with the **Argentine Government Georef API** as defined in the UI Architect agent.

## 🚀 Workflow for New Features

When a new feature is requested (e.g., "Create Inventory Module"):

1.  **Back**: Define Prisma Model -> Create Service -> Register IPC Handler.
2.  **Bridge**: Expose the method in the Preload script.
3.  **Front**: Create Zod Schema -> Create Composable/Page -> Implement Vuetify UI.
