import { describe, it, expect, beforeEach } from 'vitest'
import { useMessages } from '../useMessages'

describe('useMessages', () => {
  const { queue, addMessageToQueue } = useMessages()

  beforeEach(() => {
    queue.value = []
  })

  it('should initialize with empty queue', () => {
    expect(queue.value).toEqual([])
  })

  it('should add message to queue with default color', () => {
    addMessageToQueue('Test message')
    expect(queue.value).toEqual([{ text: 'Test message', color: 'success' }])
  })

  it('should add message with custom color', () => {
    addMessageToQueue('Error message', 'error')
    expect(queue.value).toEqual([{ text: 'Error message', color: 'error' }])
  })
})
