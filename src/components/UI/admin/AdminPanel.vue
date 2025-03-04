<script setup lang="ts">
import {ref} from "vue";
import {useSocketStore} from "@/stores/socket.ts";

const socketStore = useSocketStore()

const open = ref(true)

function handleClick(e) {
  socketStore.emit(`client/admin/${e.target.dataset.action}`)
}
</script>

<template>

  <button @click="open = !open">Admin</button>

  <div class="admin" v-if="open">

    <button @click="handleClick" data-action="start">Start</button>
    <button @click="handleClick" data-action="restart">Restart</button>
    <button @click="handleClick" data-action="test">Test</button>

	<div>Cartes totales : {{ socketStore.game?.cards.length }}</div>
  </div>

</template>

<style scoped>
.admin {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>