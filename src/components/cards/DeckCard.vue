<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import Action from "@/components/actions/Action.vue";
import {useGameStore} from "@/stores/game.ts";

const gameStore = useGameStore()

const props = defineProps([
  'card',
  'index',
  'action',
  'movable',
  'size',
  'offset',
  'isPlayerDeck',
  'showBackFace'
])

const cardContainerRef = ref<HTMLDivElement|null>(null);
const cardRef = ref(null);
const rotation = ref(0);
const dragging = ref(false);
const hovered = ref(false);

function getImgSrc() {
  if (props.showBackFace) {
    return 'assassin'
  }
  if (props.card.power !== 'hidden' || props.isPlayerDeck) {
    return `${props.card.family.id}/${props.card.power}`
  } else {
    return 'assassin'
  }
}

function updateRotation() {
  rotation.value = Math.sin(gameStore.animationFrames / 60 + (props?.index ?? 0) * 2)
}

gameStore.useAnimation(() => {
  updateRotation()
  if (cardContainerRef.value) {
    cardContainerRef.value.style.transform = `rotate(${rotation.value}deg)`;

  }
})

function getStyle() {
  return {
    top: 20 * props.index + 'px'
  }
}

function onMouseDown(e) {
  dragging.value = true
}
function onMouseMove(e) {
  dragging.value = true
}
function onMouseUp(e) {
  dragging.value = false
}
function onMouseEnter(e) {
  hovered.value = true
}
function onMouseLeave(e) {
  hovered.value = false
}
</script>

<template>
  <div
      class="card-container position-absolute"
      :class="[
          dragging && 'dragging',
          hovered && 'hovered'
      ]"
      :style="getStyle()"
      ref="cardContainerRef"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"

      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
  >
    <Action action="kill" :data="{
      familyId: props.card.family.id,
      otherCardId: props.card.id,
    }">
    <img
        class="img"
        :src="`/cards/${getImgSrc()}.png`"
    >
    </Action>
  </div>
</template>

<style scoped>
.card-container {
  min-width: 100px;
}
.img {
  width: 100%;
}
.dragging {
}

.card-container .hovered not .action {
  box-shadow: 0px 0px 10px 10px rgba(237, 218, 18, 0.68);
}

</style>