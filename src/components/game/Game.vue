<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import Players from "@/components/game/players/Players.vue";
import AppContainer from "@/components/AppContainer.vue";
import OwnPlayer from "@/components/game/OwnPlayer.vue";
import UI from "@/components/UI/UI.vue";
import Plateau from "@/components/game/plateau/Plateau.vue";
import {onMounted, onUnmounted, provide, ref} from "vue";
import {io} from "socket.io-client";
import {useSocketStore} from "@/stores/socket.ts";
import useColor, {BLUE} from "@/composables/useColor.ts";
import Player from "@/components/game/players/Player.vue";
import {useGameStore} from "../../stores/game.ts";
const route = useRoute()
const socket = io(`${import.meta.env.VITE_SERVER_URL}`, {
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

function connect() {
  console.log(`connected`)
}
function disconnect(reason, description) {
  console.log(`[SOCKET] disconnected for "${reason}" because "${description}"`)
}
onMounted(() => {
  socket.on("connect", connect)
  socket.on("disconnect", disconnect);
})
onUnmounted(async () => {
  socket.off("connect", connect)
  socket.off("disconnect", disconnect);
})
</script>

<template>


	<div id="image-bg"></div>
	<div id="clip-path"></div>

	<div v-if="socketStore.game" class="d-flex flex-column flex-xl-row w-100 h-100" :style="{backgroundColor: useColor()}">

		<!-- Left Column (2 Rows) -->
		<div class="d-flex flex-column col" :style="{backgroundColor: useColor()}" style="z-index: 1">
			<div class="h-100 d-flex justify-content-end" :style="{backgroundColor: useColor()}">
			    <Player
	              v-if="socketStore?.otherPlayers[0]"
	              :user="socketStore.otherPlayers[0]"
	              :key="socketStore.otherPlayers[0].socket.id"
	              :left="true"
	            />
			</div>
			<div class="h-100" :style="{backgroundColor: useColor()}">
	          <Player
	              v-if="socketStore?.otherPlayers[1]"
	              :user="socketStore.otherPlayers[1]"
	              :key="socketStore.otherPlayers[1].socket.id"
	              :left="true"
	          />
			</div>
		</div>

		<!-- Center Column -->
        <Plateau/>

		<!-- Right Column (2 Rows) -->
		<div class="d-flex flex-column col" :style="{backgroundColor: useColor()}" style="z-index: 1">
			<div class="h-100" :style="{backgroundColor: useColor()}">
		        <Player
		            v-if="socketStore?.otherPlayers[2]"
		            :user="socketStore.otherPlayers[2]"
		            :key="socketStore.otherPlayers[2].socket.id"
		            :left="false"
		        />
			</div>
			<div class="h-100" :style="{backgroundColor: useColor()}">
		        <Player
		            v-if="socketStore?.otherPlayers[3]"
		            :user="socketStore.otherPlayers[3]"
		            :key="socketStore.otherPlayers[3].socket.id"
		            :left="false"
		        />
			</div>
		</div>

    <OwnPlayer/>

	    <UI/>
	</div>
	<div
		v-else
		class="d-flex justify-content-center align-items-center h-100 position-relative game-loader"
		:style="{backgroundColor: BLUE}"
	>
		<p class=" text-center">Chargement... ({{ socketStore.isConnected ? 'Connecté' : 'En attente de connexion' }})</p>
	</div>


</template>

<style scoped>

#clip-path {
	clip-path: polygon( 101.797% 111.538%,-1.771% 111.538%,-1.771% 0.615%,-1.771% 0.615%,0.003% 8.312%,2.505% 16.998%,5.737% 26.249%,9.704% 35.641%,14.41% 44.75%,19.858% 53.153%,26.051% 60.427%,32.993% 66.146%,40.689% 69.889%,49.141% 71.231%,49.141% 71.231%,57.626% 69.889%,65.413% 66.146%,72.497% 60.427%,78.87% 53.153%,84.525% 44.75%,89.456% 35.641%,93.655% 26.249%,97.117% 16.998%,99.833% 8.312%,101.797% 0.615%,101.797% 111.538% );;
	background-color: #2c3e50;
	height: 25vh;
	width: 100%;
	position: absolute;
	bottom: 0;
	z-index: 0;
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
.game-loader {
	z-index: 999;
}
</style>