<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {BLUE} from "../../composables/useColor.ts";

const router = useRouter();

const games = ref([])

onMounted(async () => {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/games`)
  const json = await res.json()
	json.sort((a, b) => {
		const ad = new Date(a.crdate)
		const bd = new Date(b.crdate)
		return ad.getTime() < bd.getTime()
	})
  games.value = json
})

async function createGame(e) {
  e.preventDefault()
  const formData = new FormData(e.target)
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/create`, {
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
  <div class="container p-5 d-flex h-100">

	  <div class="col p-5 h-50 rounded-2 overflow-y-scroll" :style="{backgroundColor: BLUE}">
		  <h2>Liste des parties</h2>
		  <table class="w-100">
			  <thead>
			  <tr>
				  <td>Nom</td>
				  <td>État</td>
				  <td>Date de création</td>
				  <td>Actions</td>
			  </tr>
			  </thead>
			  <tr v-if="games.length"
			      v-for="game of games">

				  <td>{{ game.title }}</td>
				  <td>{{ game.state }}</td>
				  <td>{{ game.crdate }}</td>
				  <td><RouterLink :to="`/games/${game._id}`" class="btn btn-success">Join</RouterLink></td>
			  </tr>
			  <tr v-else>No games for now, you can create one</tr>
		  </table>
	  </div>

	  <div class="col p-5 h-100">
		  <h2>Creer une partie</h2>
		  <form @submit="createGame">
			  <div class="mb-3">
				  <label for="exampleFormControlInput1" class="form-label">Title</label>
				  <input type="text" class="form-control" id="exampleFormControlInput1" name="title">
			  </div>
			  <button type="submit" class="btn btn-primary">Create game</button>
		  </form>
	  </div>

  </div>
</template>

<style scoped>
.games-container {
	overflow: auto;
}
thead {
	font-weight: 900;
	color: #2b3035;
	font-size: 1.5em;
}

</style>