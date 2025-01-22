<script setup lang="ts">
  import Card from "@/components/cards/Card.vue";
  import Action from "@/components/actions/Action.vue";
  import Chat from "@/components/Chat.vue";

  import {useSocketStore} from "@/stores/socket.ts";
  import {useGameStore} from "@/stores/game.ts";
  import Deck from "@/components/cards/Deck.vue";

  const socketStore = useSocketStore()
  const gameStore = useGameStore()
</script>

<template>

  <div class="own-player-container">

    <div class="floating-left-bottom">
      <pre>{{gameStore.holdenCard}}</pre>
      <pre>{{gameStore.holdenCardAction}}</pre>
    </div>

    <Chat/>

    <div class="own-player">
      <Action action="keep">
      <div class="families scaled">
        <div
            class="family"
            v-for="family of socketStore?.game?.infos?.FAMILIES"
            :style="{backgroundColor: family.color}"
        >
          <Deck v-if="family.id !== 'assassin'" :cards="socketStore?.currentPlayer?.cards.filter(card => card.family.id === family.id && card.power !== 'hidden')"/>
          <Deck v-else :cards="socketStore?.currentPlayer?.cards.filter(card => card.power === 'hidden')"/>
        </div>
      </div>

      </Action>

    </div>

    <div class="deck">
      <div class="row">
        <p class="isYourTurn" v-if="socketStore.isYourTurn">À vous de jouer !</p>
        <div class="actionsToPlay d-flex mb-5">
          <div class="action" v-if="socketStore.game.userActionsToPlay" v-for="action of socketStore.game.userActionsToPlay">{{action}}</div>
        </div>
      </div>
      <div class="row">
        <div v-for="card in socketStore?.currentPlayer?.handCards ?? []" :key="card.id"
             class="col d-flex justify-content-center">
          <Card :card="card" :movable="true" :is-player-deck="true"/>
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
  height: 100%;
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
  bottom: 200px;
  left: 200px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 5px;
}
.families {
  display: flex;
}
.family {
  min-width: 200px;
}
</style>