import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {

  const debug = ref(false)

  const holdenCard = ref(null)
  const holdenCardAction = ref(null)
  const holdenCardActionData = ref(null)
  const holdenCardData = ref(null)

  const actionDivs = ref<Object[]>([])
  function registerActionDiv(action, ref, data, hovered, active) {
    actionDivs.value.push({
      action, ref, data, hovered, active
    })
  }

  return {
    debug,
    holdenCard,
    holdenCardAction,
    holdenCardActionData,
    holdenCardData,
    actionDivs,
    registerActionDiv
  }
})