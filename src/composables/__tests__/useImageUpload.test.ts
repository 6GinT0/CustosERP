import { describe, it, expect, vi } from 'vitest'
import { useImageUpload } from '../useImageUpload'

vi.mock('@vueuse/core', async () => {
  const actual = (await vi.importActual('@vueuse/core')) as any
  return {
    ...actual,
    useFileDialog: vi.fn().mockReturnValue({
      open: vi.fn(),
      reset: vi.fn(),
      onChange: vi.fn(),
    }),
    useDropZone: vi.fn().mockReturnValue({
      isOverDropZone: { value: false },
    }),
    useObjectUrl: vi.fn().mockReturnValue({ value: 'blob:url' }),
  }
})

describe('useImageUpload', () => {
  it('should initialize with null selected file', () => {
    const { selectedFile, previewUrl } = useImageUpload()
    expect(selectedFile.value).toBeNull()
    expect(previewUrl.value).toBe('blob:url')
  })

  it('removeImage should clear selected file', () => {
    const { selectedFile, removeImage } = useImageUpload()
    selectedFile.value = new File([''], 'test.png', { type: 'image/png' })
    removeImage()
    expect(selectedFile.value).toBeNull()
  })
})
