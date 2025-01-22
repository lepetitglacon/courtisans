<script setup lang="ts">
import {useSocketStore} from "@/stores/socket.ts";
import {useGameStore} from "@/stores/game.ts";
import {ref} from "vue";
import {socket} from "../../socket.ts";

const props = defineProps(['user'])

const playerContainerRef = ref<HTMLDivElement|null>(null)
const playerRef = ref<HTMLDivElement|null>(null)

const socketStore = useSocketStore()
const gameStore = useGameStore()

</script>

<template>
    <div
        ref="playerContainerRef"
      :style="{backgroundColor: Object.values(socketStore.game.infos.FAMILIES)[socketStore.game.users.indexOf(user)].color}"
      class="player-container w-100 d-flex justify-content-center align-items-center"
    >

<!--      <Action action="give" :data="{toUserId: user.socket}" class="player">-->

	      <div ref="playerRef" class="player d-flex flex-wrap">
          <div class="d-flex flex-column justify-content-center align-items-center w-100 h-50">
            <p>{{ user.name }}</p>
            <p>{{ socket.id }}</p>
          </div>
          <div class="d-flex h-50 flex-wrap">
            <div
                class="family d-flex justify-content-center"
                v-for="family of socketStore?.game?.infos?.FAMILIES"
                :style="{
                  backgroundColor: family.color,
                  width: playerRef?.getBoundingClientRect().width / 7 + 'px'}"
            >



            </div>
          </div>
	      </div>

    </div>
</template>

<style scoped>
.player-container {
	background-color: rgba(221, 60, 60, 0.17);
}
.player {
  width: 90%;
  height: 90%;
  background-color: rgba(0, 0, 0, 0.17);
}
.family {
}
</style>