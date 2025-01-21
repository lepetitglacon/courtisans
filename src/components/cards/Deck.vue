<script setup lang="ts">
import Card from "@/components/cards/Card.vue";

const props = defineProps([
    'cards',
    'vertical',
    'showBackFace'
])
</script>

<template>

  <div class="deck-container">
    <Card v-for="card of cards" :card="card" :showBackFace="showBackFace"/>
  </div>

</template>

<style scoped>
.deck-container {
  display: flex;
  flex-direction: column;
}
</style>