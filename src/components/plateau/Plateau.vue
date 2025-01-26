<script setup lang="ts">
import draggable from "vuedraggable";
import {useSocketStore} from "@/stores/socket.ts";
import Action from "@/components/actions/Action.vue";
import {useGameStore} from "@/stores/game.ts";
import Card from "@/components/cards/Card.vue";
import Deck from "@/components/cards/Deck.vue";
import {ref} from "vue";

const socketStore = useSocketStore()
const gameStore = useGameStore()

const plateauRef = ref()
</script>

<template>

  <div
      ref="plateauRef"
      class="plateau h-100 w-100 d-flex"
  >

    <div class="side bg-info">
      <p>Cartes mission</p>
    </div>
    <div class="w-100 d-flex justify-content-between bg-dark">
      <div
          class="w-100 d-flex flex-column justify-content-center position-relative"
          v-for="family of socketStore?.game?.infos?.FAMILIES"
          :style="{
                  backgroundColor: family.color,
                  width: plateauRef?.getBoundingClientRect().width / 7 - 0.1 + 'px'
                }"
      >
        <Action class="w-100 h-50 top-0 position-absolute" action="enlight"/>
        <Deck :cards="socketStore.game.familyCards[family.id].enlighten"/>
        <p>{{ family.title}}</p>
        <Deck :cards="socketStore.game.familyCards[family.id].shadowed"/>
        <Action class="w-100 h-50 bottom-0 position-absolute" action="shadow"/>

      </div>
    </div>
    <div class="side bg-info">
      <p>Pioche</p>
    </div>

<!--    <div class="col-2 position-relative">-->
<!--        <Card :card="socketStore.game.cards[0]" :showBackFace="true" :movable="false"/>-->
<!--    </div>-->

<!--    <div class="col">-->

<!--      <div class="row h-100 d-flex">-->
<!--        <div-->
<!--            v-for="[key, family] of Object.entries(socketStore?.game?.infos?.FAMILIES ?? [])"-->
<!--            class="plateau-family col d-flex flex-column justify-content-evenly align-items-center"-->
<!--            :style="{backgroundColor: family.color}"-->
<!--        >-->

<!--          <div class="row position-relative scaled">-->
<!--            <Deck :cards="socketStore.game.familyCards[family.id].enlighten"/>-->
<!--          </div>-->

<!--          <div class="row position-relative">-->
<!--            <div class="enlight position-absolute">-->
<!--              <Action action="enlight" :data="{familyId: family.id}"/>-->
<!--            </div>-->
<!--            <img-->
<!--                class="family-img"-->
<!--                :src="`/cards/${family.id}.png`"-->
<!--            >-->
<!--            <div class="shadowed position-absolute">-->
<!--              <Action action="shadow" :data="{familyId: family.id}"/>-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="row position-relative scaled">-->
<!--	          <Deck :cards="socketStore.game.familyCards[family.id].shadowed"/>-->
<!--          </div>-->

<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div class="col-2">-->
<!--      <div class="row h-100 d-flex flex-column justify-content-center align-items-center">-->
<!--        <div-->
<!--            v-for="card of socketStore.currentPlayer?.missionCards ?? []"-->
<!--            class="col mission-card d-flex justify-content-center align-items-center"-->
<!--        >-->
<!--          <p>{{ card.text }}</p>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
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
}
.mission-card p {
  word-break: break-word;
  font-weight: 800;
  color: #774f36;
}
</style>