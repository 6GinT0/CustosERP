## Context

The application needs to export inspection data as PDF documents directly from datatable interfaces in the Vue 3 frontend. Currently, users cannot generate PDF reports from the inspection list or dashboard views. The solution must work within the Electron + Vue 3 architecture, using the preload bridge for IPC communication.

## Goals / Non-Goals

**Goals:**

- Add PDF export button to inspections datatable (pages/inspections/Index.vue)
- Add PDF export button to dashboard datatable (pages/dashboard/\_components/DataTable.vue)
- Export PDFs to user's OS downloads directory using printToPdf
- Generate HTML programmatically in main process (no extra route)
- Fetch inspection data via backend queries
- Use modular HTML template in separate directory
- Provide user feedback during export process

**Non-Goals:**

- Batch export multiple items at once (single item export only)
- Server-side PDF generation outside Electron

## Directory Structure

```
src/main/
├── services/
│   ├── pdf.service.ts          # PDF generation logic
│   └── inspection.service.ts   # Data fetching
├── templates/                   # NEW: Modular templates
│   └── inspection-pdf.template.ts  # HTML template for PDF
└── ipc/
    └── pdf.ipc.ts              # IPC handlers
```

## Decisions

1. **PDF Library**: Use Electron's `printToPdf` API
   - Rationale: Provides pixel-perfect layout, no external dependencies

2. **Data Fetching**: Backend queries via IPC
   - Main process fetches inspection data using existing services
   - No frontend route navigation required
   - Data flows: Renderer → IPC → Main Process → Services → IPC → Renderer

3. **HTML Generation**: Modular template in separate directory
   - Template located at `src/main/templates/inspection-pdf.template.ts`
   - Service imports and uses the template function
   - Easy to modify HTML without touching service logic

4. **File Destination**: User's downloads directory via Electron's API
   - Rationale: Cross-platform compatibility
   - Uses `app.getPath('downloads')`

5. **User Feedback**: Loading state on button + success/error snackbar
   - Rationale: Provides clear indication of export progress and result

## New Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Datatable     │────▶│  usePdfExport   │────▶│  IPC (preload)  │
│  (botón PDF)    │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Descargas      │◀────│  printToPdf    │◀────│  Main Process   │
│  (archivo PDF)  │     │                │     │ + templates/    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Risks / Trade-offs

- [Risk] HTML generation in main process → Mitigation: Use template strings for HTML
- [Risk] Large data queries → Mitigation: Only fetch required fields
- [Risk] Cross-platform download paths → Mitigation: Use Electron's `app.getPath('downloads')`
