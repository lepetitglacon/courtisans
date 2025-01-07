<script setup lang="ts">
import {useConnectionStore} from "@/stores/socket.ts";
import Action from "@/components/actions/Action.vue";
import {socket} from "@/socket.ts";

const props = defineProps(['user'])

const gameStore = useConnectionStore()
</script>

<template>

	<div
		v-if="user.socket !== socket.id"
		class="player"
	>
    <p class="card" v-for="card of user.cards">{{ card.id }} {{ card.power }}</p>

		<Action action="give" :data="{
			toUserId: user.socket,
		}"/>
		{{ user.name }}
		{{ user.socket }}

	</div>

</template>

<style scoped>
.player {
	padding: 20px;
	background-color: rgba(0, 0, 0, 10%);
}
.card {
  background-color: rgba(255, 255, 0, 40%);
}
</style>