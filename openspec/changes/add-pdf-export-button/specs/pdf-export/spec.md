## ADDED Requirements

### Requirement: Export inspection as PDF

The system SHALL allow users to export a single inspection as a PDF document from the datatable interface.

#### Scenario: Export from inspections page

- **WHEN** user clicks the PDF export button on a row in the inspections datatable
- **THEN** system generates a PDF containing the inspection's data and saves it to the user's downloads folder

#### Scenario: Export from dashboard page

- **WHEN** user clicks the PDF export button on a row in the dashboard datatable
- **THEN** system generates a PDF containing the inspection's data and saves it to the user's downloads folder

#### Scenario: PDF contains inspection data

- **WHEN** PDF is generated for an inspection
- **THEN** the PDF SHALL include: date, company name, professional name, area, sector, reason, and ART information

### Requirement: PDF layout with grouped results by category

The PDF SHALL organize inspection results grouped by their category with clear visual separation.

#### Scenario: Results grouped by category

- **WHEN** PDF is generated for an inspection with results
- **THEN** results SHALL be grouped under category headers (e.g., "SEGURIDAD ELÉCTRICA", "SEGURIDAD CONTRA INCENDIO")
- **AND** each category header SHALL span the full width of the table (colspan=12)
- **AND** items belonging to a category SHALL appear below their respective header
- **AND** category headers SHALL have a distinct visual style (bold, centered, background color)

#### Scenario: PDF columns for checklist items

- **WHEN** PDF contains inspection results
- **THEN** the results table SHALL include columns: Item (N°), Tema (colspan=5), Cumple, No Cumple, N/A, Artículos (colspan=3)
- **AND** all text in the PDF SHALL be in uppercase
- **AND** each item SHALL display its sequential index number in the first column

### Requirement: Multi-page PDF layout

The PDF SHALL be organized in multiple pages for better readability.

#### Scenario: Page organization

- **WHEN** PDF is generated
- **THEN** page 1 SHALL contain: Header with SECLA logo, company data, professional info, and legal references
- **AND** page 2 SHALL contain: Results checklist grouped by category
- **AND** page 3 SHALL contain: Observations, detected breaches, and signature fields
- **AND** page breaks SHALL be automatically inserted between sections

### Requirement: PDF generation method

The system SHALL generate PDF documents using Electron's printToPdf API with dynamically generated HTML.

#### Scenario: Generate PDF from HTML

- **WHEN** user initiates PDF export
- **THEN** system SHALL fetch all inspection data via backend queries
- **AND** generate HTML content programmatically with the inspection data
- **AND** use BrowserWindow.printToPdf() to convert HTML to PDF
- **AND** save the PDF to the user's downloads folder

#### Scenario: No extra route required

- **WHEN** PDF export is triggered
- **THEN** system SHALL NOT navigate to any route
- **AND** all data SHALL be fetched server-side via IPC calls
- **AND** HTML SHALL be generated in memory without page navigation

### Requirement: Modular HTML template

The system SHALL use a separate, modular HTML template file for PDF generation.

#### Scenario: HTML template location

- **WHEN** PDF is generated
- **THEN** system SHALL use the HTML template from `src/main/templates/inspection-pdf.template.ts`
- **AND** this allows modifying the PDF layout without changing the PDF service logic

### Requirement: PDF file naming

The system SHALL use a unique naming convention for exported PDF files to prevent overwrites.

- **WHEN** PDF is exported
- **THEN** the file name SHALL follow format: `inspection_<id>_<date>_<timestamp>.pdf`
- **AND** timestamp SHALL ensure unique file names even when multiple exports occur on the same day

### Requirement: User feedback during export

The system SHALL provide feedback to the user during the PDF export process.

#### Scenario: Export initiated

- **WHEN** user clicks the PDF export button
- **THEN** button SHALL show loading state (spinner/disabled)
- **AND** other interactions SHOULD be prevented during export

#### Scenario: Export in progress

- **WHEN** PDF generation is underway
- **THEN** system SHALL display a progress indicator (optional: snackbar with "Generando PDF...")

#### Scenario: Export completes successfully

- **WHEN** PDF export completes successfully
- **THEN** system SHALL display a success notification (snackbar: "PDF guardado en descargas")
- **AND** button SHALL return to normal state

#### Scenario: Export fails

- **WHEN** PDF export fails
- **THEN** system SHALL display an error notification with failure reason
- **AND** button SHALL return to normal state

### Requirement: DataTable action menu

The datatables SHALL use a consolidated menu button to reduce visual clutter.

#### Scenario: Column header label

- **WHEN** datatables are rendered
- **THEN** the column containing the action menu SHALL have the header title "Acciones"

#### Scenario: Actions menu in inspections page

- **WHEN** inspections datatable is rendered
- **THEN** each row SHALL display a single menu button (three-dot icon)
- **AND** clicking the menu SHALL reveal a dropdown with: "Editar", "Eliminar", and "Exportar" as a submenu
- **AND** "Exportar" submenu SHALL contain "Exportar a PDF" option

#### Scenario: Actions menu in dashboard page

- **WHEN** dashboard datatable is rendered
- **THEN** each row SHALL display a single menu button (three-dot icon)
- **AND** clicking the menu SHALL reveal a dropdown with "Exportar" option
- **AND** "Exportar" submenu SHALL contain "Exportar a PDF" option
