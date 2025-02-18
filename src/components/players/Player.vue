<script setup lang="ts">
import {useSocketStore} from "@/stores/socket.ts";
import {useGameStore} from "@/stores/game.ts";
import {computed, inject, onMounted, provide, ref} from "vue";
import Deck from "@/components/cards/Deck.vue";
import Action from "@/components/actions/Action.vue";
import useColor, {BLUE} from "@/composables/useColor.ts";

const props = defineProps<{
  user: object
  left: boolean
}>()

provide('killAction', 'kill_other')
provide('otherUser', props.user?.socket.id)
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
      class="d-flex h-100 w-100 "
      :class="[
          left ? '' : 'flex-row-reverse ',
          hovered && gameStore.holdenCard && 'hovered',
          !user.socket.connected && 'disconnected'
      ]"
    >

	<!-- DECKS CARTES -->
      <div
          class="col-10 d-flex flex-wrap m-2 p-2 rounded-2"
          :class="[
              left ? 'justify-content-start' : 'justify-content-end',
          ]"
      >
	      <template v-for="family of socketStore?.game?.infos?.FAMILIES ?? []" >
		      <div
			      v-if="family.id !== 'assassin'"
			      class="family-deck-container m-1 rounded-1"
            :style="{backgroundColor: family.color}"
		      >
		            <Deck
		                v-if="user?.cards"
		                :cards="user?.cards?.filter(card => card.family.id === family.id && card.power !== 'hidden') ?? {}"
		                :show-back-face="false"
                    :reversed="['grey', 'lightgreen', 'red'].includes(family.id)"
		            />
		      </div>
	      </template>
      </div>

      <div class="col-2 info position-relative d-flex flex-column">
        <div
	        class="player-info position-absolute z-1"
	        :class="[
				left ? '' : 'text-end rtl',
	        ]"
        >
          <p>{{user.name}}</p>
          <p>{{user.socket.id}}</p>
        </div>
        <Deck :cards="user?.cards?.filter(card => card.power === 'hidden') ?? []" :show-back-face="true"/>
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
	color: floralwhite;
	font-size: 1.5em;
	font-weight: bold;
}
</style>