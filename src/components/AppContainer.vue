<script setup lang="ts">

import useColor from "@/composables/useColor.ts";
</script>

<template>
  <div class="d-flex h-100" :style="{backgroundColor: useColor()}">
    <slot/>
  </div>
</template>

<style scoped>

</style>