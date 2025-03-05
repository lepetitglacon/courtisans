<script setup lang="ts">
  import Card from "@/components/cards/Card.vue";

  import {useSocketStore} from "@/stores/socket.ts";
  import {useGameStore} from "@/stores/game.ts";
  import {provide, ref} from "vue";

  const socketStore = useSocketStore()
  const gameStore = useGameStore()

  const absoluteContainerRef = ref()

  provide('killAction', 'kill_own')
  provide('absoluteContainerRef', absoluteContainerRef)
</script>

<template>
.5
  <div class="ownplayer d-flex justify-content-center position-absolute"
    ref="absoluteContainerRef"
  >

    <template v-if="socketStore.game?.state !== 'COUNTING'">
      <div
        v-if="socketStore?.isYourTurn && socketStore.currentPlayer?.handCards?.length"
        class="position-absolute d-flex flex-column"
        style="top: -100px"
      >
          <p class="text-center">À votre tour !</p>
	      <div class="d-flex ">
	          <div
	            v-for="action of socketStore?.game.userActionsToPlay"
	            class="mx-2 px-2 bg-light text-dark rounded-2"
	          >
	              <p>{{ action === 'give' ? 'Donner' : action === 'place' ? 'Placer' : 'Garder' }}</p>
	          </div>
	      </div>
      </div>
    </template>

    <div class="ownplayer-inner d-flex justify-content-center">
      <div
          v-for="i in 3"
          :key="i"
          class="ownplayer-card-container"
          :style="{

          }"
      >
        <Card
            v-if="socketStore.currentPlayer?.handCards[i - 1]"
            :key="socketStore.currentPlayer?.handCards[i - 1].id"
            :card="socketStore.currentPlayer?.handCards[i - 1]"
            :index="i - 1"
            :isPlayerDeck="true"
            movable="true"
        />
      </div>
    </div>

  </div>


</template>

<style scoped>
.ownplayer {
  bottom: 0;
  width: 100vw;
  height: 200px;
  z-index: 5;
}
.ownplayer-inner {
  min-width: 50vw;
}
.ownplayer-card-container {
  min-width: 150px;
}
</style>