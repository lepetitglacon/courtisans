<script setup lang="ts">
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

import Navbar from "@/components/Navbar.vue";
</script>

<template>

  <Navbar/>

  <div id="app-root">
    <RouterView />
  </div>

</template>

<style scoped>
#app-root {
  //width: 100vw;
  //height: 100vh;

}
.admin-panel {
 position: absolute;
  bottom: 0;
}
.tier {
  height: 25vh;
}
.quart {
  height: 50vh;
}
</style>
