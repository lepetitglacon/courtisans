<script setup lang="ts">
import {ref} from "vue";
import {useSocketStore} from "@/stores/socket.ts";

const socketStore = useSocketStore()

const open = ref(false)

function handleClick(e) {
  socketStore.emit(`client/admin/${e.target.dataset.action}`)
}
</script>

<template>
	<button
      class="btn btn-game"
      @click="open = !open"
      :class="[
          open && 'active'
      ]"
  >
    Admin
  </button>

  <div class="admin" v-if="open">
    <button @click="handleClick" data-action="test">Test</button>
  </div>

</template>

<style scoped>
.admin {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>