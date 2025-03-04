<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import Action from "@/components/actions/Action.vue";
import {useGameStore} from "@/stores/game.ts";
import {useSocketStore} from "@/stores/socket.ts";

const gameStore = useGameStore()
const socketStore = useSocketStore()

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

const killAction = inject('killAction')
const toUserId = inject('otherUser')

const cardContainerRef = ref<HTMLDivElement|null>(null);
const cardRef = ref(null);
const rotation = ref(0);
const active = ref(true);
const dragging = ref(false);
const hovered = ref(false);

gameStore.registerActionDiv(
    'kill',
    cardContainerRef,
    {
        familyId: props.card.family.id,
        otherCardId: props.card?.id,
	    killAction,
	    toUserId
    },
    hovered,
    active
)

function getImgSrc() {
  if (
	  socketStore.game?.state !== 'COUNTING'
	  && (props.card.power === 'hidden' || props.showBackFace)
  ) {
    return 'assassin'
  }
  return `${props.card.family.id}/${props.card.power}`
}

function updateRotation() {
  rotation.value = Math.sin(gameStore.animationFrames / 60 + (props?.index ?? 0) * 2)
}

gameStore.useAnimation(() => {
  updateRotation()
})

function getStyle() {
  return
}

function onMouseEnter(e) {
  // hovered.value = true
}
function onMouseLeave(e) {
  // hovered.value = false
}
</script>

<template>
  <div
      class="card-container position-absolute"
      :class="[
          dragging && 'dragging',
          hovered && 'hovered'
      ]"
      :style="{

        transition: 'transform .15s ease',
        transform: `translateY(${(offset ?? 20) * index}px) rotate(${rotation}deg)`
      }"
      ref="cardContainerRef"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
  >
<!--    <Action action="kill" :data="{-->
<!--      familyId: props.card.family.id,-->
<!--      otherCardId: props.card.id,-->
<!--    }">-->
<!--	  </Action>-->
    <img
        class="img"
        :src="`/cards/${getImgSrc()}.png`"

    >
  </div>
</template>

<style scoped>
.card-container {
  min-width: 100px;
}
.img {
  width: 100%;
}

</style>