<template>
  <div class="page-container">
    <button @click="router.back()" class="btn-secondary">
      بازگشت (Back)
    </button>

    <div v-if="loading">در حال بارگذاری... (Loading...)</div>
    
    <p v-else-if="error" class="text-error">{{ error }}</p>

    <div v-else-if="finalImageUrl" class="detail-card">
      <img :src="finalImageUrl" alt="Official Certificate" class="event-image" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const certData = ref(null);
const error = ref('');
const loading = ref(true);
const finalImageUrl = ref(''); // Will hold the base64 baked image

onMounted(async () => {
  const token = localStorage.getItem('loginSession');
  
  if (!token) {
    router.push('/');
    return;
  }

  const eventId = route.params.id;

  try {    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/certificate/${eventId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    const data = await response.json();
    
    if (data.success) {
      certData.value = data.data;
      bakeTextIntoImage(data.data);
    } else {
      error.value = data.message;
    }
  } catch (err) {
    error.value = 'خطا در ارتباط با سرور.';
    console.log(err);
  } finally {
    loading.value = false;
  }
});

const bakeTextIntoImage = (data) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const img = new Image();
  img.crossOrigin = "Anonymous"; 
  
  img.src = data.image; 
  debugger;

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    ctx.font = 'bold 60px sans-serif';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';

    const nameX = data.name_x;
    const nameY = data.name_y;
    const fullName = `${data.first_name} ${data.last_name}`;
    ctx.fillText(fullName, nameX, nameY);

    ctx.font = '30px monospace';
    ctx.fillStyle = '#777777';

    const hashX = data.hash_x;
    const hashY = data.hash_y;
    ctx.fillText(data.hash, hashX, hashY);

    finalImageUrl.value = canvas.toDataURL('image/png');
  };

  img.onerror = () => {
    error.value = 'خطا در بارگذاری تصویر پس‌زمینه.';
  };
};
</script>