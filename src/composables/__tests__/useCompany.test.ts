import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useCompany } from '../useCompany'
import { companyService } from '@/services/CompanyService'

const mockRouter = {
  push: vi.fn(),
}

const mockRoute = {
  params: {},
}

const mockMessages = {
  addMessageToQueue: vi.fn(),
}

const mockDatabase = {
  companies: ref([]),
  addItem: vi.fn(),
  updateItem: vi.fn(),
  removeItem: vi.fn(),
  removeItems: vi.fn(),
}

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  useRoute: () => mockRoute,
}))

// Mock vee-validate
vi.mock('vee-validate', () => ({
  useForm: vi.fn(() => ({
    handleSubmit: vi.fn((fn) => fn),
    setFieldValue: vi.fn(),
    setValues: vi.fn(),
  })),
}))

vi.mock('@vee-validate/zod', () => ({
  toTypedSchema: vi.fn(),
}))

// Mock dependencies
vi.mock('@/services/CompanyService', () => ({
  companyService: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    getById: vi.fn(),
  },
}))

vi.mock('../useMessages', () => ({
  useMessages: () => mockMessages,
}))

vi.mock('../useDatabase', () => ({
  useDatabase: () => mockDatabase,
}))

// Mock vue onMounted
vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    onMounted: vi.fn((fn) => fn()),
  }
})

describe('useCompany', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default states', () => {
    const { loading, mapReady, company, address } = useCompany()

    expect(loading.value).toBe(false)
    expect(mapReady.value).toBe(false)
    expect(company.value).toBeNull()
    expect(address.street).toBe('')
  })

  it('should load company data when id is present in route', async () => {
    const mockCompany = {
      id: 1,
      fantasyName: 'Test Company',
      address: 'Main St 123, Floor 1',
      latitude: 10,
      longitude: 20,
    }
    mockRoute.params = { id: '1' }
    vi.mocked(companyService.getById).mockResolvedValue(mockCompany as any)

    const { company, address } = useCompany()

    // Wait for async onMounted
    await vi.waitFor(() => expect(company.value).toEqual(mockCompany))

    expect(address.street).toBe('Main St')
    expect(address.number).toBe('123')
    expect(address.department).toBe('Floor 1')
  })

  it('should handle creation success', async () => {
    const { handleCreate } = useCompany()
    const mockValues = { fantasy_name: 'New' }
    vi.mocked(companyService.create).mockResolvedValue({ id: 2, ...mockValues } as any)

    await (handleCreate as any)(mockValues)

    expect(companyService.create).toHaveBeenCalledWith(mockValues)
    expect(mockDatabase.addItem).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith('/companies')
    expect(mockMessages.addMessageToQueue).toHaveBeenCalledWith(
      'Empresa creada correctamente',
      'success',
    )
  })

  it('should handle creation error', async () => {
    const { handleCreate } = useCompany()
    vi.mocked(companyService.create).mockRejectedValue(new Error('Fail'))

    await (handleCreate as any)({})

    expect(mockMessages.addMessageToQueue).toHaveBeenCalledWith(
      'Error al crear la empresa',
      'error',
    )
  })

  it('should handle update success', async () => {
    mockRoute.params = { id: '1' }
    const { handleUpdate } = useCompany()
    const mockValues = { fantasy_name: 'Updated' }
    vi.mocked(companyService.update).mockResolvedValue({ id: 1, ...mockValues } as any)

    await (handleUpdate as any)(mockValues)

    expect(companyService.update).toHaveBeenCalledWith(1, mockValues)
    expect(mockDatabase.updateItem).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith('/companies')
  })

  it('should handle delete success', async () => {
    const { handleDelete } = useCompany()
    vi.mocked(companyService.delete).mockResolvedValue(undefined as any)

    await handleDelete(1)

    expect(companyService.delete).toHaveBeenCalledWith(1)
    expect(mockDatabase.removeItem).toHaveBeenCalled()
  })

  it('should handle deleteMany success', async () => {
    const { handleDeleteMany } = useCompany()
    vi.mocked(companyService.deleteMany).mockResolvedValue(undefined as any)

    await handleDeleteMany([1, 2])

    expect(companyService.deleteMany).toHaveBeenCalledWith([1, 2])
    expect(mockDatabase.removeItems).toHaveBeenCalled()
  })
})
