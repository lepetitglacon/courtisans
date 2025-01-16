<script setup lang="ts">
import {useConnectionStore} from "@/stores/socket.ts";
import Action from "@/components/actions/Action.vue";
import {socket} from "@/socket.ts";
import Deck from "@/components/cards/Deck.vue";

const props = defineProps(['user'])

const gameStore = useConnectionStore()

</script>

<template>


    <div
      v-if="user.socket !== socket.id"
      class="player-container d-flex justify-content-center"
    >
      <Action action="give" :data="{toUserId: user.socket}" class="player">
        <div>
          <p>{{ user.name }}</p>
          <p>{{ user.socket }}</p>
        </div>

	      <div class="d-flex scaled">
	        <div
	            class="family d-flex justify-content-center"
	            v-for="family of gameStore?.game?.infos?.FAMILIES"
	            :style="{backgroundColor: family.color}"
	        >
	          <Deck :cards="user.cards.filter(card => card.family.id === family.id)"/>
	        </div>
	      </div>
      </Action>



    </div>



</template>

<style scoped>
.player-container {
	height: 100%;
	width: 100%;
	background-color: rgba(50, 50, 50, 0.17);
}
.player {
	background-color: rgba(50, 50, 50, .5);
}
.family {
	min-width: 4.5cm;
}
</style>