<script setup lang="ts">
import {socket} from "@/socket.ts";
import {useConnectionStore} from "@/stores/socket.ts";
import {useGameStore} from "@/stores/game.ts";
import {ref} from "vue";

const props = defineProps([
  'action',
  'data',
  'divOption'
])

const socketStore = useConnectionStore()
const gameStore = useGameStore()

const divRef = ref()

gameStore.registerActionDiv(props.action, divRef, props.data)

function handleDragOver(e) {
  e.stopPropagation()
  e.preventDefault()
}
function handleDragDrop(e) {
  console.log(props?.data)
  const card = JSON.parse(e.dataTransfer.getData("application/json"))
  socketStore.emit('client/play', {
    action: props?.action,
    cardId: card?.id,
    userId: socket?.id,
    toUserId: props?.data?.toUserId ?? null,
    ...props?.data ?? {}
  })
}
</script>

<template>
  <div
      ref="divRef"
      class="action"
      :title="props.action"
  >
    <slot/>
  </div>
</template>

<style scoped>
.action {
  width: 100%;
  height: 100%;
}
</style>