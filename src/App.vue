<script setup lang="ts">
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

import {useSocketStore} from "@/stores/socket.ts";
import {useSoundStore} from "@/stores/sound.ts";
import {useGameStore} from "@/stores/game.ts";
import {useRouter, RouterLink, useRoute} from "vue-router";
import Navbar from "@/components/Navbar.vue";

const router = useRouter()
const route = useRoute()
const soundStore = useSoundStore()
const gameStore = useGameStore()
const socketStore = useSocketStore()
socketStore.bindEvents()

function handleStartPlaying() {
  gameStore.playing = true
  const sound = soundStore.sounds.get('ambiance')
  sound.addEventListener('ended', () => {
    sound.currentTime = 0
    sound.play()
  })
  const res = sound.play()
}

</script>

<template>

  <Navbar/>

  <div id="app-root">
    <RouterView />
  </div>

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
