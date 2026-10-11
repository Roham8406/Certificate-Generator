<template>
  <div class="page-container">
    <h1>ابزار کالیبراسیون (Calibration Tool)</h1>
    <p>روی هر نقطه از تصویر کلیک کنید تا مختصات آن را ببینید.</p>
    
    <div style="margin-bottom: 20px; font-size: 1.5rem; font-weight: bold; color: var(--accent);">
      مختصات کلیک شده: X: {{ clickedX }} , Y: {{ clickedY }}
    </div>

    <div style="display: inline-block; border: 2px solid var(--accent); cursor: crosshair;">
      <!-- Replace with your actual image path -->
      <img 
        src="/images/SS05.png" 
        alt="Calibration Background" 
        @click="getCoordinates" 
        style="display: block; max-width: none;" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const clickedX = ref(0);
const clickedY = ref(0);

const getCoordinates = (event) => {
  // Calculates the exact pixel clicked relative to the image's top-left corner
  const rect = event.target.getBoundingClientRect();
  
  // Multiply by the ratio of natural size to rendered size (in case CSS scaled it)
  const scaleX = event.target.naturalWidth / rect.width;
  const scaleY = event.target.naturalHeight / rect.height;

  clickedX.value = Math.round((event.clientX - rect.left) * scaleX);
  clickedY.value = Math.round((event.clientY - rect.top) * scaleY);
  
  console.log(`X: ${clickedX.value}, Y: ${clickedY.value}`);
};
</script>