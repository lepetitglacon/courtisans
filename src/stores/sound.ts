import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import ambiance from '@/assets/sounds/ambiance/ambiance.mp3'

export const useSoundStore = defineStore('sound', () => {

  const sounds = ref<Map<String, HTMLAudioElement>>(new Map())

  sounds.value.set('ambiance', new Audio(ambiance))

  return {
    sounds
  }
})
