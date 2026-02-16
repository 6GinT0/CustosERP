import { describe, it, expect } from 'vitest'
import { useDialog } from '../useDialog'

describe('useDialog', () => {
  it('should initialize with dialog closed', () => {
    const { isDialogOpen } = useDialog()
    expect(isDialogOpen.value).toBe(false)
  })

  it('should open the dialog', () => {
    const { isDialogOpen, openDialog } = useDialog()
    openDialog()
    expect(isDialogOpen.value).toBe(true)
  })

  it('should close the dialog', () => {
    const { isDialogOpen, openDialog, closeDialog } = useDialog()
    openDialog()
    closeDialog()
    expect(isDialogOpen.value).toBe(false)
  })
})
