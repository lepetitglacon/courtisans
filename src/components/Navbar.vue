<script setup lang="ts">

import {RouterLink, useRoute, useRouter} from "vue-router";

const router = useRouter()
const route = useRoute()
</script>

<template>

  <nav class="navbar navbar-expand-md">
    <div class="container-fluid">
      <div class="container collapse navbar-collapse d-flex justify-content-between" id="navbarNav">

        <div class="col">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink to="/" class="btn nav-link">Accueil</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/règles" class="btn nav-link">Les règles</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/scores" class="btn nav-link">Scores</RouterLink>
            </li>
          </ul>
        </div>

        <div class="col d-flex justify-content-center">
          <RouterLink class="btn btn-game play-button" to="/games">Jouer</RouterLink>
        </div>

        <div class="col d-flex justify-content-end">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink to="/login" class="btn nav-link">Se connecter</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.active-exact {
  background-color: #cd9f3d;
  font-weight: 800 !important;
}
.nav-item {
  margin-right: 10px;
  margin-left: 10px;
  font-weight: 500;
  color: #838383;
}
.play-button {
  font-size: 1.5em;
  border-width: 3px !important;
  border-radius: 5px;
}
</style>