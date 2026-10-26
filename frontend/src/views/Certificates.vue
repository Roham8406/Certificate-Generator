<template>
  <div class="page-container">      
    <button @click="logout" class="btn-danger">
      خروج
    </button>


    <div v-if="certificates.length > 0">
      <div v-for="cert in certificates" :key="cert.id" class="cert-card" 
           :style="`background-image: url(${cert.background}); background-size: 100% 100%;`">        
        <h3 class="event-card-text">{{ cert.name }}</h3> 
        <p class="event-card-text">{{ cert.description }}</p>
        
        <button @click="download(cert.id)" class="btn-success">
          دانلود
        </button>
      </div>
    </div>
    <p v-if="error" class="text-error">{{ error }}</p>
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
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/my-certificates`, {
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

const download = (id) => {
  router.push('/certificate/'+id);
};
</script>