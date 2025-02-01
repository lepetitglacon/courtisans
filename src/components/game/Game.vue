<script setup lang="ts">
import {useRouter} from "vue-router";
import Players from "@/components/players/Players.vue";
import AppContainer from "@/components/AppContainer.vue";
import OwnPlayer from "@/components/OwnPlayer.vue";
import UI from "@/components/UI/UI.vue";
import Plateau from "@/components/plateau/Plateau.vue";

const router = useRouter()
</script>

<template>
  <div class="d-flex flex-column justify-content-evenly">
    <AppContainer>
      <Players/>
    </AppContainer>

    <AppContainer>
      <Plateau/>
    </AppContainer>

    <AppContainer>
      <OwnPlayer/>
    </AppContainer>

    <UI/>
  </div>
</template>

<style scoped>

</style>