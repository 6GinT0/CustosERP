import { ref, useTemplateRef } from 'vue'
import { useFileDialog, useDropZone, useObjectUrl } from '@vueuse/core'

export const useImageUpload = (initialFile: File | null = null) => {
  const dropZoneRef = useTemplateRef<HTMLElement>('dropZoneRef')
  const selectedFile = ref<File | null>(initialFile)
  const previewUrl = useObjectUrl(selectedFile)

  const onDrop = (files: File[] | null) => {
    if (files && files.length > 0) {
      selectedFile.value = files[0]
    }
  }

  const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop,
    dataTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'],
    multiple: false,
    preventDefaultForUnhandled: false,
  })

  const { open, reset, onChange } = useFileDialog({
    accept: 'image/*',
    multiple: false,
  })

  onChange((files) => {
    if (files && files.length > 0) {
      selectedFile.value = files[0]
    }
  })

  const removeImage = () => {
    selectedFile.value = null
    reset()
  }

  return {
    dropZoneRef,
    selectedFile,
    previewUrl,
    isOverDropZone,
    open,
    removeImage,
  }
}
