<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";

const router = useRouter();

const games = ref([])

onMounted(async () => {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}:${import.meta.env.VITE_SERVER_PORT}/games`)
  const json = await res.json()
  games.value = json
})

async function createGame(e) {
  e.preventDefault()
  const formData = new FormData(e.target)
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}:${import.meta.env.VITE_SERVER_PORT}/create`, {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const json = await res.json()
  router.push(`games/${json.roomId}`)
}

</script>

<template>
  <div>
    <form @submit="createGame">
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Title</label>
        <input type="text" class="form-control" id="exampleFormControlInput1" name="title">
      </div>
      <button type="submit" class="btn btn-primary">Create game</button>
    </form>

    <div>
      <h2>Games</h2>
      <table>
        <tr v-if="games.length"
            v-for="game of games"
        >
          <td>{{ game.title }}</td>
          <td>{{ game.state }}</td>
          <td>{{ game.crdate }}</td>
          <td><RouterLink :to="`/games/${game._id}`" class="btn btn-success">Join</RouterLink></td>
        </tr>
        <tr v-else>No games for now, you can create one</tr>
      </table>
    </div>
  </div>
</template>

<style scoped>

</style>