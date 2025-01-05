<script setup lang="ts">
  import Card from "@/components/Card.vue";
  import {useConnectionStore} from "@/stores/socket.ts";
  const gameStore = useConnectionStore()
</script>

<template>

  <div class="deck">
    <p>Deck</p>
    <Card v-for="card in gameStore?.currentPlayer?.cards ?? []" :card="card"/>
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
</style>