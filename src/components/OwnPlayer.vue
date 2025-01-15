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

      <div class="families">
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
      <p v-if="socketStore.isYourTurn">Votre tour</p>
      <p v-if="socketStore.game.userActionsToPlay">{{socketStore.game.userActionsToPlay}}</p>
      <pre>{{socketStore?.currentPlayer?.handCards}}</pre>
      <Card v-for="card in socketStore?.currentPlayer?.handCards ?? []" :card="card" :movable="true"/>
    </div>
  </div>


</template>

<style scoped>
.own-player-container {
  display: flex;
}
.deck {
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
}
.own-player {
  width: 100%;
  height: 25vh;
  background-color: rgba(40, 40, 40, 0.06);
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