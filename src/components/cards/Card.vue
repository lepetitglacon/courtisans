<script setup lang="ts">
import sound_hover_1 from '../../assets/sounds/cards_handle/hover_1.wav'
import sound_hover_2 from '../../assets/sounds/cards_handle/hover_2.wav'

import {useSocketStore} from "@/stores/socket.ts";
import {inject, onMounted, ref} from "vue";
import {useGameStore} from "@/stores/game.ts";
import {useChatStore} from "@/stores/chat.ts";
import Action from "@/components/actions/Action.vue";

const socketStore = useSocketStore()
const gameStore = useGameStore()
const chatStore = useChatStore()

const sound1 = new Audio(sound_hover_1)
const sound2 = new Audio(sound_hover_2)
const sounds = [sound1, sound2]

const props = defineProps([
    'card',
    'action',
    'movable',
    'size',
    'offset',
    'isPlayerDeck',
    'showBackFace'
])

const deck = inject('deck')
const socket = inject('socket')

const cardContainerRef = ref<HTMLDivElement>()
const cardRef = ref<HTMLDivElement>()
const cardCenterRef = ref<HTMLDivElement>()
const dragging = ref(false)
const hovering = ref(false)
const hidden = ref(false)
const closestSnap = ref(null)
const lastSnap = ref(null)
const tilt = ref(20)
const fakeCardsInDeck = ref<Array<Array<object>>>([])
let resetRotationTimeOut = null
let initialBBox = null
const rotation = ref(0);


function contains(x, y, rect) {
  return rect.x <= x && x <= rect.x + rect.width &&
      rect.y <= y && y <= rect.y + rect.height;
}

onMounted(() => {
  document.addEventListener("mousemove", onMouseMove)
  document.addEventListener("mouseup", onMouseUp)
})
const lerp = (x, y, a) => x * (1 - a) + y * a;
function onMouseDown(e) {
  if (!isMovable()) { return }
  if (e.button !== 0) { return }

  initialBBox = cardContainerRef.value.getBoundingClientRect();

  gameStore.holdenCard = props.card
  cardContainerRef.value.style.zIndex = 1;
  chatStore.postMessage(`[debug] ${props.card.id} taken`)

  socketStore.on('server/validationResult', onValidationResult)

  dragging.value = true
}
function onValidationResult(e) {
  console.log(e)
  if (!e.valid) {

  }
  resetCard()
  socketStore.off('server/validationResult', onValidationResult)
}
const onMouseMove = (event) => {
  updateRotation(event)
  move(event)
  snap(event)
};
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

  for (const actionObject of gameStore.actionDivs) {
    if (!actionObject.ref) { continue }

    const snapRect = actionObject.ref.getBoundingClientRect();
    if (contains(event.clientX, event.clientY, snapRect) && actionObject.active) {

      if (actionObject.action === 'kill') {
        if (props.card.power === 'rogue' && props.card.id !== actionObject.data.otherCardId) {
            closestSnap.value = actionObject;
            action = actionObject.data.killAction
        }
        continue
      }

      closestSnap.value = actionObject;
      action = actionObject.action;
    }
  }

  if (closestSnap.value) {
    gameStore.holdenCardAction = action

    // ajouter les cartes aux fakeDeck
    if (closestSnap.value.data?.familyId) {
      const type = closestSnap.value.action === 'shadow' ? 'shadowed' : 'enlighten'
      const familyDeck = socketStore.game.familyCards[closestSnap.value.data.familyId][type]
      if (!familyDeck.includes(props.card)) {
        familyDeck.push(props.card)
        fakeCardsInDeck.value.push(familyDeck)
        hidden.value = true
      }
    }

    if (closestSnap.value !== lastSnap.value) {
      for (const fakeCardInDeck of fakeCardsInDeck.value) {
        fakeCardInDeck.remove(props.card)
      }
      hidden.value = false
    }

    const snapRect = closestSnap.value.ref.getBoundingClientRect();
    cardContainerRef.value.style.left = `${(snapRect.left - snapRect.width/2) - (cardContainerRef.value.offsetParent.offsetLeft - snapRect.width/2)}px`;
    cardContainerRef.value.style.top = `${(snapRect.top - snapRect.height/2) - cardContainerRef.value.offsetParent.offsetTop}px`;


  } else {
    for (const fakeCardsInDeckElement of fakeCardsInDeck.value) {
      fakeCardsInDeckElement.remove(props.card)
    }
    hidden.value = false
    closestSnap.value = null
    gameStore.holdenCardAction = null
  }
  lastSnap.value = closestSnap.value
}
function updateRotation(event) {
  if (!hovering.value) {
    return
  }
  if (cardContainerRef.value) {
    const rect = cardContainerRef.value.getBoundingClientRect();
    const x = event.clientX - rect.left; // Mouse X relative to container
    const y = event.clientY - rect.top; // Mouse Y relative to container
    const centerX = rect.width / 2; // Center of container (X)
    const centerY = rect.height / 2; // Center of container (Y)
    const rotateX = ((y - centerY) / centerY) * -tilt.value; // Tilt based on Y-axis
    const rotateY = ((x - centerX) / centerX) * tilt.value; // Tilt based on X-axis
    cardRef.value.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }
}
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
    resetCard()
  }

  cardContainerRef.value.style.zIndex = 0;
  gameStore.holdenCard = null
  gameStore.holdenCardAction = null
  gameStore.holdenCardData = null
  chatStore.postMessage(`[debug] ${props.card.id} dropped`)

  dragging.value = false
};

