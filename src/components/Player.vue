<script setup lang="ts">
import {useConnectionStore} from "@/stores/socket.ts";
import Action from "@/components/actions/Action.vue";
import {socket} from "@/socket.ts";

const props = defineProps(['user'])

const gameStore = useConnectionStore()
</script>

<template>

  <Action action="give" :data="{toUserId}">

    <div
      v-if="user.socket !== socket.id"
      class="player"
    >
      <div>
        <p>{{ user.name }}</p>
        <p>{{ user.socket }}</p>
      </div>


      <div class="families">
        <div
            class="family"
            v-for="family of gameStore?.game?.infos?.FAMILIES"
            :style="{backgroundColor: family.color}"
        >
          {{ user.cards.filter(card => card.family.id === family.id).length }}
          <p class="card" v-for="card of user.cards.filter(card => card.family.id === family.id)">{{ card.id }} {{ card.power }}</p>
          <Card class="card" v-for="card of user.cards.filter(card => card.family.id === family.id)" :card="card"/>

        </div>
      </div>

    </div>

  </Action>


</template>

<style scoped>
.player {
  width: 100%;
	padding: 20px;
  background-color: rgba(0, 0, 0, 10%);
}
.families {
  display: flex;
}
.family {
  min-width: 20px;
}
.card {
  background-color: rgba(255, 255, 0, 40%);
}
</style>