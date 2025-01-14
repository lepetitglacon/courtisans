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
      <div class="row d-flex">
        <div
            v-for="[key, family] of Object.entries(socketStore?.game?.infos?.FAMILIES ?? [])"
            class="plateau-family col d-flex flex-column justify-content-center align-items-center"
            :style="{backgroundColor: family.color}"
        >

          <div class="row position-relative">
            <pre>{{ socketStore.game.familyCards[family.id].enlighten.length }}</pre>
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
            <div class="shadow position-absolute">
              <Action action="shadow" :data="{familyId: family.id}"/>
            </div>
          </div>

          <div class="row">
            <Card v-for="familyCard of socketStore.game.familyCards[family.id].shadowed" :card="familyCard"/>
            <!--            <Action action="kill_crown" :data="{familyId: family.id}">-->
            <!--              {{ familyCard.id }} {{ familyCard.power }}-->
            <!--            </Action>-->
            <pre>{{ socketStore.game.familyCards[family.id].shadowed.length }}</pre>
          </div>

        </div>
      </div>
    </div>

    <div class="col-2">
      <img/>
      <img/>
    </div>
  </div>

</template>

<style scoped>
.plateau {
}
.plateau-family {
  color: white;
}

.middle-cards-container {
  display: flex;
  justify-content: center;
  align-items: center;


  position: relative;
  height: 100%;
}
.middle-cards {
  position: absolute;
  height: 8cm;
  width: 100%;
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

.deck-container {
  flex-basis: 0;
}

.enlight {
  background-color: rgba(0,0,0,25%);
  height: 50%;
}
.enlighten-cards {
  background-color: #cfb960;
}

.shadow {
  background-color: rgba(0,0,0,75%);
  bottom: 0;
  height: 50%;
}
.shadowed-cards {
  height: 50%;
  background-color: #9a5858;
}
</style>