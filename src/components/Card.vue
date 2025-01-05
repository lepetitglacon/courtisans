<script setup lang="ts">
  const props = defineProps([
      'card'
  ])
</script>

<template>
<div class="card-container" :style="{
  backgroundColor: card.family.color,
  color: 'white'
}">
  <div class="card-inner" >
    <p class="card-title">{{ card.family.title }}</p>
    <p>{{ card.power }}</p>
  </div>
</div>
</template>

<style scoped>
.card-container {
  width: 4.5cm;
  height: 8cm;
  background-color: #282828;
  border-radius: 5px;

  display: flex;
}
.card-inner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin: 5px;
  border-radius: 3px;
  background-color: rgba(0,0,0,30%);
  width: 100%;
}
.card-title {
  font-weight: 900;
}
</style>