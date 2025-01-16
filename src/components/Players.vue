<script setup lang="ts">
import {useConnectionStore} from "@/stores/socket.ts";
import Player from "@/components/Player.vue";

const socketStore = useConnectionStore()
</script>

<template>
	<div class="players-container d-flex justify-content-around">
		<Player v-for="user of socketStore.game.users ?? []" :user="user" />
	</div>
</template>

<style scoped>
.players-container {
	background-color: rgba(71, 198, 52, 0.12);
}
</style>