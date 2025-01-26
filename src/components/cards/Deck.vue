<script setup lang="ts">
import NewCard from "@/components/cards/DeckCard.vue";

const props = defineProps([
    'cards',
    'vertical',
    'showBackFace'
])
</script>

<template>

  <div class="deck-container position-relative d-flex flex-column">
    <NewCard v-for="[i, card] of cards.entries()" :card="card" :index="i" :showBackFace="showBackFace"/>
  </div>

</template>

<style scoped>
.deck-container {

}
</style>