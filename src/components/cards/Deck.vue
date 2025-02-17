<script setup lang="ts">
import DeckCard from "@/components/cards/DeckCard.vue";
import {provide} from "vue";

const props = defineProps<{
  cards: object,
  showBackFace: boolean|null,
}>()

console.log(props.cards)

</script>

<template>

  <div class="deck-container position-relative d-flex flex-column">
    <DeckCard
        v-for="[i, card] of cards.entries()"
        :key="card.id"
        :card="card"
        :index="i"
        :showBackFace="showBackFace"
    />
  </div>

</template>

<style scoped>
.deck-container {
}
</style>