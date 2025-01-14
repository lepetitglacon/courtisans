<script setup lang="ts">
import {useConnectionStore} from "@/stores/socket.ts";
import Action from "@/components/actions/Action.vue";
import {socket} from "@/socket.ts";
import Deck from "@/components/cards/Deck.vue";

const props = defineProps(['user'])

const gameStore = useConnectionStore()

</script>

<template>


    <div
      v-if="user.socket !== socket.id"
      class="player"
    >
      <Action action="give" :data="{toUserId: user.socket}">
      <div>
        <p>{{ user.name }}</p>
        <p>{{ user.socket }}</p>
      </div>


      </Action>


      <div class="families">
        <div
            class="family"
            v-for="family of gameStore?.game?.infos?.FAMILIES"
            :style="{backgroundColor: family.color}"
        >
          {{ user.cards.filter(card => card.family.id === family.id).length }}
          <p class="card" v-for="card of user.cards.filter(card => card.family.id === family.id)">{{ card.id }} {{ card.power }}</p>
          <Deck :cards="user.cards.filter(card => card.family.id === family.id)"/>

        </div>
      </div>

    </div>



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