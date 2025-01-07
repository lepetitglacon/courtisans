<script setup lang="ts">
import {useConnectionStore} from "@/stores/socket.ts";
import Action from "@/components/actions/Action.vue";

const props = defineProps(['user'])

const gameStore = useConnectionStore()
</script>

<template>

	<div
		v-if="user.socket !== gameStore.currentPlayer?.socket"
		class="player"
	>
		<Action action="give" :data="{
			id: user.id,
		}"/>
		{{ user.name }}
	</div>

</template>

<style scoped>
.player {
	padding: 20px;
	background-color: rgba(0, 0, 0, 10%);
}
</style>