<script setup lang="ts">
  import Card from "@/components/Card.vue";
  import {useConnectionStore} from "@/stores/socket.ts";
  import Action from "@/components/actions/Action.vue";
  const gameStore = useConnectionStore()
</script>

<template>

  <div class="own-player">
    <Action action="keep" />
    <Card v-for="card in gameStore?.currentPlayer?.cards ?? []" :card="card"/>
  </div>

  <div class="deck">
    <Card v-for="card in gameStore?.currentPlayer?.handCards ?? []" :card="card"/>
  </div>

</template>

<style scoped>
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