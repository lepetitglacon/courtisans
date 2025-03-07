<script setup lang="ts">
import './assets/main.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import {router} from './router.ts'

import Navbar from "@/components/Navbar.vue";
import {computed} from "vue";
const fullPath = computed(() => {
	return router.currentRoute.value.fullPath
})


</script>

<template>

	<Navbar v-if="!fullPath.startsWith('/games/')"/>

  <div id="app-root">
    <RouterView />
  </div>

</template>

<style scoped>
#app-root {
    width: 100vw;
	height: 100vh;
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
