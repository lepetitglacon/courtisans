<script setup lang="ts">
import {useSocketStore} from "@/stores/socket.ts";
import {useGameStore} from "@/stores/game.ts";
import {computed, onMounted, ref} from "vue";
import {socket} from "../../socket.ts";
import Deck from "@/components/cards/Deck.vue";

const props = defineProps(['user'])

const playerContainerRef = ref<HTMLDivElement|null>(null)
const playerRef = ref<HTMLDivElement|null>(null)

const socketStore = useSocketStore()
const gameStore = useGameStore()

const color = computed(() => {
  const families = Object.values(socketStore.game?.infos?.FAMILIES ?? {})
  if (families) {
    const foundUser = families[socketStore.game?.users.indexOf(props.user)]
    return foundUser.color
  }
  return '#582'
})


</script>

<template>
    <div
        ref="playerContainerRef"
      :style="{backgroundColor: color}"
      class="player-container w-100 d-flex justify-content-center align-items-center"
        :class="[
            !user.socket.connected && 'disconnected'
        ]"
    >

<!--      <Action action="give" :data="{toUserId: user.socket}" class="player">-->

	      <div ref="playerRef" class="player d-flex flex-wrap">
          <div class="d-flex flex-column justify-content-center align-items-center w-100 h-50">
            <p>{{ user.name }}</p>
            <p>{{ user.socket.id }}</p>
          </div>
          <div class="d-flex h-50 flex-wrap">
            <div
                class="d-flex justify-content-center"
                v-for="family of socketStore?.game?.infos?.FAMILIES"
                :style="{
                  backgroundColor: family.color,
                  width: playerRef?.getBoundingClientRect().width / 7 - 0.1 + 'px'
                }"
            >

              <Deck :cards="user.cards.filter(card => card.family.id === family.id)"/>

            </div>
          </div>
	      </div>

    </div>
</template>

<style scoped>
.player-container {

}
.player {
  width: 90%;
  height: 90%;
  background-color: rgba(0, 0, 0, 0.17);
}
.family {
}

.disconnected {
  box-shadow: inset 0 0 1em #131209;
}
</style>