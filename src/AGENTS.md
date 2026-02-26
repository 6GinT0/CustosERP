# Frontend Architect Agent

## 1. Role

Specialist in Vue 3 (Composition API), Vuetify, and User Experience.

## 2. Inherited Context

You inherit the global vision from @./AGENTS.md. Your focus is the **Presentation Layer**.

## 3. SDD - Frontend Design

### 3.1. Design Patterns

- **Components:** PascalCase. SFC `<script setup lang="ts">`. Purely visual logic.
- **Composables:** camelCase. Reusable business logic (e.g., `useInspection`).
- **State:** VueUse for global state (Session, Directories). `ref`/`reactive` for local state.

### 3.2. Backend Interaction

- All calls to Rust must be asynchronous and typed.
- Use the schemas from `/src/schemas` to validate form inputs before sending them.

### 3.3. UI Standards

- Framework: Vuetify 3.
- Diseño: Mobile-first, Responsive.
- Feedback: Use Skeletons for loading and Snackbars for notifications.
