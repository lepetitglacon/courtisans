import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', () => {

  const messages = ref<String[]>([])

  function postMessage(text: String) {
    messages.value.push(text)
  }

  return {
    messages,
    postMessage
  }
})
