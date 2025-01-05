<script setup lang="ts">
import {useConnectionStore} from "@/stores/socket.ts";

const gameStore = useConnectionStore()
</script>

<template>

  <div class="plateau">
    <div
        v-for="[key, family] of Object.entries(gameStore?.game?.infos?.FAMILIES ?? [])"
        class="plateau-family"
      :style="{backgroundColor: family.color}"
    >
      <p>{{ family.title }}</p>
    </div>
  </div>

</template>

<style scoped>
.plateau {
  display: flex;
  justify-content: space-around;
  width: 100vw;
  height: 25vh;
}
.plateau-family {
  color: white;
  width: 100%;
  height: 100%;
}
</style>