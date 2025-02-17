<script setup lang="ts">
  import Card from "@/components/cards/Card.vue";

  import {useSocketStore} from "@/stores/socket.ts";
  import {useGameStore} from "@/stores/game.ts";
  import {provide, ref} from "vue";

  const socketStore = useSocketStore()
  const gameStore = useGameStore()

  const absoluteContainerRef = ref()

  provide('killAction', 'kill_own')
  provide('absoluteContainerRef', absoluteContainerRef)
</script>

<template>

  <div class="ownplayer d-flex justify-content-center position-absolute"
    ref="absoluteContainerRef"
  >

    <div class="ownplayer-inner d-flex justify-content-center">
      <div
          v-for="i in 3"
          :key="i"
          class="ownplayer-card-container"
          :style="{

          }"
      >
        <Card
            v-if="socketStore.currentPlayer?.handCards[i - 1]"
            :key="socketStore.currentPlayer?.handCards[i - 1].id"
            :card="socketStore.currentPlayer?.handCards[i - 1]"
            :index="i - 1"
            :isPlayerDeck="true"
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
.ownplayer-card-container {
  min-width: 150px;
}
</style>