<script setup lang="ts">
import draggable from "vuedraggable";
import {useConnectionStore} from "@/stores/socket.ts";
import Action from "@/components/actions/Action.vue";
import {useGameStore} from "@/stores/game.ts";
import Card from "@/components/cards/Card.vue";
import Deck from "@/components/cards/Deck.vue";

const socketStore = useConnectionStore()
const gameStore = useGameStore()
</script>

<template>

  <div class="plateau col d-flex">

    <div class="col-2">
      <img/>
      <img/>
    </div>

    <div class="col">
      <div class="row h-100 d-flex">
        <div
            v-for="[key, family] of Object.entries(socketStore?.game?.infos?.FAMILIES ?? [])"
            class="plateau-family col d-flex flex-column justify-content-center align-items-center"
            :style="{backgroundColor: family.color}"
        >

          <div class="row position-relative scaled">
            <Deck :cards="socketStore.game.familyCards[family.id].enlighten"/>
<!--            <Action action="kill_crown" :data="{familyId: family.id}">-->
<!--              {{ familyCard.id }} {{ familyCard.power }}-->
<!--            </Action>-->
          </div>

          <div class="row position-relative">
            <div class="enlight position-absolute">
              <Action action="enlight" :data="{familyId: family.id}"/>
            </div>
            <img
                class="family-img"
                :src="`/cards/${family.id}.png`"
            >
            <div class="shadowed position-absolute">
              <Action action="shadow" :data="{familyId: family.id}"/>
            </div>
          </div>

          <div class="row scaled">
	          <Deck :cards="socketStore.game.familyCards[family.id].shadowed"/>
          </div>

        </div>
      </div>
    </div>

    <div class="col-2">
      <div class="row h-100 d-flex flex-column justify-content-center align-items-center">
        <div
            v-for="card of socketStore.currentPlayer?.missionCards ?? []"
            class="col mission-card d-flex justify-content-center align-items-center"
        >
          <p>{{ card.text }}</p>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.plateau {
  height: 100%;
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
}
.mission-card p {
  word-break: break-word;
  font-weight: 800;
  color: #774f36;
}
</style>