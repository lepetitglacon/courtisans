<script setup lang="ts">
import {onMounted, ref} from "vue";

const cardContainer = ref(null);
const cardRef = ref(null);
const dragging = ref(false);
// Handle mouse movement
const handleMouseMove = (event) => {
console.log(dragging.value);

  const rect = cardContainer.value.getBoundingClientRect()
  if (dragging.value) {
    cardContainer.value.style.left = `${event.clientX - rect.width / 2}px`;
    cardContainer.value.style.top = `${event.clientY - rect.height / 2}px`;
  }

  const x = event.clientX - rect.left; // Mouse X relative to container
  const y = event.clientY - rect.top; // Mouse Y relative to container
  const centerX = rect.width / 2; // Center of container (X)
  const centerY = rect.height / 2; // Center of container (Y)
  const rotateX = ((y - centerY) / centerY) * -10; // Tilt based on Y-axis
  const rotateY = ((x - centerX) / centerX) * 10; // Tilt based on X-axis

  cardRef.value.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
};

// Reset card position on mouse leave
const resetCard = () => {
  dragging.value = false
  const card = cardContainer.value.querySelector(".card");
  card.style.transition = "transform 0.3s ease";
  card.style.transform = "rotateX(0deg) rotateY(0deg)";

  setTimeout(() => {
    card.style.transition = "none"; // Remove transition after reset
  }, 300);
};

function mouseDown(event: MouseEvent) {
  dragging.value = true
}
function mouseUp(event: MouseEvent) {
  dragging.value = false
}

</script>

<template>
  <div
      class="card-container"
      @mousedown="mouseDown"
      @mouseup="mouseUp"
      @mousemove="handleMouseMove"
      @mouseleave="resetCard"
      ref="cardContainer"
  >
    <div ref="cardRef"
        class="card"
         @mouseup.prevent=""
         @mousemove.prevent=""
         @mouseleave.prevent=""
    >
      <div>Card</div>
<!--      <div class="card-face">Card</div>-->
    </div>
  </div>
</template>

<style scoped>
.card-container {
  position: absolute;
  width: 300px;
  height: 400px;
  perspective: 1000px;
  margin: 100px auto;
}

.card {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ff6a00, #ee0979);
  border-radius: 15px;
  transform-style: preserve-3d;
  transition: transform 0.1s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  user-select: none;
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>