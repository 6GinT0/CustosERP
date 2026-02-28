import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useProfessional } from '../useProfessional'
import { professionalService } from '@/services/ProfessionalService'

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
  professionals: ref([]),
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
vi.mock('@/services/ProfessionalService', () => ({
  professionalService: {
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

describe('useProfessional', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.params = {}
  })

  it('should initialize with default states', () => {
    const { loading, professional } = useProfessional()

    expect(loading.value).toBe(false)
    expect(professional.value).toBeNull()
  })

  it('should load professional data when id is present in route', async () => {
    const mockProf = {
      id: 1,
      fullName: 'John Doe',
      tuitionNumber: '12345',
    }
    mockRoute.params = { id: '1' }
    vi.mocked(professionalService.getById).mockResolvedValue(mockProf as any)

    const { professional } = useProfessional()

    await vi.waitFor(() => expect(professional.value).toEqual(mockProf))
    expect(professionalService.getById).toHaveBeenCalledWith(1)
  })

  it('should handle creation success', async () => {
    const { handleCreate } = useProfessional()
    const mockValues = { fullname: 'New' }
    vi.mocked(professionalService.create).mockResolvedValue({ id: 2, fullName: 'New' } as any)

    await (handleCreate as any)(mockValues)

    expect(professionalService.create).toHaveBeenCalledWith(mockValues)
    expect(mockDatabase.addItem).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith('/professionals')
    expect(mockMessages.addMessageToQueue).toHaveBeenCalledWith(
      'Profesional creado correctamente',
      'success',
    )
  })

  it('should handle update success', async () => {
    mockRoute.params = { id: '1' }
    const { handleUpdate } = useProfessional()
    const mockValues = { fullname: 'Updated' }
    vi.mocked(professionalService.update).mockResolvedValue({ id: 1, fullName: 'Updated' } as any)

    await (handleUpdate as any)(mockValues)

    expect(professionalService.update).toHaveBeenCalledWith(1, mockValues)
    expect(mockDatabase.updateItem).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith('/professionals')
  })

  it('should handle delete success', async () => {
    const { handleDelete } = useProfessional()
    vi.mocked(professionalService.delete).mockResolvedValue(undefined as any)

    await handleDelete(1)

    expect(professionalService.delete).toHaveBeenCalledWith(1)
    expect(mockDatabase.removeItem).toHaveBeenCalled()
  })
})
