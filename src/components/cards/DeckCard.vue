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
const active = ref(false);
const dragging = ref(false);
const hovered = ref(false);

gameStore.registerActionDiv(
    'give',
    cardContainerRef,
    {
      toUserId: props.user?.socket?.id
    },
    hovered,
    active
)

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