<script setup lang="ts">
import draggable from "vuedraggable";
import {useConnectionStore} from "@/stores/socket.ts";
import {ref} from "vue";

const gameStore = useConnectionStore()

const list = [
	{
		name: 'ok'
	}
]
</script>

<template>

	<pre>{{ gameStore.game.familyCards }}</pre>
	
  <div class="plateau">
    <div
        v-for="[key, family] of Object.entries(gameStore?.game?.infos?.FAMILIES ?? [])"
        class="plateau-family"
      :style="{backgroundColor: family.color}"
    >
      <p>{{ family.title }}</p>

	    <draggable
		    :list="list"
		    item-key="name"
		    class="list-group"
		    ghost-class="ghost"
	    >
		    <template #item="{ element }">
			    <div class="list-group-item">
				    {{ element.name }}
			    </div>
		    </template>
	    </draggable>

    </div>
  </div>

</template>

<style scoped>
.plateau {
  display: flex;
  justify-content: space-around;
  width: 100vw;
  height: 25vh;
}
.plateau-family {
  color: white;
  width: 100%;
  height: 100%;
}

.list-group {
	display: flex;
	justify-content: center;

	background-color: beige;
	color: black;
	margin: 5px;
	border-radius: 2px;
}
.list-group-item {
	display: flex;
	justify-content: center;

	background-color: #2c3e50;
	margin: 2px;
}
</style>