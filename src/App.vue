<script setup lang="ts">
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

import {useConnectionStore} from "@/stores/socket.ts";
import OwnPlayer from "@/components/OwnPlayer.vue";
import Plateau from "@/components/Plateau.vue";
import Players from "@/components/Players.vue";
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

  <div class="d-flex flex-column">
    <div class="row tier">
      <Players/>
    </div>
    <div class="row tier">
      <Plateau/>
    </div>
    <div class="row tier">
      <OwnPlayer/>
    </div>
  </div>

  <div class="admin-panel">
    <button @click="onRestartClick">Restart</button>
    <button v-if="gameStore.currentPlayer && !gameStore.game?.started" @click="onStartSubmit">Start</button>
  </div>

  <p >{{ gameStore.game?.cards?.length }}</p>

</template>

<style scoped>
.admin-panel {
 position: absolute;
}
.tier {
  height: 32vh;
}
</style>
