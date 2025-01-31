<script setup lang="ts">
  import Card from "@/components/cards/Card.vue";
  import Action from "@/components/actions/Action.vue";
  import Chat from "@/components/Chat.vue";

  import {useSocketStore} from "@/stores/socket.ts";
  import {useGameStore} from "@/stores/game.ts";
  import Player from "@/components/players/Player.vue";
  import NewCard from "@/components/cards/DeckCard.vue";

  const socketStore = useSocketStore()
  const gameStore = useGameStore()
</script>

<template>

  <div class="h-100 w-100 d-flex">

    <div class="side d-flex bg-danger">
      <Chat/>
      <div>
        <pre>{{ gameStore.holdenCard }}</pre>
        <pre>{{ gameStore.holdenCardAction }}</pre>
      </div>
    </div>
    <div class="player-deck bg-dark">
      <Player class="h-100" v-if="socketStore.currentPlayer" :user="socketStore.currentPlayer" />
    </div>
    <div class="side bg-danger">
      <p>Cartes</p>

      <div class="w-100 d-flex ">
        <div class="col"
             v-for="[i, card] of socketStore.currentPlayer?.handCards.entries() ?? []"
        >
          <Card
              class="m-2 col"

              :card="card"
              :index="i"
              :movable="true"
              is-player-deck="true"
          />

        </div>

      </div>

      <div>
        <p v-if="socketStore?.isYourTurn">Your turn {{ socketStore?.game.userActionsToPlay }}</p>
      </div>

      <pre></pre>
    </div>

  </div>
<!--  <div class="own-player-container">-->

<!--    <div class="floating-left-bottom">-->
<!--      <pre>{{gameStore.holdenCard}}</pre>-->
<!--      <pre>{{gameStore.holdenCardAction}}</pre>-->
<!--    </div>-->

<!--    <Chat/>-->

<!--    <div class="own-player">-->
<!--      <Action action="keep">-->
<!--      <div class="families scaled">-->
<!--        <div-->
<!--            class="family"-->
<!--            v-for="family of socketStore?.game?.infos?.FAMILIES"-->
<!--            :style="{backgroundColor: family.color}"-->
<!--        >-->
<!--          <Deck v-if="family.id !== 'assassin'" :cards="socketStore?.currentPlayer?.cards.filter(card => card.family.id === family.id && card.power !== 'hidden')"/>-->
<!--          <Deck v-else :cards="socketStore?.currentPlayer?.cards.filter(card => card.power === 'hidden')"/>-->
<!--        </div>-->
<!--      </div>-->

<!--      </Action>-->

<!--    </div>-->

<!--    <div class="deck">-->
<!--      <div class="row">-->
<!--        <p class="isYourTurn" v-if="socketStore.isYourTurn">À vous de jouer !</p>-->
<!--        <div class="actionsToPlay d-flex mb-5">-->
<!--          <div class="action" v-if="socketStore.game.userActionsToPlay" v-for="action of socketStore.game.userActionsToPlay">{{action}}</div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="row">-->
<!--        <div v-for="card in socketStore?.currentPlayer?.handCards ?? []" :key="card.id"-->
<!--             class="col d-flex justify-content-center">-->
<!--          <Card :card="card" :movable="true" :is-player-deck="true"/>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->


</template>

<style scoped>
.player-deck {
  width: 50vw;
}
.side {
  width: 25vw;
}
</style>