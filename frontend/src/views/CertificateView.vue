<template>
  <div class="page-container">
    <button @click="router.back()" class="btn-secondary">
      بازگشت (Back)
    </button>

    <div v-if="loading">در حال بارگذاری... (Loading...)</div>
    
    <p v-else-if="error" class="text-error">{{ error }}</p>

    <div v-else-if="certData" class="detail-card">
      <h1 class="text-dark">{{ certData.first_name }} {{ certData.last_name }}</h1>
      <h2 class="text-muted">{{ certData.name }}</h2>
      <h2 class="text-muted">{{ certData.hash }}</h2>
      <img :src="certData.image" alt="Event Image" class="event-image" />
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
</script>