<script setup lang="ts">
import {socket} from "@/socket.ts";
import {useConnectionStore} from "@/stores/socket.ts";
import {useGameStore} from "@/stores/game.ts";
import {onMounted, ref, watch} from "vue";
import Rule from "@/components/actions/rule.ts";

const props = defineProps([
  'action',
  'data',
  'divOption'
])

const socketStore = useConnectionStore()
const gameStore = useGameStore()

const divRef = ref()
const active = ref(false)
const hovered = ref(false)

gameStore.registerActionDiv(props.action, divRef, props.data, hovered, active)

function onMouseEnter(e) {
  hovered.value = true
}
function onMouseLeave(e) {
  hovered.value = false
}



watch(() => gameStore.holdenCard, (heldCard) => {
  if (!socketStore.isYourTurn) {
    return active.value = false
  }

  const familyRule = new Rule().setHigherAction()


  if (heldCard) {
    // console.log(props.action, props.data)

    switch (props.action) {
      case 'enlight':
      case 'shadow':
      case 'kill_crown':
        if (socketStore.game.userActionsToPlay.includes('place')) {
          active.value = true

          if (heldCard.power === 'hidden') {
            active.value = props?.data?.familyId === 'assassin'
          }

        } else {
          active.value = false
          return;
        }
        break
      case 'give':
      case 'kill_other':
        if (socketStore.game.userActionsToPlay.includes('give')) {
          active.value = true
        } else {
          active.value = false
          return;
        }
        break
      case 'keep':
      case 'kill_own':
        if (socketStore.game.userActionsToPlay.includes('keep')) {
          active.value = true
        } else {
          active.value = false
          return;
        }
        break
    }

    switch (heldCard.power) {
      case 'rogue':
          active.value = true // TODO props.action.includes('kill')
          break
      case 'hidden':

          break
    }

    if (['keep', 'give'].includes(props.action)) {
      active.value = true
    } else {
      active.value = heldCard.family.id === props?.data?.familyId;
    }

  } else {
    active.value = false
  }
})
</script>

<template>
  <div
      ref="divRef"
      class="action"
      :class="[hovered && gameStore.holdenCard && 'hovered', active && 'hovered']"
      :title="props.action"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"

  >
    <slot/>
  </div>
</template>

<style scoped>
.action {
  width: 100%;
  height: 100%;
  //background-color: rgba(0, 0, 0, 0.5);
}
.hovered {
  box-shadow: 0px 0px 44px 33px rgba(237,226,19,0.35);
}
</style>