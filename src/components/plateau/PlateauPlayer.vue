<script setup lang="ts">
import {useSocketStore} from "@/stores/socket.ts";
import {useGameStore} from "@/stores/game.ts";
import Card from "@/components/cards/Card.vue";
import Deck from "@/components/cards/Deck.vue";
import {provide, ref} from "vue";
import useColor, {BLUE, YELLOW, BACKGROUND, LIGHT_BLUE} from "@/composables/useColor.ts";

const socketStore = useSocketStore()
const gameStore = useGameStore()

provide('killAction', 'kill_own')

const actionRef = ref<HTMLDivElement|null>(null)
const hovered = ref(false)
const active = ref(true)

gameStore.registerActionDiv(
	'keep',
	actionRef,
	{
	},
	hovered,
	active
)
</script>

<template>
	<div
		ref="actionRef"
		class="h-100 p-5 d-flex justify-content-center"
		:class="[
			hovered && 'hovered',
		]"
		:style="{backgroundColor: useColor()}"
	>
		<!-- FAMILIES -->
		<template v-for="family of Object.values(socketStore?.game?.infos?.FAMILIES ?? [])">
			<div class="col d-flex flex-column" :style="{backgroundColor: family.color}">
				<Deck v-if="family.id !== 'assassin'" class="h-100" :cards="socketStore.currentPlayer.cards.filter(card => card.family.id === family.id && card.power !== 'hidden')" action="enlight"/>
				<Deck v-if="family.id === 'assassin'" class="h-100" :cards="socketStore.currentPlayer.cards.filter(card => card.power === 'hidden')" action="enlight"/>
			</div>
		</template>
	</div>
</template>

<style scoped>

</style>