<template>
  <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
    <h1>مدارک من (My Certificates)</h1>
    
    <button @click="logout" style="background: red; color: white; padding: 5px 15px; margin-bottom: 20px;">
      خروج (Logout)
    </button>

    <p v-if="error" style="color: red;">{{ error }}</p>

    <div v-if="certificates.length > 0">
      <div v-for="cert in certificates" :key="cert.id" style="border: 1px solid #ccc; margin: 10px auto; padding: 15px; width: 300px; border-radius: 8px;">
        <h3>{{ cert.title }}</h3>
        <p>Issued: {{ cert.issued_on.split('T')[0] }}</p>
        <button style="background: green; color: white; padding: 8px 12px; cursor: pointer;">
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
  // 1. Get the token we saved during login
  const token = localStorage.getItem('loginSession');
  
  // 2. If no token, kick them back to login
  if (!token) {
    router.push('/');
    return;
  }

  // 3. Fetch data from backend using the token
  try {
    const response = await fetch('http://localhost:8000/api/my-certificates', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    if (data.success) {
      certificates.value = data.data; // Assign the array of certificates
    } else {
      error.value = 'مجوز دسترسی ندارید.'; // Access denied
      logout();
    }
  } catch (err) {
    error.value = 'خطا در ارتباط با سرور.'; // Server connection error
  }
});

const logout = () => {
  localStorage.removeItem('loginSession');
  router.push('/');
};
</script>