<script setup lang="ts">

import AdminPanel from "@/components/UI/admin/AdminPanel.vue";
import {useGameStore} from "@/stores/game.ts";
import {useSocketStore} from "@/stores/socket.ts";

const gameStore = useGameStore()
const socketStore = useSocketStore()
</script>

<template>

  <div id="ui" class="position-absolute">
    <AdminPanel/>

    <div v-if="socketStore.game?.score?.users">
      <h2>SCORE</h2>
      <pre>{{ socketStore.game.score }}</pre>
    </div>
  </div>

</template>

<style scoped>

</style>