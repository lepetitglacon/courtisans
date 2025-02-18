<script setup lang="ts">
import draggable from "vuedraggable";
import {useSocketStore} from "@/stores/socket.ts";
import Action from "@/components/actions/Action.vue";
import {useGameStore} from "@/stores/game.ts";
import Card from "@/components/cards/Card.vue";
import Deck from "@/components/cards/Deck.vue";
import {provide, ref} from "vue";
import useColor, {BLUE, YELLOW} from "@/composables/useColor.ts";
import PlateauDeck from "@/components/plateau/PlateauDeck.vue";

const socketStore = useSocketStore()
const gameStore = useGameStore()

provide('killAction', 'kill_crown')

const plateauRef = ref()
const enlightenRef = ref()
const shadowedRef = ref()
</script>

<template>
  <div class="d-flex flex-column col-6" >
    <div class="d-flex h-100" :style="{backgroundColor: useColor()}">
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
            <div class="d-flex flex-wrap">
              <p>CHAT</p>
              <pre>
                {{ useGameStore().holdenCard }}
                {{ useGameStore().holdenCardAction }}
                {{ useGameStore().holdenCardActionData }}
              </pre>
            </div>
          <div>
            <p>MENU</p>
          </div>
          <div>
            <p>MISSIONS</p>
          </div>
          <div>
            <p>DECK</p>
          </div>
        </div>

        <!-- FAMILIES -->
        <template v-for="family of Object.values(socketStore?.game?.infos?.FAMILIES ?? [])">

          <div class="col d-flex flex-column" :style="{backgroundColor: family.color}">

            <PlateauDeck class="h-100"  :cards="socketStore.game.familyCards[family.id].enlighten" />

            <PlateauDeck class="h-100" :cards="socketStore.game.familyCards[family.id].shadowed" />

          </div>

        </template>

      </div>
    </div>

    <div class="h-100" :style="{backgroundColor: useColor()}">
      <p>own player</p>
    </div>
  </div>
<!--  <div-->
<!--      ref="plateauRef"-->
<!--      class="plateau h-100 w-100 d-flex"-->
<!--  >-->

<!--    <div class="side">-->
<!--      <p>Cartes mission</p>-->

<!--      <p class="mission-card" v-for="card of socketStore?.currentPlayer?.missionCards ?? []">-->
<!--        {{ card.text }}-->
<!--      </p>-->

<!--    </div>-->
<!--    <div class="w-100 d-flex justify-content-between bg-dark">-->
<!--      <div-->
<!--          class="w-100 d-flex flex-column justify-content-center position-relative"-->
<!--          v-for="family of socketStore?.game?.infos?.FAMILIES"-->
<!--          :style="{-->
<!--                  backgroundColor: family.color,-->
<!--                  width: plateauRef?.getBoundingClientRect().width / 7 - 0.1 + 'px'-->
<!--                }"-->
<!--      >-->
<!--        <Action-->
<!--            class="w-100 h-50 top-0 position-absolute"-->
<!--            action="enlight"-->
<!--            :data="{familyId: family.id, relatedDeck: socketStore.game.familyCards[family.id].enlighten}"-->
<!--        >-->
<!--          <Deck :cards="socketStore.game.familyCards[family.id].enlighten"/>-->
<!--        </Action>-->
<!--        <p>{{ family.title}}</p>-->
<!--        <Action-->
<!--            class="w-100 h-50 bottom-0 position-absolute"-->
<!--            action="shadow"-->
<!--            :data="{familyId: family.id, relatedDeck: socketStore.game.familyCards[family.id].shadowed}"-->
<!--        >-->
<!--          <Deck :cards="socketStore.game.familyCards[family.id].shadowed"/>-->
<!--        </Action>-->

<!--      </div>-->
<!--    </div>-->
<!--    <div class="side">-->
<!--      <p>Pioche</p>-->
<!--    </div>-->
<!--  </div>-->

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