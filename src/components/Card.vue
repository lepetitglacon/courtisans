<script setup lang="ts">
import {useConnectionStore} from "@/stores/socket.ts";
import {ref} from "vue";
import {useGameStore} from "@/stores/game.ts";
import {useChatStore} from "@/stores/chat.ts";
import {socket} from "@/socket.ts";

const socketStore = useConnectionStore()
const gameStore = useGameStore()
const chatStore = useChatStore()

const props = defineProps([
    'card'
])

const cardContainerRef = ref()

function onCardClick(e) {
  // gameStore.emit('client/play', {
  //   action: 'card',
  //   id: props.card.id
  // })
}
let offsetX = 0, offsetY = 0;

function onMouseDown(e) {
  offsetX = e.offsetX;
  offsetY = e.offsetY;
  gameStore.holdenCard = props.card
  chatStore.postMessage(`[debug] ${props.card.id} taken`)

  const moveCard = (event) => {
    cardContainerRef.value.style.left = `${event.clientX - offsetX}px`;
    cardContainerRef.value.style.top = `${event.clientY - offsetY}px`;

    // Snap to nearest point
    let closestSnap = null;
    let minDistance = Infinity;
    let action = null;

    for (const actionDiv of gameStore.actionDivs) {
      if (!actionDiv.ref) {
        continue
      }
        const snapRect = actionDiv.ref.getBoundingClientRect();
        const cardRect = cardContainerRef.value.getBoundingClientRect();
        const dx = snapRect.left - cardRect.left;
        const dy = snapRect.top - cardRect.top;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          minDistance = distance;
          closestSnap = actionDiv.ref;
          action = actionDiv.action;
        }
    }

    if (minDistance < 50) { // Adjust threshold as needed
      gameStore.holdenCardAction = action

      const snapRect = closestSnap.getBoundingClientRect();
      cardContainerRef.value.style.left = `${snapRect.left - cardContainerRef.value.offsetParent.offsetLeft}px`;
      cardContainerRef.value.style.top = `${snapRect.top - cardContainerRef.value.offsetParent.offsetTop}px`;
    } else {
      gameStore.holdenCardAction = null
    }

  };

  const stopDragging = () => {
    document.removeEventListener('mousemove', moveCard);
    document.removeEventListener('mouseup', stopDragging);

    // Snap to nearest point
    let closestSnap = null;
    let minDistance = Infinity;

    // If close enough, snap to the point
    if (minDistance < 50) { // Adjust threshold as needed
      const snapRect = closestSnap.getBoundingClientRect();
      cardContainerRef.value.style.left = `${snapRect.left - cardContainerRef.value.offsetParent.offsetLeft}px`;
      cardContainerRef.value.style.top = `${snapRect.top - cardContainerRef.value.offsetParent.offsetTop}px`;
    }

    socketStore.emit('client/play', {
      action: gameStore.holdenCardAction,
      cardId: gameStore.holdenCard?.id,
      userId: socket?.id,
      toUserId: props?.data?.toUserId ?? null,
      ...props?.data ?? {}
    })

    gameStore.holdenCard = null
    gameStore.holdenCardAction = null
    gameStore.holdenCardData = null
    chatStore.postMessage(`[debug] ${props.card.id} dropped`)
  };

  document.addEventListener('mousemove', moveCard);
  document.addEventListener('mouseup', stopDragging);
}
function handleDragStart(e) {
  e.dataTransfer.setData('application/json', JSON.stringify(props.card))
}
</script>

<template>
<div
    ref="cardContainerRef"
	  class="card-container card"
    :style="{
      backgroundColor: card.family.color,
      color: 'white'
    }"
	@click="onCardClick"
	@mousedown="onMouseDown"
>
  <div class="card-inner" >
    <p class="card-title">{{ card.family.title }}</p>
    <p>{{ card.power }}</p>
    <p>{{ card.id }}</p>
  </div>
</div>
</template>

<style scoped>

.card {
  position: absolute;
  width: 100px;
  height: 140px;
  background: #ff7b7b;
  border: 2px solid #d9534f;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  user-select: none;
}

.card:active {
  cursor: grabbing;
}



.card-container {
  width: 4.5cm;
  height: 8cm;
  background-color: #282828;
  border-radius: 5px;

  display: flex;
}
.card-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin: 5px;
  border-radius: 3px;
  background-color: rgba(0,0,0,30%);
  width: 100%;
}
.card-title {
  font-weight: 900;
}
</style>