## Why

Users need the ability to export inspection data as PDF documents directly from the datatable interfaces. Currently, there's no way to generate PDF reports from the inspection list or dashboard views, requiring manual data extraction. Adding PDF export functionality improves workflow efficiency and provides tangible deliverables for clients.

## What Changes

- Add PDF export button with icon to the inspections datatable (pages/inspections/Index.vue)
- Add PDF export button with icon to the dashboard datatable (pages/dashboard/\_components/DataTable.vue)
- Implement PDF generation service using client-side library (jsPDF or pdfmake)
- Export PDF files directly to user's OS downloads folder (/downloads or /descargas)
- Include inspection item data in the exported PDF

## Capabilities

### New Capabilities

- `pdf-export`: PDF document generation and download capability for inspection data

### Modified Capabilities

<!-- No existing spec requirements being modified -->

## Impact

- **Frontend**: New PDF export buttons added to two Vue components
- **Dependencies**: Need to add PDF generation library (jsPDF or pdfmake)
- **IPC**: May require backend support for file system access to downloads directory
