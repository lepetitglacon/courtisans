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


	<div class="d-flex justify-content-evenly w-100 h-100">

		<div id="left">

		</div>

		<div id="center">

		</div>

		<div id="right">

		</div>


<!--    <AppContainer>-->
<!--      <Players/>-->
<!--    </AppContainer>-->

<!--    <AppContainer>-->
<!--      <Plateau/>-->
<!--    </AppContainer>-->

<!--    <AppContainer>-->
<!--      <OwnPlayer/>-->
<!--    </AppContainer>-->

<!--    <UI/>-->
  </div>

	<div id="image-bg"></div>
	<div id="clip-path"></div>

</template>

<style scoped>

#clip-path {
	clip-path: polygon( 101.797% 111.538%,-1.771% 111.538%,-1.771% 0.615%,-1.771% 0.615%,0.003% 8.312%,2.505% 16.998%,5.737% 26.249%,9.704% 35.641%,14.41% 44.75%,19.858% 53.153%,26.051% 60.427%,32.993% 66.146%,40.689% 69.889%,49.141% 71.231%,49.141% 71.231%,57.626% 69.889%,65.413% 66.146%,72.497% 60.427%,78.87% 53.153%,84.525% 44.75%,89.456% 35.641%,93.655% 26.249%,97.117% 16.998%,99.833% 8.312%,101.797% 0.615%,101.797% 111.538% );;
	background-color: #2c3e50;
	height: 25vh;
	width: 100%;
	position: fixed;
	bottom: 0;
}
#image-bg {
	background-image: url("@/assets/img/courtisans-bg.svg");
	background-repeat: no-repeat;
	background-size: contain;
	width: 100vw;
	height: 100vh;
	position: absolute;
	top: 0;

	z-index: 0;
	user-select: none;
	pointer-events: none;
}
</style>