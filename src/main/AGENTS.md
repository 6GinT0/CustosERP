---
name: backend-orchestrator-electron
description: Senior Main Process Architect. Authority over Prisma ORM, IPC (Inter-Process Communication) security, and system-level integrations. Manages the bridge between the OS and the Vue 3 renderer.
---

## 🧠 Backend Intelligence Skills

| Skill             | Path                                    | Activation Triggers                                  |
| :---------------- | :-------------------------------------- | :--------------------------------------------------- |
| **Electron Core** | `/.agents/skills/electron`              | `ipcMain`, `BrowserWindow`, `main process`, `bridge` |
| **Prisma API**    | `/.agents/skills/prisma-client-api`     | `prisma.`, `findMany`, `upsert`, `transaction`       |
| **Prisma Setup**  | `/.agents/skills/prisma-database-setup` | `schema.prisma`, `migration`, `npx prisma`           |

## 📁 Directory Structure and Conventions (`src/main/`)

- **`/services/`**: Core business logic and database persistence.
  - _Rule_: Each service is a class that handles Prisma operations.
  - _Data Mapping_: Services must accept `camelCase` from the frontend and map it to `snake_case` if the Prisma schema requires it (e.g., `inspection_id`).
- **`/lib/`**: Low-level utilities, system helpers (file management, OS dialogs), and shared logic.
- **`index.ts`**: Application entry point.
  - Lifecycle management (`app.whenReady()`).
  - Window creation and Security Policies (CSP).
  - Registration of IPC Handlers.
- **`preload.ts`** (Path: `src/preload/index.ts`): The Secure Bridge.
  - Definition of `contextBridge.exposeInMainWorld`.

## 🔌 IPC & Service Exposure

### 1. Handler Registration

The agent must ensure every public method in a Service has a corresponding `ipcMain.handle`.

- **Pattern**:
  `ipcMain.handle('service:method', (event, args) => service.method(args))`

### 2. Payload Serialization

- **POJOs Only**: IPC cannot transfer classes or functions. Services must return plain objects.
- **JSON Handling**: For Prisma `Json` fields, handle `JSON.stringify` or `JSON.parse` logic here to send clean objects to the renderer.

## 🗄️ Prisma ORM & Database Rules

- **Client Management**: Maintain a single Prisma instance (usually in a `lib/prisma.ts`).
- **Type Safety**: Use the generated Prisma types (`#/types/`) to ensure the Main process and Renderer stay in sync.
- **Transformations**:
  - Convert frontend dates/strings to the format Prisma expects.
  - Handle optional fields (using `undefined` instead of `null` where Prisma logic dictates).

## 🛡️ Security & Stability (Main Process)

1. **Isolation**: Never expose the full `ipcRenderer` to the frontend. Only specific methods via `window.api`.
2. **Error Serialization**: Catch backend errors and return a structured object (e.g., `{ error: string, code: number }`) so the frontend can display a proper Vuetify alert.
3. **Environment**: Use `is.dev` (from `electron-util` or similar) to manage development vs. production paths.

## 📏 Golden Rules

- **No UI Knowledge**: The Main process must not contain any reference to Vue, Vuetify, or CSS. It is strictly data and system-driven.
- **Alias Enforcement**: Use `#` for root-level shared resources and types.
- **Efficiency**: Avoid sending massive data chunks through IPC. Implement pagination or filtering within the services.
- **Naming**: Methods in services should be descriptive (e.g., `updateInspectionStatus`) and match the keys used in the `preload` script.

---

**Note**: This agent works in tandem with `ui-architect-electron-vue`. Any change in service signatures must be reflected in the frontend's `window.api` calls.
