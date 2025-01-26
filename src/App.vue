<script setup lang="ts">
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'


import {useSocketStore} from "@/stores/socket.ts";
import OwnPlayer from "@/components/OwnPlayer.vue";
import Plateau from "@/components/plateau/Plateau.vue";
import Players from "@/components/players/Players.vue";
import AppContainer from "@/components/AppContainer.vue";
import UI from "@/components/UI/UI.vue";
const gameStore = useSocketStore()
gameStore.bindEvents()

function onRestartClick() {
  gameStore.emit('client/admin/restart')
}
function onStartSubmit() {
  gameStore.emit('client/start-request')
}


</script>

<template>

<div id="app-root" class="d-flex flex-column justify-content-evenly">

  <AppContainer>
    <Players/>
  </AppContainer>

  <AppContainer>
    <Plateau/>
  </AppContainer>

  <AppContainer>
    <OwnPlayer/>
  </AppContainer>

  <UI/>

</div>

<!--  <div class="d-flex flex-column">-->
<!--    <div class="row tier">-->
<!--      <Players/>-->
<!--    </div>-->
<!--    <div class="row quart">-->
<!--      <Plateau/>-->
<!--    </div>-->
<!--    <div class="row tier">-->
<!--      <OwnPlayer/>-->
<!--    </div>-->
<!--  </div>-->

<!--  <div class="admin-panel">-->
<!--    <button @click="onRestartClick">Restart</button>-->
<!--    <button v-if="gameStore.currentPlayer && !gameStore.game?.started" @click="onStartSubmit">Start</button>-->
<!--  </div>-->

<!--  <p >{{ gameStore.game?.cards?.length }}</p>-->

</template>

<style scoped>
#app-root {
  width: 100vw;
  height: 100vh;
}
.admin-panel {
 position: absolute;
  bottom: 0;
}
.tier {
  height: 25vh;
}
.quart {
  height: 50vh;
}
</style>
