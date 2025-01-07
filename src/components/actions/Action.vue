<script setup lang="ts">
import {useConnectionStore} from "@/stores/socket.ts";
import {socket} from "@/socket.ts";

const props = defineProps([
  'action',
  'data',
  'divOption'
])

const gameStore = useConnectionStore()

function handleDragOver(e) {
  e.stopPropagation()
  e.preventDefault()
}
function handleDragDrop(e) {
  const card = JSON.parse(e.dataTransfer.getData("application/json"))
  gameStore.emit('client/play', {
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
      class="action"
      :style="{backgroundColor: divOption?.color ?? 'rgba(0,0,0,0.34)'}"
      @dragover="handleDragOver"
      @drop="handleDragDrop"
      :title="props.action"
  >

  </div>
</template>

<style scoped>
.action {
  width: 100%;
  height: 100%;
}
</style>