<template>
  <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
    <button @click="router.back()" style="background: gray; color: white; padding: 5px 15px; margin-bottom: 20px;">
      بازگشت (Back)
    </button>

    <div v-if="loading">در حال بارگذاری... (Loading...)</div>
    
    <p v-else-if="error" style="color: red;">{{ error }}</p>

    <div v-else-if="certData" style="border: 2px solid #ddd; padding: 20px; border-radius: 12px; max-width: 600px; margin: 0 auto; background: #fafafa;">
      <h1 style="color: #333;">{{ certData.first_name }} {{ certData.last_name }}</h1>
      <h2 style="color: #555;">{{ certData.name }}</h2>
      <h2 style="color: #555;">{{ certData.hash }}</h2>
      <img :src="certData.image" alt="Event Image" style="max-width: 100%; border-radius: 8px; margin-top: 20px;" />
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