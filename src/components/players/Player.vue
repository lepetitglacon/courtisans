<script setup lang="ts">
import {useSocketStore} from "@/stores/socket.ts";
import {useGameStore} from "@/stores/game.ts";
import {computed, inject, onMounted, provide, ref} from "vue";
import Deck from "@/components/cards/Deck.vue";
import Action from "@/components/actions/Action.vue";
import useColor from "@/composables/useColor.ts";

const props = defineProps<{
  user: object
  left: boolean
}>()

provide('otherUser', props.user)
const socket = inject('socket')

const playerContainerRef = ref<HTMLDivElement|null>(null)
const playerRef = ref<HTMLDivElement|null>(null)
const hovered = ref(false)
const active = ref(true)

const socketStore = useSocketStore()
const gameStore = useGameStore()

gameStore.registerActionDiv(
    'give',
    playerContainerRef,
    {
      toUserId: props.user?.socket?.id
    },
    hovered,
    active
)

const color = computed(() => {
  const families = Object.values(socketStore.game?.infos?.FAMILIES ?? {})
  if (families) {
    const foundUser = families[socketStore.game?.users.indexOf(props.user)]
    return foundUser.color
  }
  return '#582'
})
</script>

<template>
    <div
      ref="playerContainerRef"
      class="d-flex h-100 w-100 p-2 row"
      :class="[
          hovered && gameStore.holdenCard && 'hovered',
          !user.socket.connected && 'disconnected'
      ]"
    >

	<!-- DECKS CARTES -->
      <div class="col-10 d-flex flex-wrap">
	      <template v-for="family of socketStore?.game?.infos?.FAMILIES ?? []" >
		      <div
			      v-if="family.id !== 'assassin'"
			      class="family-deck-container"
		      >
		            <Deck
		                v-if="user?.cards"
		                :cards="user?.cards?.filter(card => card.family.id === family.id && card.power !== 'hidden') ?? {}"
		                :show-back-face="false"
		            />
		      </div>
	      </template>
      </div>

      <div class="col-2 info position-relative">
        <div class="player-info">
          <p>{{user.name}}</p>
          <p>{{user.socket.id}}</p>
        </div>
<!--        <Deck v-for="cards of user.cards.filter(card => card.power === 'hidden')" :cards="cards" :show-back-face="false"/>-->
      </div>

    </div>
</template>

<style scoped>
.player {
  width: 90%;
  height: 90%;
  background-color: rgba(0, 0, 0, 0.17);
}

.disconnected {
  opacity: .3;
}
.family-deck-container {
	width: 30%;
}
.player-info {
	color: #32464D;
	font-size: 1.5em;
	font-weight: bolder;
}
</style>