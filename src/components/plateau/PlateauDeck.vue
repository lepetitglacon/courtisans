<script setup lang="ts">
import {ref} from "vue";
import useColor from "@/composables/useColor.ts";
import {useSocketStore} from "@/stores/socket.ts";
import {useGameStore} from "@/stores/game.ts";
import Deck from "@/components/cards/Deck.vue";

const socketStore = useSocketStore()
const gameStore = useGameStore()

const props = defineProps<{
  cards: Array<any>
  action: string
}>()

const actionRef = ref<HTMLDivElement|null>(null)
const hovered = ref(false)
const active = ref(true)

gameStore.registerActionDiv(
    props.action,
    actionRef,
    {
    },
    hovered,
    active
)
</script>

<template>
  <div ref="actionRef" :style="{backgroundColor: useColor()}"
    :class="[
        hovered && 'hovered'
    ]"
  >
    <Deck :cards="cards"/>
  </div>
</template>

<style scoped>

</style>