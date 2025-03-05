<script setup lang="ts">
import DeckCard from "@/components/cards/DeckCard.vue";
import {provide, ref} from "vue";

const props = defineProps<{
  cards: object,
  showBackFace: boolean|null,
  reversed: boolean|null,
}>()

const offset = ref(props.reversed ? -30 : 30)
const hovered = ref(false)
function onMouseEnter() {
	offset.value += props.reversed ? -20 : 20
	hovered.value = true
}
function onMouseLeave() {
	offset.value -= props.reversed ? -20 : 20
	hovered.value = false
}
</script>

<template>

  <div class="deck-container position-relative d-flex flex-column"
       :class="[
           reversed && 'align-self-end'
       ]"
       :style="{
	    zIndex: hovered ? 10000000000 : 0,
       }"

    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <DeckCard
        v-for="[i, card] of cards.entries()"
        :key="card.id"
        :card="card"
        :index="i"
        :showBackFace="showBackFace"
        :offset="offset"
        :style="{
		    zIndex: hovered ? 10000000000 : 0,
	       }"
    />
  </div>

</template>

<style scoped>
.deck-container:hover {
  z-index: 1;
}
</style>