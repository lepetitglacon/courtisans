<script setup lang="ts">
  import Card from "@/components/cards/Card.vue";
  import Action from "@/components/actions/Action.vue";
  import Chat from "@/components/Chat.vue";

  import {useSocketStore} from "@/stores/socket.ts";
  import {useGameStore} from "@/stores/game.ts";
  import Player from "@/components/players/Player.vue";
  import NewCard from "@/components/cards/DeckCard.vue";
  import {provide} from "vue";
  import useColor from "@/composables/useColor.ts";

  const socketStore = useSocketStore()
  const gameStore = useGameStore()

  provide('killAction', 'kill_own')
</script>

<template>

  <div class="ownplayer d-flex justify-content-center position-absolute"

  >

    <div class="ownplayer-inner d-flex justify-content-center">
      <div
          v-for="i in 3"
          class="card-container"
          :style="{
            transform: `rotateZ(${i === 1 ? -.05 : i === 2 ? 0 : .05 }turn) translateY(${i === 1 || i === 3 ? 50 : 0}px)`
          }"
      >
        <Card
            v-if="socketStore.currentPlayer?.handCards[i - 1]"
            :card="socketStore.currentPlayer?.handCards[i - 1]"
            movable="true"
        />
      </div>
    </div>

<!--    <div class="side d-flex">-->
<!--      <Chat/>-->
<!--      <div>-->
<!--        <pre>{{ gameStore.holdenCard }}</pre>-->
<!--        <pre>{{ gameStore.holdenCardAction }}</pre>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="player-deck bg-dark">-->
<!--      <Player class="h-100" v-if="socketStore.currentPlayer" :user="socketStore.currentPlayer" />-->
<!--    </div>-->
<!--    <div class="side">-->
<!--      <p>Cartes</p>-->

<!--      <div class="w-100 d-flex ">-->
<!--        <div class="col"-->
<!--             v-for="[i, card] of socketStore.currentPlayer?.handCards.entries() ?? []"-->
<!--        >-->
<!--          <Card-->
<!--              :key="card.id"-->
<!--              class="m-2 col"-->

<!--              :card="card"-->
<!--              :index="i"-->
<!--              :movable="true"-->
<!--              is-player-deck="true"-->
<!--          />-->

<!--        </div>-->

<!--      </div>-->

<!--      <div>-->
<!--        <p v-if="socketStore?.isYourTurn">Your turn {{ socketStore?.game.userActionsToPlay }}</p>-->
<!--      </div>-->

<!--      <pre></pre>-->
<!--    </div>-->

  </div>


</template>

<style scoped>
.ownplayer {
  bottom: 0;
  width: 100vw;
  height: 200px;
  z-index: 5;
}
.ownplayer-inner {
  min-width: 50vw;
}
</style>