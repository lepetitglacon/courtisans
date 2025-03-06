<script setup lang="ts">
import {useSocketStore} from "@/stores/socket.ts";
import {useGameStore} from "@/stores/game.ts";
import Card from "@/components/game/cards/Card.vue";
import Deck from "@/components/game/cards/Deck.vue";
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
		class="h-100 w-100 d-flex flex-column mt-2 p-5 rounded-2"
		style="backdrop-filter: blur(10px); background-color: rgba(100, 100, 100, 0.5);"
	>
    <p class="text-center">{{socketStore.currentPlayer.name}} (Vous)</p>


		<div
			ref="actionRef"
			class="h-100 w-100 mt-2 d-flex justify-content-center rounded-2"
			:class="[
				hovered && 'hovered',
			]"
		>

			<!-- FAMILIES -->
			<template v-for="family of Object.values(socketStore?.game?.infos?.FAMILIES ?? [])">
				<div class="col d-flex flex-column">
					<template v-if="socketStore.game.state !== 'COUNTING'">
						<Deck v-if="family.id !== 'assassin'" class="h-100" :cards="socketStore.currentPlayer.cards.filter(card => card.family.id === family.id && card.power !== 'hidden')" action="enlight"/>
						<Deck v-else class="h-100" :cards="socketStore.currentPlayer.cards.filter(card => card.power === 'hidden')" action="enlight"/>
					</template>
					<template v-else>
						<Deck v-if="family.id !== 'assassin'" class="h-100" :cards="socketStore.currentPlayer.cards.filter(card => card.family.id === family.id)"/>
						<div v-else class="d-flex flex-column w-100 h-100 align-items-center">
							<p>Résultat</p>

							<table class="table">
								<thead>
								<tr>
									<th>Famille</th>
									<th>Points</th>
								</tr>
								</thead>
								<tbody>
								<tr v-for="[familyId, points] of Object.entries(socketStore?.game?.score?.users[socketStore.currentPlayer.socket.id])">
									<th :style="{backgroundColor: Object.values(socketStore?.game?.infos?.FAMILIES).find(el => el.id === familyId)?.color ?? ''}">
										{{ Object.values(socketStore?.game?.infos?.FAMILIES).find(el => el.id === familyId)?.title ?? familyId }}
									</th>
									<td :style="{backgroundColor: Object.values(socketStore?.game?.infos?.FAMILIES).find(el => el.id === familyId)?.color ?? ''}">{{ points }}</td>
								</tr>
								</tbody>
							</table>

						</div>
					</template>
				</div>
			</template>
		</div>

	</div>



</template>

<style scoped>

</style>