<script setup lang="ts">
import {useSocketStore} from "@/stores/socket.ts";
import Player from "@/components/players/Player.vue";
import {socket} from "@/socket.ts";

const socketStore = useSocketStore()
</script>

<template>
	<div class="players-container w-100 h-100 d-flex justify-content-evenly">
    <template v-for="user of socketStore.game.users ?? []">
		  <Player v-if="user.socket !== socket.id" :user="user" />
    </template>
	</div>
</template>

<style scoped>
.players-container {
	background-color: rgba(71, 198, 52, 0.12);
}
</style>