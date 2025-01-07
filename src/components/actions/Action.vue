<script setup lang="ts">
import {useConnectionStore} from "@/stores/socket.ts";

const props = defineProps([
	'action',
	'data'
])

const gameStore = useConnectionStore()

function handleDragOver(e) {
	e.preventDefault()
}
function handleDragDrop(e) {
	console.log()
	const card = JSON.parse(e.dataTransfer.getData("application/json"))
	gameStore.emit('client/play', {
		action: e.target.dataset.action,
		id: card.id,
		family: e.target.dataset.family,
	})
}
</script>

<template>
	<div
		class="card"
		@dragover="handleDragOver"
		@drop="handleDragDrop"
	>

	</div>
</template>

<style scoped>

</style>