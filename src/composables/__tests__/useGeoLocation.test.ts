import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGeoLocation } from '../useGeoLocation'

const mockMessages = {
  addMessageToQueue: vi.fn(),
}

vi.mock('../useMessages', () => ({
  useMessages: () => mockMessages,
}))

// Mock global fetch
global.fetch = vi.fn()

describe('useGeoLocation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default states', () => {
    const { zoom, center, marketLatLng } = useGeoLocation()

    expect(zoom.value).toBe(15)
    expect(center.value).toEqual([-34.7167, -58.3833])
    expect(marketLatLng.value).toEqual([-34.7167, -58.3833])
  })

  it('should search address and update location on success', async () => {
    const mockResponse = {
      direcciones: [
        {
          ubicacion: {
            lat: -34.1234,
            lon: -58.5678,
          },
        },
      ],
    }

    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => mockResponse,
    } as Response)

    const { searchAddress, center, marketLatLng } = useGeoLocation()
    const result = await searchAddress('Calle Falsa', '123', 'Lanus')

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('direccion=Calle Falsa%20al%20123%20&departamento=Lanus'),
    )
    expect(result).toEqual({ lat: -34.1234, lng: -58.5678 })
    expect(center.value).toEqual([-34.1234, -58.5678])
    expect(marketLatLng.value).toEqual([-34.1234, -58.5678])
  })

  it('should show warning when address is not found', async () => {
    const mockResponse = { direcciones: [] }

    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => mockResponse,
    } as Response)

    const { searchAddress } = useGeoLocation()
    const result = await searchAddress('Desconocida', '0', 'Nadie')

    expect(result).toBeNull()
    expect(mockMessages.addMessageToQueue).toHaveBeenCalledWith(
      'Dirección no encontrada',
      'warning',
    )
  })

  it('should show error when fetch fails', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    const { searchAddress } = useGeoLocation()
    const result = await searchAddress('Test', '1', 'Test')

    expect(result).toBeNull()
    expect(mockMessages.addMessageToQueue).toHaveBeenCalledWith(
      'Error al obtener la ubicación',
      'error',
    )
  })
})