function resetCard() {
  if (cardRef.value && cardContainerRef.value) {
    cardRef.value.style.transition = "transform 5s ease";
    cardRef.value.style.transform = "rotateX(0deg) rotateY(0deg)";

    cardContainerRef.value.style.left = `${initialBBox.left}px`;
    cardContainerRef.value.style.top = `${initialBBox.top}px`;

    for (const fakeCardInDeck of fakeCardsInDeck.value) {
      fakeCardInDeck.remove(props.card)
    }
    hidden.value = false

    setTimeout(() => {
      if (cardRef.value) {
        // cardRef.value.style.transition = "none"; // Remove transition after reset
      }
    }, 300);
  }
}

function onMouseEnter(e) {
  hovering.value = true
  if (isMovable()) {
    sounds[Math.floor(Math.random()*sounds.length)].play()
    clearTimeout(resetRotationTimeOut)
  }
}
function onMouseLeave(e) {
  hovering.value = false
  // cardRef.value.style.transition = "transform 1s ease";
  cardRef.value.style.transform = "rotateX(0deg) rotateY(0deg)";
  resetRotationTimeOut = setTimeout(() => {
    if (cardRef.value) {
      // cardRef.value.style.transition = "none"; // Remove transition after reset
    }
  }, 1000);
}

function updateRotationn() {
  rotation.value = Math.sin(gameStore.animationFrames / 60 + (props?.index ?? 0) * 2)
}
gameStore.useAnimation(() => {
  updateRotationn()
  if (cardContainerRef.value) {
    cardContainerRef.value.style.transform = `rotate(${rotation.value}deg)`;

  }
})

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

function isMovable() {
  return props.movable && socketStore.isYourTurn
}
</script>

<template>
<div
    ref="cardContainerRef"
	  class="card-container"
    :class="[
        isMovable() && 'movable',
        dragging && 'moving',
        hidden && 'hidden',
        showBackFace ? 'showBackFace' : 'showFrontFace'
    ]"
    :style="{
      color: 'white',
    }"
    @click="onCardClick"
    @mousedown="onMouseDown"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
>
  <div
      ref="cardRef"
       class="card"
      :class="[
        isMovable() && (hovering || dragging) && 'hovering',
      ]"
  >
    <Action v-if="!isMovable() && action" :action="action"></Action>
    <div class="">
      <div v-if="gameStore.debug" class="">
        <p class="card-title">{{ card.family.title }}</p>
        <p>drag : {{ dragging }}</p>
        <p>hover : {{ hovering }}</p>
        <p>{{ card.power }}</p>
        <p>{{ card.id }}</p>
      </div>
      <img
          class="img"
          :src="`/cards/${getImgSrc()}.png`"
      >
    </div>
  </div>
</div>
</template>

<style scoped>
.card-container {
  perspective: 1000px;
  width: 4.5cm;
  height: 8cm;

}
.card {
  position: absolute;
  width: 100%;
  height: 100%;

  pointer-events: none;

  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  transform-style: preserve-3d;
  transition: transform 0.1s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
.showFrontFace {
  margin-bottom: -7cm;
}
.showBackFace {
  padding: 0;
  margin-top: -8.5cm;
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
.moving {
  position: absolute;
}
.hovering {
  box-shadow: 0px 0px 10px 10px rgba(239, 228, 2, 0.5);
}
.hidden {
  opacity: 0;
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