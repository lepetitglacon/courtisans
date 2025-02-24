<script setup lang="ts">
import {useSocketStore} from "@/stores/socket.ts";
import Action from "@/components/actions/Action.vue";
import {useGameStore} from "@/stores/game.ts";
import Card from "@/components/cards/Card.vue";
import Deck from "@/components/cards/Deck.vue";
import {provide, ref} from "vue";
import useColor, {BLUE, YELLOW, BACKGROUND, LIGHT_BLUE} from "@/composables/useColor.ts";
import PlateauDeck from "@/components/plateau/PlateauDeck.vue";
import {onBeforeRouteLeave, onBeforeRouteUpdate} from "vue-router";
import PlateauPlayer from "@/components/plateau/PlateauPlayer.vue";
import Chat from "@/components/Chat.vue";

const socketStore = useSocketStore()
const gameStore = useGameStore()

provide('killAction', 'kill_crown')

function warningBeforeLeavingRoom() {

}
onBeforeRouteLeave((to, from) => {
	const answer = window.confirm(
		'Do you really want to leave? you have unsaved changes!'
	)
	// cancel the navigation and stay on the same page
	if (!answer) return false
})

</script>

<template>
  <div class="d-flex flex-column col-6 m-2 rounded-2">

    <div class="d-flex h-100 rounded-2 pb-2" :style="{
		backdropFilter: 'blur(10px)',
	  backgroundColor: 'rgba(100, 100, 100, 0.5)',
    }">
      <div class="m-5 w-100 d-flex position-relative" :style="{backgroundColor: useColor()}">

        <!-- PANEL -->
        <div class="d-flex justify-content-evenly w-100 h-50 py-2 px-5 position-absolute"
             :style="{
                zIndex: '1',
                backgroundColor: BLUE,
                borderRadius: '5px',
                border: `solid 5px ${YELLOW}`,
                transform: 'translateY(50%) scaleX(1.1)'
              }"
        >
            <div class="d-flex p-2">
	            <Chat/>
            </div>
          <div class="d-flex flex-column p-2" :style="{backgroundColor: LIGHT_BLUE, borderRadius: '5px'}">
            <p>MENU</p>
	          <RouterLink class="btn btn-game" to="/">Quitter</RouterLink>
	          <button class="btn btn-game" @click="">Options</button>
          </div>
          <div class="d-flex flex-column justify-content-center align-items-center p-2">
	          <p>MISSIONS</p>
            <div
	            class="m-2 w-100 h-100 text-center rounded-2 d-flex align-items-center text-center"
	            v-for="card of socketStore?.currentPlayer?.missionCards ?? []"
	            :style="{
					backgroundColor: BACKGROUND,
					color: YELLOW,
					border: `solid 3.5px ${YELLOW}`,
				}"
            >
              {{ card.text }}
            </div>
          </div>
          <div class="">
	          <img
		          class="img h-100"
		          :src="`/cards/assassin.png`"
	          >
          </div>
        </div>

        <!-- FAMILIES -->
        <template v-for="family of Object.values(socketStore?.game?.infos?.FAMILIES ?? [])">
          <div class="col d-flex flex-column" :style="{
          }">
            <PlateauDeck class="h-100" :cards="socketStore.game.familyCards[family.id].enlighten" action="enlight"/>
            <PlateauDeck class="h-100" :cards="socketStore.game.familyCards[family.id].shadowed" action="shadow"/>
          </div>
        </template>

      </div>
    </div>

	  <PlateauPlayer />

  </div>
</template>

<style scoped>
.plateau {

}
.side {
  width: 15%;
}
.plateau-family {
  color: white;
}
.family-img {
  height: 8cm;
  width: 4.5cm;
}

.plateau .card {
	background-color: rgba(0,0,0,20%);
	margin: 5px;
	padding: 2px;
	border-radius: 2px;
}
.plateau .family-img {

}

.enlight {
  height: 50%;
}
.enlighten-cards {
  background-color: #cfb960;
}

.shadowed {
  bottom: 0;
  height: 50%;
}
.shadowed-cards {
  height: 50%;
  background-color: #9a5858;
}

.mission-card {
  width: 5cm;
  height: 4cm;

  margin: 5px;
  padding: 20px;

  background-color: #fbedd6;
  border-radius: 10px;
  border: solid 5px #774f36;
  color: #774f36 !important;
}
.mission-card p {
  word-break: break-word;
  font-weight: 800;
}


</style>