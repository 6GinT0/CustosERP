import { ref } from 'vue'
import { useMessages } from './useMessages'

export function useGeoLocation() {
  const zoom = ref(15)
  const center = ref([-34.7167, -58.3833])
  const marketLatLng = ref([-34.7167, -58.3833])
  const messages = useMessages()

  async function searchAddress(street: string, number: string, department: string) {
    try {
      const res = await fetch(
        `https://apis.datos.gob.ar/georef/api/direcciones?direccion=${street}%20al%20${number}%20&departamento=${department}`,
      )
      const data = await res.json()

      if (data.direcciones && data.direcciones.length > 0) {
        const location = data.direcciones[0].ubicacion
        const newLatLng = [location.lat, location.lon]

        center.value = newLatLng
        marketLatLng.value = newLatLng

        return { lat: location.lat, lng: location.lon }
      }

      messages.addMessageToQueue('Dirección no encontrada', 'warning')

      return null
    } catch (e: unknown) {
      if (e instanceof Error) {
        messages.addMessageToQueue(e.message, 'error')
      } else {
        messages.addMessageToQueue('Error al obtener la ubicación', 'error')
      }

      return null
    }
  }

  return {
    zoom,
    center,
    marketLatLng,
    searchAddress,
  }
}
