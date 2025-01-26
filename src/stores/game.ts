import {ref, computed, onMounted, type Ref} from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {

  const debug = ref(false)

  const holdenCard = ref(null)
  const holdenCardAction = ref(null)
  const holdenCardActionData = ref(null)
  const holdenCardData = ref(null)

  const actionDivs = ref<ActionDiv[]>([])
  function registerActionDiv(action, ref, data, hovered, active) {
    actionDivs.value.push({
      action, ref, data, hovered, active
    })
  }

  type ActionDiv = {
    action: string,
    ref: Ref,
    data: Object,
    hovered: Ref,
    active: Ref
  }


  const animationHooks = ref<Array<Function>>([])
  const animationFrames = ref(0)
  function useAnimation(animationHook: Function) {
    animationHooks.value.push(animationHook)
  }
  function animate() {
    for (const animationHook of animationHooks.value) {
      animationHook()
    }
    animationFrames.value++
    requestAnimationFrame(animate)
  }
  onMounted(() => {
    requestAnimationFrame(animate)
  })

  return {
    debug,
    holdenCard,
    holdenCardAction,
    holdenCardActionData,
    holdenCardData,
    actionDivs,
    animationFrames,
    registerActionDiv,
    useAnimation
  }
})