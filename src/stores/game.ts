import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {


  return {
    game,
    currentPlayer
  }
})
