<script setup lang="ts">
  import Card from "@/components/Card.vue";
  import Action from "@/components/actions/Action.vue";
  import Chat from "@/components/Chat.vue";

  import {useConnectionStore} from "@/stores/socket.ts";
  import {useGameStore} from "@/stores/game.ts";

  const socketStore = useConnectionStore()
  const gameStore = useGameStore()
</script>

<template>

  <div class="own-player-container">
    <Chat/>

    <pre>{{gameStore.holdenCard}}</pre>
    <pre>{{gameStore.holdenCardAction}}</pre>

    <div class="own-player">
      <Action action="keep" />
      <Card v-for="card in socketStore?.currentPlayer?.cards ?? []" :card="card"/>
    </div>

    <div class="deck">
      <Card v-for="card in socketStore?.currentPlayer?.handCards ?? []" :card="card"/>
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
.deck .card-container {
  margin-right: 5px;
  margin-top: 5px;
}
.own-player {
  width: 100%;
  height: 25vh;
  background-color: rgba(40, 40, 40, 0.06);
}
</style>