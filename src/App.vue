<script setup lang="ts">
import {useConnectionStore} from "@/stores/socket.ts";
import Deck from "@/components/Deck.vue";
import Plateau from "@/components/Plateau.vue";
const gameStore = useConnectionStore()
gameStore.bindEvents()

function onRestartClick() {
  console.log("onRestartClick");
  gameStore.emit('client/admin/restart')
}
function onStartSubmit() {
  console.log("onStartSubmit");
  gameStore.emit('client/start-request')
}
</script>

<template>
  <button @click="onRestartClick">Restart</button>
  <button v-if="gameStore.currentPlayer && !gameStore.game?.started" @click="onStartSubmit">Start</button>

  <Players/>

  <Plateau/>

  <Deck/>

</template>

<style scoped>

</style>
