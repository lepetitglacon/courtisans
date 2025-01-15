<script setup lang="ts">
import Card from "@/components/cards/Card.vue";

const props = defineProps([
    'cards',
    'vertical'
])
</script>

<template>

  <div class="deck-container">
    <Card v-for="card of cards" :card="card"/>
  </div>

</template>

<style scoped>
.deck-container {
  display: flex;
  flex-direction: column;
}
.deck-container.card-container {

}
</style>