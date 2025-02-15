<script setup lang="ts">
import {useSocketStore} from "@/stores/socket.ts";
import {useGameStore} from "@/stores/game.ts";
import {computed, inject, onMounted, provide, ref} from "vue";
import Deck from "@/components/cards/Deck.vue";
import Action from "@/components/actions/Action.vue";

const props = defineProps<{
  user: object
  left: boolean
}>()

provide('otherUser', props.user)
const socket = inject('socket')

const playerContainerRef = ref<HTMLDivElement|null>(null)
const playerRef = ref<HTMLDivElement|null>(null)
const hovered = ref(false)
const active = ref(true)

const socketStore = useSocketStore()
const gameStore = useGameStore()

gameStore.registerActionDiv(
    'give',
    playerContainerRef,
    {
      toUserId: props.user?.socket?.id
    },
    hovered,
    active
)

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
      class="d-flex h-100 w-100"
      :class="[
          hovered && gameStore.holdenCard && 'hovered',
          !user.socket.connected && 'disconnected'
      ]"
    >
      <div class="cards">
<!--        <Deck v-for="cards of user.cards.filter(card => card.power !== 'hidden')" :cards="cards" :show-back-face="false"/>-->
      </div>

      <div class="info position-relative">
        <div class="position-absolute">
          <p>{{user.name}}</p>
          <p>{{user.socket.id}}</p>
        </div>
<!--        <Deck v-for="cards of user.cards.filter(card => card.power === 'hidden')" :cards="cards" :show-back-face="false"/>-->
      </div>

<!--	      <div ref="playerRef" class="player d-flex flex-wrap">-->

<!--          <Action-->
<!--              :action="user.socket.id === socket.id ? 'keep' : 'give'"-->
<!--              :data="{-->
<!--                  toUserId: user.socket.id !== socket.id ? user.socket.id : ''-->
<!--                }"-->
<!--              class="player d-flex justify-content-center align-items-center"-->
<!--          >-->

<!--          <div class="d-flex flex-column justify-content-center align-items-center w-25 h-25">-->

<!--              <div class="mx-3">-->
<!--                <p>{{ user.name }}</p>-->
<!--                <p>{{ user.socket.id }}</p>-->
<!--              </div>-->
<!--              <div v-if="socketStore.game.score">-->
<!--                <h2>SCORE</h2>-->
<!--                <pre>{{ Object.values(socketStore.game.score.users[user.socket.id] ?? []).reduce((acc: Number, el: Number) => {-->
<!--                  return acc += el-->
<!--                }, 0)  }}</pre>-->
<!--              </div>-->

<!--          </div>-->
<!--          <div class="w-100 h-50 d-flex justify-content-around align-items-start flex-wrap">-->
<!--            <div-->
<!--                class="d-flex justify-content-center"-->
<!--                v-for="family of socketStore?.game?.infos?.FAMILIES"-->
<!--                :style="{-->
<!--                  backgroundColor: family.color,-->
<!--                }"-->
<!--            >-->

<!--              <Deck-->
<!--                  v-if="family.id !== 'assassin'"-->
<!--                  :cards="user.cards.filter(card => card.family.id === family.id && card.power !== 'hidden')"-->
<!--                  :show-back-face="false"-->
<!--              />-->

<!--              <Deck-->
<!--                  v-if="family.id === 'assassin'"-->
<!--                  :cards="user.cards.filter(card => card.power === 'hidden')"-->
<!--                  :show-back-face="true"-->
<!--              />-->

<!--            </div>-->
<!--          </div>-->

<!--          </Action>-->
<!--	      </div>-->

    </div>
</template>

<style scoped>
.player {
  width: 90%;
  height: 90%;
  background-color: rgba(0, 0, 0, 0.17);
}

.disconnected {
  opacity: .5;
}
</style>