<template>
  <div class="page-container">
    <h1>ابزار کالیبراسیون (Calibration Tool)</h1>
    <p>روی هر نقطه از تصویر کلیک کنید تا مختصات آن را به صورت درصد (٪) ببینید.</p>
    
    <div style="margin-bottom: 20px; font-size: 1.5rem; font-weight: bold; color: var(--accent);">
      مختصات کلیک شده: X: {{ clickedX }}% , Y: {{ clickedY }}%
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
  const rect = event.target.getBoundingClientRect();
  
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const percentX = (x / rect.width) * 100;
  const percentY = (y / rect.height) * 100;

  clickedX.value = percentX.toFixed(2);
  clickedY.value = percentY.toFixed(2);
  
  console.log(`X: ${clickedX.value}%, Y: ${clickedY.value}%`);
};
</script>