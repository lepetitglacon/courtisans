<script setup lang="ts">

import AdminPanel from "@/components/UI/admin/AdminPanel.vue";
import {useGameStore} from "@/stores/game.ts";
import {useSocketStore} from "@/stores/socket.ts";

const gameStore = useGameStore()
const socketStore = useSocketStore()
</script>

<template>

  <div id="ui" class="position-absolute">

  </div>

</template>

<style scoped>
#ui {
  top: 0;
  right: 0;
}
</style>