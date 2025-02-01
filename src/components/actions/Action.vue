<script setup lang="ts">
import {socket} from "@/socket.ts";
import {useSocketStore} from "@/stores/socket.ts";
import {useGameStore} from "@/stores/game.ts";
import {inject, onMounted, ref, watch} from "vue";
import Rule from "@/components/actions/rule.ts";

const props = defineProps<{
  action: string,
  data: {
    relatedDeck: object|null
    familyId: string|null
  }|null,
}>()

const socketStore = useSocketStore()
const gameStore = useGameStore()

const killAction = inject('killAction')
const otherUser = inject('otherUser', null)
console.log(otherUser, props.action, killAction)

const divRef = ref()
const active = ref(true)
const hovered = ref(false)

gameStore.registerActionDiv(
    props.action,
    divRef,
    {
      ...props.data,
      killAction,
      toUserId: otherUser?.socket?.id
    },
    hovered,
    active
)

function onMouseEnter(e) {
  hovered.value = true

  if (gameStore.holdenCard && props.data.relatedDeck) {
  }
}
function onMouseLeave(e) {
  hovered.value = false
}

watch(() => gameStore.holdenCard, (heldCard) => {
  // if (!socketStore.isYourTurn) {
  //   return active.value = false
  // }

  // const familyRule = new Rule().setHigherAction('test')
  //
  //
  // if (heldCard) {
  //   // console.log(props.action, props.data)
  //
  //   switch (props.action) {
  //     case 'enlight':
  //     case 'shadow':
  //     case 'kill_crown':
  //       if (socketStore.game.userActionsToPlay.includes('place')) {
  //         active.value = true
  //
  //         if (heldCard.power === 'hidden') {
  //           active.value = props?.data?.familyId === 'assassin'
  //         }
  //
  //       } else {
  //         active.value = false
  //         return;
  //       }
  //       break
  //     case 'give':
  //     case 'kill_other':
  //       if (socketStore.game.userActionsToPlay.includes('give')) {
  //         active.value = true
  //       } else {
  //         active.value = false
  //         return;
  //       }
  //       break
  //     case 'keep':
  //     case 'kill_own':
  //       if (socketStore.game.userActionsToPlay.includes('keep')) {
  //         active.value = true
  //       } else {
  //         active.value = false
  //         return;
  //       }
  //       break
  //   }
  //
  //   switch (heldCard.power) {
  //     case 'rogue':
  //         active.value = true // TODO props.action.includes('kill')
  //         break
  //     case 'hidden':
  //
  //         break
  //   }
  //
  //   if (['keep', 'give'].includes(props.action)) {
  //     active.value = true
  //   } else {
  //     active.value = heldCard.family.id === props?.data?.familyId;
  //   }
  //
  // } else {
  //   active.value = false
  // }
})
</script>

<template>
  <div
      ref="divRef"
      class="action"
      :class="[hovered && 'hovered', active && 'hovered']"
      :title="props.action"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"

  >
    <slot/>
  </div>
</template>

<style scoped>
.action {
  background-color: rgba(0, 0, 0, 0.5);
}
.hovered {
  box-shadow: 0px 0px 10px 10px rgba(237,226,19,0.35);
}
</style>