import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useInspectionForm } from '../useInspectionForm'

// Use vi.hoisted to ensure the same mock instances are shared between test and composable
const mocks = vi.hoisted(() => ({
  router: { push: vi.fn() },
  route: { params: {} },
  messages: { addMessageToQueue: vi.fn() },
  database: {
    inspections: { value: [] },
    addItem: vi.fn(),
    updateItem: vi.fn(),
    removeItem: vi.fn(),
    removeItems: vi.fn(),
  },
  inspectionService: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    getById: vi.fn(),
  },
  inspectionResultService: {
    getByInspectionId: vi.fn(),
  },
}))

vi.mock('vue-router', () => ({
  useRouter: () => mocks.router,
  useRoute: () => mocks.route,
}))

vi.mock('../useMessages', () => ({
  useMessages: () => mocks.messages,
}))

vi.mock('../useDatabase', () => ({
  useDatabase: () => mocks.database,
}))

vi.mock('@/services/InspectionService', () => ({
  inspectionService: mocks.inspectionService,
}))

vi.mock('@/services/InspectionResultService', () => ({
  inspectionResultService: mocks.inspectionResultService,
}))

describe('useInspectionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.route.params = {}
  })

  it('should initialize correctly', () => {
    const { loading } = useInspectionForm()
    expect(loading.value).toBe(false)
  })

  it('handleDelete should call service and database', async () => {
    const { handleDelete } = useInspectionForm()
    mocks.inspectionService.delete.mockResolvedValue(undefined)

    await handleDelete(1)

    expect(mocks.inspectionService.delete).toHaveBeenCalledWith(1)
    expect(mocks.database.removeItem).toHaveBeenCalledWith(mocks.database.inspections, 1)
    expect(mocks.messages.addMessageToQueue).toHaveBeenCalledWith(expect.any(String), 'success')
  })

  it('handleDeleteMany should call service and database', async () => {
    const { handleDeleteMany } = useInspectionForm()
    const ids = [1, 2]
    mocks.inspectionService.deleteMany.mockResolvedValue(undefined)

    await handleDeleteMany(ids)

    expect(mocks.inspectionService.deleteMany).toHaveBeenCalledWith(ids)
    expect(mocks.database.removeItems).toHaveBeenCalledWith(mocks.database.inspections, ids)
    expect(mocks.messages.addMessageToQueue).toHaveBeenCalledWith(expect.any(String), 'success')
  })
})
