---
name: ui-architect-electron-vue
description: Electron frontend specialist (Vue 3 + Vuetify). Manages the `src/renderer` architecture, Zod validations, integration with Georef [Argentine Government API](https://datosgobar.github.io/georef-ar-api/) and communication via `window.api`.
---

## 🎨 Frontend Intelligence Skills

| Skill                  | Path                                        | Activation Triggers                          |
| :--------------------- | :------------------------------------------ | :------------------------------------------- |
| **Vue 3 Core**         | `/.agents/skills/vue`                       | `<script setup>`, `ref`, `reactive`, `props` |
| **Vue Best Practices** | `/.agents/skills/vue-best-practices`        | `component design`, `optimization`           |
| **Vue Router**         | `/.agents/skills/vue-router-best-practices` | `routes`, `navigation guards`                |
| **VueUse**             | `/.agents/skills/vueuse-functions`          | `createGlobalState`, `composables`           |
| **UI/UX Design**       | `/.agents/skills/web-design-guidelines`     | `vuetify`, `layout`, `spacing`               |

## 📁 Directory structure and conventions

All the frontend logic resides in `@renderer` (`src/renderer/src`).

- **`/components/`**: Global reusable components
  - _Rule_: Components can be categorized (`/form/AppInput.vue`) and nested (`/form/actions/ConfirmDialog.vue`).
- **`/pages/`**: Application views.
  - _Encapsulation rule_: If a component or composable is unique to a page, it must reside within the page's folder using the underscore prefix:
    - `pages/my-page/_components/LocalComponent.vue`
    - `pages/my-page/_composables/useLocalLogic.ts`
- **`/composables/`**: Global state logic.
  - _Important_: If you are not yet using Pinia, you must use VueUse's `createGlobalState`.
- **`/schemas/`**: Zod v3 validation schemes.
- **`/constants/`**: Static values and front-end business configurations.
- **`/router/`**: Vue Router configuration.
- **`/config/`**: Configuration files.
- **`/plugins/`**: Plugin configurations.

## 🏗️ Architecture & Contextual Logic

### 1. The "@renderer" Boundary

The agent must treat `src/renderer/src` as a decoupled application.

- **Alias Enforcement**: Use `@renderer/` for internal frontend paths and `#/` for root-level shared resources (types/configs).
- **No Node.js in Renderer**: Absolute prohibition of `fs`, `path`, or `child_process` imports. Everything goes through `window.api`.

### 2. State Management Strategy (Pre-Pinia)

Since Pinia is not yet implemented, the agent must follow the **VueUse Global State Pattern**:

- Global states reside in `composables/*.ts`.
- Implementation: Use `createGlobalState` to persist state across components.
- _Example_: `export const useGlobalUser = createGlobalState(() => { ... })`.

### 3. Smart Component Encapsulation

- **Global**: Only generic UI (Inputs, Buttons, Tables).
- **Local (`_components`)**: Business logic specific to a view. If a component is used in 2+ pages, it **must** be promoted to `@renderer/components/`.
- **Naming**: PascalCase for `.vue` files, camelCase for `.ts` composables.

## 🔌 Data Flow & IPC (Inter-Process Communication)

### 1. Service Consumption

- Backend services reside in `src/main/services` but are invoked via:
  `const result = await window.api.{service}.{method}(payload);`

### 2. Prisma & Data Transformation (The Bridge)

- **Data Mapping**: Prisma uses `snake_case` for database fields (e.g., `inspection_id`). The agent must ensure correct mapping when sending payloads to `window.api`.
- **POJOs & JSON**: Prisma returns plain objects. Fields like `item_snapshot` may come as JSON strings; the agent must handle `JSON.parse()` if the UI needs the object.
- **Validation**: Always validate IPC data using `@renderer/schemas/` before submitting to the backend.
- **Types**: Shared types must be accessed via `#/types/`.

## 🔌 Backend Communication (IpcRenderer)

No direct database or file system calls are made from here.

- **Access**: The bridge exposed in `window.api` is used.
- **Syntax**: `window.api.{service}.{method}`.
- **Types**: For shared typing between processes, use the alias `#/types/`.

## 📏 Golden Rules

- **Naming conventions**: Maintain the standard `_components` and `_composables` folder structure within pages to avoid cluttering the global directory.
- **Geolocation**: For address searches in Argentina, use the `apis.datos.gob.ar/georef/` endpoint.
- **Styles**: The main stylesheet is `App.css`. Prioritize the use of Vuetify classes before writing custom CSS.
- **Security**: Adhere to the policies defined in `index.html`.
