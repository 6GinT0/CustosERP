import { ref, type Ref } from 'vue'
import { createGlobalState } from '@vueuse/core'

type Message = {
  text: string
  color: string
}

export const useMessages = createGlobalState(() => {
  const queue: Ref<Message[]> = ref([])

  function addMessageToQueue(message: string, color: string = 'success'): void {
    queue.value.push({ text: message, color })
  }

  return { queue, addMessageToQueue }
})
