<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import Players from "@/components/players/Players.vue";
import AppContainer from "@/components/AppContainer.vue";
import OwnPlayer from "@/components/OwnPlayer.vue";
import UI from "@/components/UI/UI.vue";
import Plateau from "@/components/plateau/Plateau.vue";
import {onMounted, onUnmounted, provide, ref} from "vue";
import {io} from "socket.io-client";
import {useSocketStore} from "@/stores/socket.ts";

const route = useRoute()
const socket = io("http://localhost:3000", {
  autoConnect: false,
  query: {
    roomId: route.params.id
  }
});
socket.connect()
const socketStore = useSocketStore()
socketStore.socket = socket
socketStore.bindEvents()
provide('socket', socket)

socket.on("connect", (e) => {
  console.log(`connected to`, e)
});

socket.on("disconnect", (reason, description) => {
  console.log(`[SOCKET] disconnected for "${reason}" because "${description}"`)
});

onMounted(() => {
  console.log(route)

})

onUnmounted(async () => {
  socket.disconnect()
})
</script>

<template>
  <div class="d-flex flex-column justify-content-evenly">
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
</template>

<style scoped>

</style>