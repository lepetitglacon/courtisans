<script setup lang="ts">
import {useSocketStore} from "@/stores/socket.ts";
import Player from "@/components/players/Player.vue";
import {inject, provide} from "vue";

const socketStore = useSocketStore()


const socket = inject('socket')
</script>

<template>
	<div class="players-container w-100 h-100 d-flex justify-content-evenly">
    <template v-if="socketStore.game?.users?.length > 1"
              v-for="user of socketStore.game.users ?? []"
    >
		  <Player
          v-if="user.socket.id !== socket.id"
          :key="user?.socket?.id"
          :user="user"
      />
    </template>

    <p v-else>En attente d'autre joueur</p>

	</div>
</template>

<style scoped>
.players-container {
	background-color: rgba(71, 198, 52, 0.12);
}
</style>