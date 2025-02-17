<script setup lang="ts">
import DeckCard from "@/components/cards/DeckCard.vue";
import {provide, ref} from "vue";

const props = defineProps<{
  cards: object,
  showBackFace: boolean|null,
}>()

const offset = ref(30)

</script>

<template>

  <div class="deck-container position-relative d-flex flex-column"

    @mouseenter="offset += 20"
    @mouseleave="offset -= 20"
  >
    <DeckCard
        v-for="[i, card] of cards.entries()"
        :key="card.id"
        :card="card"
        :index="i"
        :showBackFace="showBackFace"
        :offset="offset"
    />
  </div>

</template>

<style scoped>
.deck-container:hover {
  z-index: 1;
}
</style>