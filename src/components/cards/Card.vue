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
const dragging = ref(false)
const closestSnap = ref(null)

function onCardClick(e) {}

function contains(x, y, rect) {
  return rect.x <= x && x <= rect.x + rect.width &&
      rect.y <= y && y <= rect.y + rect.height;
}

let offsetX = 0, offsetY = 0;
let initialBBox = null

function onMouseDown(e) {
  if (!props.movable) { return }
  if (e.button !== 0) { return }

  offsetX = e.offsetX;
  offsetY = e.offsetY;
  initialBBox = cardContainerRef.value.getBoundingClientRect();
  gameStore.holdenCard = props.card
  cardContainerRef.value.style.zIndex = 1;
  chatStore.postMessage(`[debug] ${props.card.id} taken`)
  dragging.value = true
}

onMounted(() => {
  document.addEventListener("mousemove", onMouseMove)
  document.addEventListener("mouseup", onMouseUp)
})
const onMouseMove = (event) => {
  if (!dragging.value) { return }

  cardContainerRef.value.style.left = `${event.clientX - offsetX}px`;
  cardContainerRef.value.style.top = `${event.clientY - offsetY}px`;

  // Snap to nearest point
  let minDistance = Infinity;
  let action = null;
  closestSnap.value = null

  for (const actionDiv of gameStore.actionDivs) {
    if (!actionDiv.ref) { continue }

    const snapRect = actionDiv.ref.getBoundingClientRect();
    const cardRect = cardContainerRef.value.getBoundingClientRect();

    if (contains(event.clientX, event.clientY, snapRect)) {
      closestSnap.value = actionDiv;
      action = actionDiv.action;
    }

    // // depuis la carte
    // // const dx = snapRect.left - (cardRect.left + cardRect.width/2);
    // // const dy = snapRect.top - (cardRect.top + cardRect.height/2);
    // // depuis la souris
    // const dx = snapRect.left - event.clientX;
    // const dy = snapRect.top - event.clientY;
    // const distance = Math.sqrt(dx * dx + dy * dy);

    // if (distance < minDistance) {
    //   minDistance = distance;
    //   closestSnap.value = actionDiv;
    //   action = actionDiv.action;
    // }
  }

  if (closestSnap.value) { // Adjust threshold as needed
    console.log('indistance')
    gameStore.holdenCardAction = action
    gameStore.holdenCardActionData = null

    const snapRect = closestSnap.value.ref.getBoundingClientRect();
    cardContainerRef.value.style.left = `${snapRect.left - cardContainerRef.value.offsetParent.offsetLeft}px`;
    cardContainerRef.value.style.top = `${snapRect.top - cardContainerRef.value.offsetParent.offsetTop}px`;
  } else {
    console.log('faraway')
    closestSnap.value = null
    gameStore.holdenCardAction = null
    gameStore.holdenCardActionData = null
  }
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
  } else {
    cardContainerRef.value.style.left = `${initialBBox.left}px`;
    cardContainerRef.value.style.top = `${initialBBox.top}px`;
  }

  cardContainerRef.value.style.zIndex = 0;
  gameStore.holdenCard = null
  gameStore.holdenCardAction = null
  gameStore.holdenCardData = null
  chatStore.postMessage(`[debug] ${props.card.id} dropped`)

  dragging.value = false
};
</script>

<template>
<div
    ref="cardContainerRef"
	  class="card-container card"
    :class="movable && 'movable'"
    :style="{
      backgroundColor: card.family.color,
      color: 'white',
      height: size ?? 8 + 'cm'
    }"
    @click="onCardClick"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
>
  <div
      @mousedown.prevent=""
      @mouseup.prevent=""
  >
    <div class="card-info">
      <p class="card-title">{{ card.family.title }}</p>
      <p>{{ card.power }}</p>
      <p>{{ card.id }}</p>
    </div>
    <img
        class="img"
        :src="`/cards/${card.family.id}.png`"
    >
  </div>
</div>
</template>

<style scoped>

.card {
  position: absolute;

  background: #ff7b7b;
  border: 5px solid #d9534f;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  transform-style: preserve-3d;
  transition: transform 0.2s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

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
</style>