<script setup lang="ts">

import {RouterLink, useRoute, useRouter} from "vue-router";

const router = useRouter()
const route = useRoute()
</script>

<template>

  <nav class="navbar navbar-expand-lg bg-body-tertiary">



    <div class="container-fluid">
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/games" class="nav-link">Play</RouterLink>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Pricing</a>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" aria-disabled="true">Disabled</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>