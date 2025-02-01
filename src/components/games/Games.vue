<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";

const games = ref()

onMounted(async () => {
  const res = await fetch('http://localhost:3000/games')
  const json = await res.json()
  console.log(json)
  games.value = json
})

</script>

<template>
  <div>
    <div v-for="game of games">
      {{ game }}
      <RouterLink :to="`/games/${game._id}`">Join</RouterLink>
    </div>
  </div>
</template>

<style scoped>

</style>