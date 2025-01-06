<script setup lang="ts">
import {useConnectionStore} from "@/stores/socket.ts";
import Player from "@/components/Player.vue";

const gameStore = useConnectionStore()
</script>

<template>
	<Player v-for="users of gameStore.game.users ?? []"/>
</template>

<style scoped>

</style>