## 1. Dependencies

- [x] 1.1 Remove jsPDF library
- [x] 1.2 Verify dependencies in package.json

## 2. Backend - PDF Service with Data Fetch

- [x] 2.1 Update PDF service to fetch inspection data via services
- [x] 2.2 Add HTML generation in main process (modular template)
- [x] 2.3 Update IPC handler to accept inspectionId and generate PDF
- [x] 2.4 Update preload bridge for new generate method

## 3. Frontend - PDF Export Service

- [x] 3.1 Update composable to call new IPC method
- [x] 3.2 Add loading state handling
- [x] 3.3 IPC call

## 4. Frontend - Inspections Page

- [x] 4.1 Update PDF export button with loading state
- [x] 4.2 Wire button to PDF export function

## 5. Frontend - Dashboard Page

- [x] 5.1 Update PDF export button with loading state
- [x] 5.2 Wire button to PDF export function

## 6. Cleanup

- [x] 6.1 Remove Report.vue page (no longer needed)
- [x] 6.2 Remove route for report page

## 7. Directory Structure

- [x] 7.1 Create `src/main/templates/` directory
- [x] 7.2 Move HTML template to `src/main/templates/inspection-pdf.template.ts`
- [x] 7.3 Update pdf.service.ts to import from templates/

## 8. Testing

- [ ] 8.1 Test PDF export from inspections page
- [ ] 8.2 Test PDF export from dashboard page
- [ ] 8.3 Verify PDF is saved to downloads directory
- [ ] 8.4 Verify PDF contains correct inspection data
- [ ] 8.5 Verify user feedback (loading + notifications)
