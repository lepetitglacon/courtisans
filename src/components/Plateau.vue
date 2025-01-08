<script setup lang="ts">
import draggable from "vuedraggable";
import {useConnectionStore} from "@/stores/socket.ts";
import Action from "@/components/actions/Action.vue";
import {useGameStore} from "@/stores/game.ts";

const socketStore = useConnectionStore()
const gameStore = useGameStore()
</script>

<template>

  <div class="plateau">

    <div
        v-for="[key, family] of Object.entries(socketStore?.game?.infos?.FAMILIES ?? [])"
        class="plateau-family"
      :style="{backgroundColor: family.color}"
    >
      <p>{{ family.title }}</p>

	    <div>
		    <div
			    class="card"
			    v-for="familyCard of socketStore.game.familyCards[family.id].enlighten"
        >
			    {{ familyCard.id }} {{ familyCard.power }}

          <div style="width: 20px; height: 20px;">
            <Action action="kill_crown" :data="{familyId: family.id}"/>
          </div>

		    </div>
	    </div>

      <div class="enlight">
        <Action action="enlight" :data="{familyId: family.id}"/>
      </div>
      <div class="shadow">
        <Action action="shadow" :data="{familyId: family.id}"/>
      </div>

      <div>
        <div
            class="card"
            v-for="familyCard of socketStore.game.familyCards[family.id].shadowed"
          >
          {{ familyCard.id }} {{ familyCard.power }}
        </div>
      </div>

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
  height: 50%;
}

.shadow {
  background-color: rgba(0,0,0,75%);
  height: 50%;
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