<script setup lang="ts">
import {useConnectionStore} from "@/stores/socket.ts";
import {onMounted, ref} from "vue";
import {useGameStore} from "@/stores/game.ts";
import {useChatStore} from "@/stores/chat.ts";
import {socket} from "@/socket.ts";

const socketStore = useConnectionStore()
const gameStore = useGameStore()
const chatStore = useChatStore()

const props = defineProps([
    'card',
    'movable',
    'size'
])

const cardContainerRef = ref<HTMLDivElement>()
const cardRef = ref<HTMLDivElement>()
const cardCenterRef = ref<HTMLDivElement>()
const dragging = ref(false)
const hovering = ref(false)
const closestSnap = ref(null)

function onCardClick(e) {}

function contains(x, y, rect) {
  return rect.x <= x && x <= rect.x + rect.width &&
      rect.y <= y && y <= rect.y + rect.height;
}


let initialBBox = null

onMounted(() => {
  document.addEventListener("mousemove", onMouseMove)
  document.addEventListener("mouseup", onMouseUp)
})
function onMouseDown(e) {
  if (!props.movable) { return }
  if (e.button !== 0) { return }
  let offsetX = 0, offsetY = 0;

  offsetX = e.offsetX;
  offsetY = e.offsetY;
  initialBBox = cardContainerRef.value.getBoundingClientRect();
  gameStore.holdenCard = props.card
  cardContainerRef.value.style.zIndex = 1;
  chatStore.postMessage(`[debug] ${props.card.id} taken`)
  dragging.value = true
}
function move(event) {
  if (!dragging.value) { return }

  const cardRect = cardContainerRef.value.getBoundingClientRect();
  cardContainerRef.value.style.left = `${event.clientX - cardRect.width / 2}px`;
  cardContainerRef.value.style.top = `${event.clientY - cardRect.height / 2}px`;
}
function snap(event) {
  if (!dragging.value) { return }

  let action = null;
  closestSnap.value = null

  for (const actionDiv of gameStore.actionDivs) {
    if (!actionDiv.ref) { continue }

    const snapRect = actionDiv.ref.getBoundingClientRect();
    if (contains(event.clientX, event.clientY, snapRect)) {
      closestSnap.value = actionDiv;
      action = actionDiv.action;
    }
  }

  if (closestSnap.value) { // Adjust threshold as needed
    gameStore.holdenCardAction = action
    gameStore.holdenCardActionData = null

    const snapRect = closestSnap.value.ref.getBoundingClientRect();
    cardContainerRef.value.style.left = `${snapRect.left - cardContainerRef.value.offsetParent.offsetLeft}px`;
    cardContainerRef.value.style.top = `${snapRect.top - cardContainerRef.value.offsetParent.offsetTop}px`;
  } else {
    closestSnap.value = null
    gameStore.holdenCardAction = null
    gameStore.holdenCardActionData = null
  }
}
function updateRotation(event) {
  if (!hovering.value) { return }
  const rect = cardContainerRef.value.getBoundingClientRect();
  const x = event.clientX - rect.left; // Mouse X relative to container
  const y = event.clientY - rect.top; // Mouse Y relative to container
  const centerX = rect.width / 2; // Center of container (X)
  const centerY = rect.height / 2; // Center of container (Y)
  const rotateX = ((y - centerY) / centerY) * -10; // Tilt based on Y-axis
  const rotateY = ((x - centerX) / centerX) * 10; // Tilt based on X-axis
  cardRef.value.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}
const onMouseMove = (event) => {
  updateRotation(event)
  move(event)
  snap(event)
};

const onMouseUp = () => {
  if (!dragging.value) { return }

  if (gameStore.holdenCardAction) {
    socketStore.emit('client/play', {
      action: gameStore.holdenCardAction,
      cardId: gameStore.holdenCard?.id,
      userId: socket?.id,
      ...closestSnap.value?.data ?? {}
    })
    cardContainerRef.value.style.transform = `rotateX(0) rotateY(0)`;
  } else {
    cardContainerRef.value.style.left = `${initialBBox.left}px`;
    cardContainerRef.value.style.top = `${initialBBox.top}px`;
    cardContainerRef.value.style.transform = `rotateX(0) rotateY(0)`;
  }

  cardContainerRef.value.style.zIndex = 0;
  gameStore.holdenCard = null
  gameStore.holdenCardAction = null
  gameStore.holdenCardData = null
  chatStore.postMessage(`[debug] ${props.card.id} dropped`)

  dragging.value = false
};
function onMouseLeave(e) {
  hovering.value = false
  cardRef.value.style.transition = "transform 0.3s ease";
  cardRef.value.style.transform = "rotateX(0deg) rotateY(0deg)";

  setTimeout(() => {
    cardRef.value.style.transition = "none"; // Remove transition after reset
  }, 300);
}
</script>

<template>
<div
    ref="cardContainerRef"
	  class="card-container"
    :class="movable && 'movable'"
    :style="{
      backgroundColor: card.family.color,
      color: 'white',
    }"
    @click="onCardClick"
    @mousedown="onMouseDown"
    @mouseenter="hovering = true"
    @mouseleave="onMouseLeave"
    @mouseup="onMouseUp"
>
  <div
      ref="cardRef"
       class="card"
      @mousedown.prevent=""
      @mouseup.prevent=""
  >
    <div class="">
      <div class="card-info">
        <p class="card-title">{{ card.family.title }}</p>
        <p>{{ card.power }}</p>
        <p>{{ card.id }}</p>
      </div>
      <div ref="cardCenterRef" class="center"></div>
      <img
          class="img"
          :src="`/cards/${card.family.id}.png`"
      >
    </div>
  </div>
</div>
</template>

<style scoped>
.card-container {
  position: absolute;
  perspective: 1000px;
  width: 4.5cm;
  height: 8cm;
  margin: 100px auto;
}
.card {
  position: absolute;
  width: 100%;
  height: 100%;

  border: 5px solid #dc2823;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  transform-style: preserve-3d;
  transition: transform 0.1s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.movable {
  cursor: grab;
  user-select: none;
}

.card .movable:active {
  cursor: grabbing;
}

.card-info {
  position: absolute;
  top: 0;
}

.card-title {
  font-weight: 900;
}

.img {
  height: 8.5cm;
}

.center {
 position: absolute;
  width: 10px;
  height: 10px;
  background-color: red;
}
</style>