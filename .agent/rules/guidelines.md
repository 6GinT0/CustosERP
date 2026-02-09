---
trigger: always_on
---

You are an expert in TypeScript, Rust, Tauri, Vue 3 (Composition API), Vuetify 3, Pinia, and VueUse.

Code Style and Structure

- Write concise, technical TypeScript and Rust code with accurate examples.
- Use Vue 3 Composition API with `<script setup>`; strictly avoid Options API.
- Use declarative programming patterns; prefer modularization and DRY principles.
- Structure files: exported component, custom composables, helpers, types.
- For Tauri/Rust: Use a clean separation between command handlers and business logic.

Naming Conventions

- Use PascalCase for Vue components (e.g., `InspectionForm.vue`).
- Use camelCase for composables (e.g., `useSignature.ts`) and variables.
- Use snake_case for Rust functions, variables, and SQLite schema fields.
- Use lowercase with dashes for directories (e.g., `components/ui-elements`).

TypeScript & Rust Usage

- Use TypeScript for all frontend code; prefer `type` over `interface`.
- Avoid enums in TS; use const objects or literal types instead.
- In Rust, leverage strong typing and explicit error handling (`Result`, `Option`).
- Use Zod for schema validation and frontend-to-backend data integrity.

UI and Styling

- Use Vuetify 3 as the primary component framework.
- Implement responsive design with a mobile-first approach (optimized for desktop-first where applicable).

State Management and Logic

- Use Pinia for all global state management (e.g., client directory, session data).
- Use VueUse for common utilities (signatures, geolocation, local storage, sensors).
- Use Vee-Validate + Zod for complex form handling and validation.

Desktop & Offline-First Guidelines

- Optimize for Offline-First: Use SQLite (via Tauri plugin) for all persistent data.
- Performance: Implement FTS5 for fast text searches in law snapshots.
- Desktop Integration: Use Tauri commands for filesystem access (PDF generation, signature storage, and backups).
- Maps: Use Vue-Leaflet for offline-capable map visualization.

Performance Optimization

- Leverage SQLite indexing for heavy queries.
- Implement lazy loading for routes and heavy UI components.
- Use ApexCharts for efficient data visualization.
- Ensure efficient memory management when handling file paths and signatures in the Tauri bridge.

Vue 3 Best Practices

- Leverage `ref`, `reactive`, and `computed` for reactive state.
- Use `provide/inject` for deep dependency injection.
- Implement custom composables to encapsulate logic (e.g., `useInspectionLogic`).
