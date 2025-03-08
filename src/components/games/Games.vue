<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {BLUE} from "../../composables/useColor.ts";

const router = useRouter();

const games = ref([])
const isTraining = ref(false)
const trainingBots = ref(1)

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

	  <div class="col p-2 h-100 rounded-2 overflow-x-hidden" :style="{backgroundColor: BLUE}">
		  <h2>Liste des parties</h2>
		  <table class="w-100 table table-dark table-striped">
			  <thead>
			  <tr>
				  <td>Nom</td>
<!--				  <td>État</td>-->
<!--				  <td>Date de création</td>-->
				  <td>Actions</td>
			  </tr>
			  </thead>
        <tbody>
          <tr v-if="games.length"
              v-for="game of games">

            <td>{{ game.title }}</td>
  <!--				  <td>{{ game.state }}</td>-->
  <!--				  <td>{{ game.crdate }}</td>-->
            <td><RouterLink v-if="game.state !== 'COUNTING'" :to="`/games/${game._id}`" class="btn btn-success">Rejoindre</RouterLink></td>
          </tr>
          <tr v-else>Aucune partie de disponible. Vous pouvez en créer une pour jouer avec vos amis ou des bots en mode entrainement !</tr>
        </tbody>
		  </table>
	  </div>

	  <div class="col p-5 h-100" :style="{color: BLUE}">
		  <h2>Créer une partie</h2>

      <form @submit="createGame">
			  <div class="row mb-3">
          <div class="col">
            <label for="exampleFormControlInput1" class="form-label">Nom de la partie</label>
            <input type="text" class="form-control" id="exampleFormControlInput1" name="title">
          </div>
			  </div>
        <div class="mb-3 ">
          <div class="mb-3 form-check form-switch form-check">
            <input v-model.number="isTraining" class="form-check-input" type="checkbox" name="training" id="training">
            <label class="form-check-label" for="training">Mode entrainement</label>
          </div>
          <div class="mb-3 d-flex">

            <label class="form-check-label" for="trainingBots">Nombre de bots</label>

            <button class="btn btn-light" @click.prevent="trainingBots++">+</button>
            <input v-model.number="trainingBots" type="number" min="1" max="4" class="form-control" id="trainingBots" name="trainingBots" :disabled="!isTraining">
            <button class="btn btn-light" @click.prevent="trainingBots--">-</button>

          </div>
        </div>

			  <button type="submit" class="btn btn-success">Jouer !</button>
		  </form>
	  </div>

  </div>
</template>

<style scoped>

</style>