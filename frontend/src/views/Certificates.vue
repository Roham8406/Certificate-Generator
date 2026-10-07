<template>
  <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
    <h1>مدارک من (My Certificates)</h1>
      
    <button @click="logout" style="background: red; color: white; padding: 5px 15px; margin-bottom: 20px;">
      خروج
    </button>

    <p v-if="error" style="color: red;">{{ error }}</p>

    <div v-if="certificates.length > 0">
      <div v-for="cert in certificates" :key="cert.id" style="border: 1px solid #ccc; margin: 10px auto; padding: 15px; width: 300px; border-radius: 8px;">
        
        <h3>{{ cert.name }}</h3> 
        
        <button style="background: green; color: white; padding: 8px 12px; cursor: pointer; margin-top: 10px;">
          دانلود (Download)
        </button>
      </div>
    </div>
    <p v-else>هیچ مدرکی یافت نشد. (No certificates found.)</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const certificates = ref([]);
const error = ref('');
const router = useRouter();

onMounted(async () => {
  const token = localStorage.getItem('loginSession');
  
  if (!token) {
    router.push('/');
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (data.success) {
      certificates.value = data.data;
    } else {
      error.value = data.message;
      logout();
    }
  } catch (err) {
    error.value = 'خطا در ارتباط با سرور.';
  }
});

const logout = () => {
  localStorage.removeItem('loginSession');
  router.push('/');
};
</script>