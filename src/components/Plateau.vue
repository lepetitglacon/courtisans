<script setup lang="ts">
import draggable from "vuedraggable";
import {useConnectionStore} from "@/stores/socket.ts";

const gameStore = useConnectionStore()

function handleDragOver(e) {
  e.preventDefault()
}
function handleDragDrop(e) {
  console.log()
  const card = JSON.parse(e.dataTransfer.getData("application/json"))
  gameStore.emit('client/play', {
    action: e.target.dataset.action,
    id: card.id,
    family: e.target.dataset.family,
  })
}
</script>

<template>

  <div class="plateau">

    <div
        v-for="[key, family] of Object.entries(gameStore?.game?.infos?.FAMILIES ?? [])"
        class="plateau-family"
      :style="{backgroundColor: family.color}"
    >
      <p>{{ family.title }}</p>

	    <div>
		    <div
			    class="card"
			    v-for="familyCard of gameStore.game.familyCards[family.id]"
			    @dragover="handleDragOver"
			    @drop="handleDragDrop"
			    data-action="kill_crown"
			    :data-family="family.id"
		    >
			    {{ familyCard.id }} {{ familyCard.power }}
		    </div>
	    </div>

      <div
          class="draggable enlight"
          @dragover="handleDragOver"
          @drop="handleDragDrop"
          data-action="enlight"
          :data-family="family.id"
      ></div>

      <div
          class="draggable shadow"
          @dragover="handleDragOver"
          @drop="handleDragDrop"
          data-action="shadow"
          :data-family="family.id"
      ></div>

<!--	    <draggable-->
<!--		    :list="gameStore.game.familyCards[family.id]"-->
<!--		    item-key="name"-->
<!--		    class="list-group"-->
<!--		    ghost-class="ghost"-->
<!--	    >-->
<!--		    <template #item="{ element }">-->
<!--			    <div class="list-group-item">-->
<!--				    {{ element.id }}-->
<!--				    {{ element.power }}-->
<!--			    </div>-->
<!--		    </template>-->
<!--	    </draggable>-->

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
  display: flex;
  flex-direction: column;
  color: white;
  width: 100%;
  height: 100%;
}

.draggable {
  width: 100%;
  height: 50%;
}

.plateau .card {
	background-color: rgba(0,0,0,20%);
	margin: 5px;
	padding: 2px;
	border-radius: 2px;
}

.enlight {
  background-color: rgba(0,0,0,25%);
}

.shadow {
  background-color: rgba(0,0,0,75%);
}

.list-group {
	display: flex;
  flex-direction: column;
	justify-content: center;

	background-color: beige;
	color: black;
	margin: 5px;
	border-radius: 2px;
}
.list-group-item {
	display: flex;
  flex-direction: column;
	justify-content: center;

	background-color: #2c3e50;
	margin: 2px;
}
</style>