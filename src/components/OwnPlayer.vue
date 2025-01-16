<script setup lang="ts">
  import Card from "@/components/cards/Card.vue";
  import Action from "@/components/actions/Action.vue";
  import Chat from "@/components/Chat.vue";

  import {useConnectionStore} from "@/stores/socket.ts";
  import {useGameStore} from "@/stores/game.ts";
  import Deck from "@/components/cards/Deck.vue";

  const socketStore = useConnectionStore()
  const gameStore = useGameStore()
</script>

<template>

  <div class="own-player-container">
    <Chat/>

    <div class="floating-left-bottom">
      <pre>{{gameStore.holdenCard}}</pre>
      <pre>{{gameStore.holdenCardAction}}</pre>
    </div>

    <div class="own-player">
      <Action action="keep" />

      <div class="families scaled">
        <div
            class="family"
            v-for="family of socketStore?.game?.infos?.FAMILIES"
            :style="{backgroundColor: family.color}"
        >
          <Deck :cards="socketStore?.currentPlayer?.cards.filter(card => card.family.id === family.id)"/>
        </div>
      </div>
    </div>

    <div class="deck">
      <div class="row">
        <p class="isYourTurn" v-if="socketStore.isYourTurn">À vous de jouer !</p>
        <div class="actionsToPlay d-flex mb-5">
          <div class="action" v-if="socketStore.game.userActionsToPlay" v-for="action of socketStore.game.userActionsToPlay">{{action}}</div>
        </div>
      </div>
      <div class="row ">
        <div v-for="card in socketStore?.currentPlayer?.handCards ?? []" :key="card.id"
             class="col d-flex justify-content-center">
          <Card :card="card" :movable="true"/>
        </div>
      </div>
    </div>
  </div>


</template>

<style scoped>
.own-player-container {
  display: flex;
}
.deck {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100vw;
}
.own-player {
  width: 100%;
  height: 25vh;
  background-color: rgba(40, 40, 40, 0.06);
}

.isYourTurn {
  text-align: center;
  font-weight: 900;
  font-size: 32px;
}
.actionsToPlay {

}
.actionsToPlay.action {

}

.floating-left-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.4);
}
.families {
  display: flex;
}
.family {
  min-width: 200px;
}
</style>