<script setup lang="ts">
import sound_hover_1 from '../../../assets/sounds/cards_handle/hover_1.wav'
import sound_hover_2 from '../../../assets/sounds/cards_handle/hover_2.wav'

import {useSocketStore} from "@/stores/socket.ts";
import {inject, onMounted, ref} from "vue";
import {useGameStore} from "@/stores/game.ts";
import {useChatStore} from "@/stores/chat.ts";
import Action from "@/components/game/actions/Action.vue";
import {useSoundStore} from "@/stores/sound.ts";

const socketStore = useSocketStore()
const gameStore = useGameStore()
const chatStore = useChatStore()
const soundStore = useSoundStore()

const sound1 = new Audio(sound_hover_1)
sound1.volume = 0.2
const sound2 = new Audio(sound_hover_2)
sound2.volume = 0.2
const sounds = [sound1]

const props = defineProps([
    'card',
    'action',
    'movable',
    'size',
    'offset',
    'isPlayerDeck',
    'showBackFace',
    'index'
])

const deck = inject('deck')
const socket = inject('socket')
const absoluteContainerRef = inject('absoluteContainerRef')

const cardContainerRef = ref<HTMLDivElement>()
const cardRef = ref<HTMLDivElement>()
const cardCenterRef = ref<HTMLDivElement>()
const dragging = ref(false)
const hovering = ref(false)
const hidden = ref(false)
const closestSnap = ref<|null>(null)
const lastSnap = ref(null)
const tilt = ref(20)
const fakeCardsInDeck = ref<Array<Array<object>>>([])
let resetRotationTimeOut = null
let initialBBox = null
const rotation = ref(0);
const transitions = ref({
	transform: 'transform 0.1s ease-out',
	opacity: 'opacity 0.1s ease-out',
})
const transform = ref({
  translateX: 0,
  translateY: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
})

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
  cardContainerRef.value.style.zIndex = 99;

  socketStore.on('server/validationResult', onValidationResult)

  dragging.value = true
}
function onValidationResult(e) {
  if (e.valid) {
    soundStore.sounds.get('play')?.play()
  } else {

  }
  resetCard()
  socketStore.off('server/validationResult', onValidationResult)
}
const onMouseMove = (event) => {
  followUserMouseRotation(event)
  move(event)
  snap(event)
};
const lastMousePosition = {
  x: 0,
  y: 0
}
function move(event: MouseEvent) {
  if (!dragging.value) { return }

  const rect = absoluteContainerRef.value.getBoundingClientRect();
  transform.value.translateX = event.clientX + (rect.left - rect.width / 2) + (props.index === 0 ? 150 : props.index === 2 ? -150 : 0)
  transform.value.translateY = event.clientY - (rect.top + rect.height / 2)

  // cardContainerRef.value.style.transformOrigin = `${event.clientX}px ${event.clientY}px`
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
    } else {
      actionObject.hovered = false
    }
	  actionObject.hovered = false
  }

  if (closestSnap.value) {
	  cardContainerRef.value.style.opacity = 0.5
    gameStore.holdenCardAction = action
    closestSnap.value.hovered = true
  } else {
	  cardContainerRef.value.style.opacity = 1
    for (const fakeCardsInDeckElement of fakeCardsInDeck.value) {
      fakeCardsInDeckElement.remove(props.card)
    }
    hidden.value = false
    closestSnap.value = null
    gameStore.holdenCardAction = null
  }
  lastSnap.value = closestSnap.value
}
function followUserMouseRotation(event) {
  if (!hovering.value) {
    return
  }
  if (cardContainerRef.value) {
    const rect = cardContainerRef.value.getBoundingClientRect();
    const x = event.clientX - rect.left; // Mouse X relative to container
    const y = event.clientY - rect.top; // Mouse Y relative to container
    const centerX = rect.width / 2; // Center of container (X)
    const centerY = rect.height / 2; // Center of container (Y)
    const rotateX = ((y - centerY) / centerY) * -tilt.value + 5; // Tilt based on Y-axis
    const rotateY = ((x - centerX) / centerX) * tilt.value; // Tilt based on X-axis
    // cardRef.value.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    transform.value.rotateX = rotateX
    transform.value.rotateY = rotateY
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
    transform.value.rotateX = 0
    transform.value.rotateY = 0
  } else {
    resetCard()
  }

  cardContainerRef.value.style.zIndex = 0;
  gameStore.holdenCard = null
  gameStore.holdenCardAction = null
  gameStore.holdenCardData = null

  dragging.value = false
};

function resetCard() {
  if (cardRef.value && cardContainerRef.value) {
    transitions.value.transform = "transform 0.1s ease-out";
    transform.value.rotateX = 0
    transform.value.rotateY = 0
    transform.value.translateX = 0
    transform.value.translateY = 0

	  cardContainerRef.value.style.zIndex = 0;
	  cardContainerRef.value.style.opacity = 1;

    for (const fakeCardInDeck of fakeCardsInDeck.value) {
      fakeCardInDeck.remove(props.card)
    }

    for (const actionObject of gameStore.actionDivs) {
      actionObject.hovered = false
    }

    hidden.value = false
  }
}

function onMouseEnter(e) {
  hovering.value = true
  if (isMovable() && dragging.value === false) {
    sounds[Math.floor(Math.random() * sounds.length)].play()
    clearTimeout(resetRotationTimeOut)
  }
}
function onMouseLeave(e) {
  hovering.value = false
  transform.value.rotateX = 0
  transform.value.rotateY = 0
}

function updateStaticRotation() {
  rotation.value = Math.sin(gameStore.animationFrames / 60 + (props?.index ?? 0) * 2)
}
gameStore.useAnimation(() => {
  updateStaticRotation()
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

function onTransition(e: TransitionEvent) {
  if (e.type === 'transitionend') {
	  transitions.value.transform = 'transform none';
  }

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
      transform: `
      rotateZ(${dragging ? 0 : index === 0 ? -.05 : index === 1 ? 0 : .05 }turn)
      rotate(${rotation}deg)
      rotateX(${transform.rotateX + rotation}deg)
      rotateY(${transform.rotateY + rotation}deg)
      translate(${transform.translateX}px, ${transform.translateY + (dragging ? 0 : index === 0 || index === 2 ? 50 : 0)}px)`,
      transition: `${Object.values(transitions).join(', ')}`
    }"
    @click="onCardClick"
    @mousedown="onMouseDown"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @transitionend="onTransition"
    @transitionrun="onTransition"
>
  <div
      ref="cardRef"
       class="card"
      :class="[
        isMovable() && (hovering || dragging) && 'hovering',
      ]"
  >
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

  display: flex;
  justify-content: center;
  align-items: center;

  transform-style: preserve-3d;
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
  /*position: absolute;*/
  top: 0;
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