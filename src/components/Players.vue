<script setup lang="ts">
import {useConnectionStore} from "@/stores/socket.ts";
import Player from "@/components/Player.vue";

const gameStore = useConnectionStore()
</script>

<template>
	<div class="players-container">
		<Player v-for="user of gameStore.game.users ?? []" :user="user" />
	</div>
</template>

<style scoped>
.players-container {
	display: flex;
	justify-content: space-evenly;

	width: 100%;
	height: 20vh;
	background-color: #a3cda5;
}
</style>