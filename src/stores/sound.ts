import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import ambiance from '@/assets/sounds/ambiance/ambiance.mp3'
import draw from '@/assets/sounds/cards-shuffle.mp3'
import play from '@/assets/sounds/on-card-play.mp3'

export const useSoundStore = defineStore('sound', () => {

  const sounds = ref<Map<String, HTMLAudioElement>>(new Map())

  sounds.value.set('ambiance', new Audio(ambiance))
  sounds.value.set('draw', new Audio(draw))
  sounds.value.set('play', new Audio(play))

  return {
    sounds
  }
})
