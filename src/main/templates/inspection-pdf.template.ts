export interface InspectionData {
  id: number
  date: string | Date
  art?: string
  work_schedule?: string | null
  total_visits_count?: number
  total_inspections_count?: number
  current_employee_count?: number | null
  observations?: string | null
  breach?: string | null
  signature_customer_path?: string | null
  company?: {
    fantasy_name?: string
    social_reason?: string | null
    social_number?: number | null
    address?: string
    phone?: string | null
    contact_name?: string | null
    cuit?: string | null
  }
  professional?: {
    fullname?: string
    tuition_number?: string | null
    signature_path?: string | null
  }
  area?: {
    name?: string
  }
  sector?: {
    name?: string
  }
  reason?: {
    name?: string
  }
  results?: Array<{
    status?: string
    category_item?: {
      name?: string
      law_reference?: string | null
      category?: {
        name?: string
      }
    }
  }>
}

function formatDate(dateStr: string | Date): string {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('es-AR')
}

export function generateInspectionHtml(inspection: InspectionData): string {
  const formattedDate = formatDate(inspection.date)
  const inspectionNumber = String(inspection.id).padStart(6, '0')

  const resultsRows = inspection.results
    ? (() => {
        const groupedByCategory: Record<string, typeof inspection.results> = {}

        for (const r of inspection.results) {
          const categoryName = r.category_item?.category?.name || 'Sin categoría'
          if (!groupedByCategory[categoryName]) {
            groupedByCategory[categoryName] = []
          }
          groupedByCategory[categoryName].push(r)
        }

        let globalIndex = 0
        let html = ''
        for (const [categoryName, items] of Object.entries(groupedByCategory)) {
          html += `
      <tr>
        <td colspan="12" class="bold" style="text-align: center; background-color: #f5f5f5;">
          ${categoryName.toUpperCase()}
        </td>
      </tr>`

          for (const r of items) {
            globalIndex++
            const status = r.status || 'N/A'
            const isYes = status === 'OK' ? 'X' : ''
            const isNo = status === 'No OK' ? 'X' : ''
            const isNA = status === 'N/A' ? 'X' : ''
            const lawRef = r.category_item?.law_reference?.toUpperCase() || '-'
            const itemName = r.category_item?.name?.toUpperCase() || 'N/A'

            html += `
      <tr>
        <td colspan="1">${globalIndex}</td>
        <td colspan="5">${itemName}</td>
        <td colspan="1">${isYes}</td>
        <td colspan="1">${isNo}</td>
        <td colspan="1">${isNA}</td>
        <td colspan="3">${lawRef}</td>
      </tr>`
          }
        }
        return html
      })()
    : ''

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inspección ${inspectionNumber}</title>
    <style>
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        .no-print {
          display: none;
        }
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: "Helvetica", "Arial", sans-serif;
        padding: 10px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
      }

      td,
      th {
        border: 1px solid #000;
        padding: 4px 6px;
        font-size: 10px;
        word-wrap: break-word;
      }

      h1,
      h2 {
        margin: 0;
        padding: 0;
      }

      .bold {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <table>
      <tr>
        <td colspan="2" style="width: 10%">
          <img
            src="https://www.secla.org.ar/img/elemento/mediana/23-530-logo-secla-6.jpg"
            alt="Logo SECLA"
            style="width: 100%; height: 50px; object-fit: contain"
          />
        </td>
        <td colspan="8" style="text-align: center">
          <p>
            Personería Gremial N° 611 / Filial de la FAECYS / Adherida a la CGT
          </p>
          <p>
            <span class="bold">Filial Avellaneda</span>: Maipú 290 Tel:
            5238-2626 / 4222-4486
          </p>
          <p>
            <span class="bold">Filial Lanús:</span> Del Valle Iberlucea 3263
            Tel: 4247-6633 Fax: 4225-6035
          </p>
          <p>www.secla.org.ar | secla@secla.org.ar</p>
          <div
            style="
              display: flex;
              justify-content: center;
              gap: 4px;
              align-items: center;
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              style="width: 16px"
            >
              <title>facebook</title>
              <path
                d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
              />
            </svg>
            <p>= Secretaría de seguridad e Higiene Secla</p>
          </div>
        </td>
        <td colspan="2">
          <span style="font-size: 14px">N° ${inspectionNumber}</span>
        </td>
      </tr>

      <tr>
        <td colspan="12">
          <p class="bold" style="text-align: center; font-size: 16px">
            Secretaría de Higiene y Seguridad en el Trabajo
          </p>
        </td>
      </tr>

      <tr>
        <td colspan="8" style="text-align: center">
          Datos del establecimiento
        </td>
        <td colspan="4">Fecha: ${formattedDate}</td>
      </tr>

      <tr>
        <td colspan="2">Razón Social</td>
        <td colspan="6">${(inspection.company?.social_reason || 'N/A').toUpperCase()}</td>
        <td colspan="2">Nombre fantasía</td>
        <td colspan="2">${(inspection.company?.fantasy_name || 'N/A').toUpperCase()}</td>
      </tr>

      <tr>
        <td colspan="2">Actividad</td>
        <td colspan="10">${(inspection.sector?.name || 'N/A').toUpperCase()}</td>
      </tr>

      <tr>
        <td colspan="2">Domicilio</td>
        <td colspan="6">Calle: ${(inspection.company?.address || 'N/A').toUpperCase()}</td>
        <td colspan="2">N°: ${inspection.company?.social_number || 'N/A'}</td>
        <td colspan="2">Localidad: ${(inspection.area?.name || 'N/A').toUpperCase()}</td>
      </tr>

      <tr>
        <td colspan="2">N° CUIT Empresa</td>
        <td colspan="6">${inspection.company?.cuit || 'N/A'}</td>
        <td colspan="2">Teléfono</td>
        <td colspan="2">${inspection.company?.phone || '-'}</td>
      </tr>

      <tr>
        <td colspan="2">Contacto Sr./Sra.</td>
        <td colspan="6">${(inspection.company?.contact_name || '-').toUpperCase()}</td>
        <td colspan="2">ART</td>
        <td colspan="2">${(inspection.art || 'N/A').toUpperCase()}</td>
      </tr>

      <tr>
        <td colspan="2">Cantidad de empleados</td>
        <td colspan="6">${inspection.current_employee_count || 0}</td>
        <td colspan="2">Horarios de trabajo</td>
        <td colspan="2">${(inspection.work_schedule || '-').toUpperCase()}</td>
      </tr>

      <tr>
        <td colspan="12">
          <p class="bold" style="text-align: center">
            Basado en la Ley N° 19587 / D351/79 y D1338/57 - Convenio C.T.
            130/75 y Resoluciones vigentes
          </p>
        </td>
      </tr>

      <tr>
        <td colspan="4">Profesional en Higiene y Seguridad en el Trabajo</td>
        <td colspan="4">Nombre y Apellido: ${(inspection.professional?.fullname || 'N/A').toUpperCase()}</td>
        <td colspan="4">Matrícula: ${(inspection.professional?.tuition_number || 'N/A').toUpperCase()}</td>
      </tr>

      <tr>
        <td colspan="1">N°</td>
        <td colspan="5" style="text-align: center">Tema</td>
        <td colspan="1">Cumple</td>
        <td colspan="1">No Cumple</td>
        <td colspan="1">N/A</td>
        <td colspan="3">Artículos y Consideraciones</td>
      </tr>

      ${resultsRows}

      <tr>
        <td colspan="12" style="page-break-after: always"></td>
      </tr>

      <tr>
        <td colspan="12">
          <div style="min-height: 350px">
            <p class="bold" style="font-size: 14px">Observaciones realizadas</p>

            <p style="margin-top: 12px">${inspection.observations?.replace(/\n/g, '<br/>') || '-'}</p>
          </div>
        </td>
      </tr>

      <tr>
        <td colspan="12">
          <div style="min-height: 350px">
            <p class="bold" style="font-size: 14px">Incumplimientos</p>

            <p style="margin-top: 12px">${inspection.breach?.replace(/\n/g, '<br/>') || '-'}</p>
          </div>
        </td>
      </tr>

      <tr>
        <td colspan="8" style="text-align: center">Inspectores de la secretaria</td>
        <td colspan="4" style="text-align: center">Recepción Firma y Aclaración</td>
      </tr>

      <tr>
        <td colspan="8">
        ${
          inspection.professional?.signature_path
            ? `<img src="${'app-data://' + inspection.professional?.signature_path}" style="width: 100%; height: 50px; object-fit: contain" />`
            : '-'
        }
        </td>
        <td colspan="4">
        ${
          inspection.signature_customer_path
            ? `<img src="${'app-data://' + inspection.signature_customer_path}" style="width: 100%; height: 50px; object-fit: contain" />`
            : '-'
        }
        </td>
      </tr>
    </table>
  </body>
</html>`
}
