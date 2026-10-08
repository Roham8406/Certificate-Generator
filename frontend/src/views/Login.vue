<template>
  <div class="page-container">
    <h1>صفحهٔ ورود</h1>
    
    <div v-if="!isLoggedIn">
      <input v-model="username" placeholder="Username" class="input-field" /><br/>
      <input v-model="password" type="password" placeholder="Password" class="input-field" /><br/>
      <button @click="login" class="btn-primary">Login</button>
      <p class="text-error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const username = ref('');
const password = ref('');
const isLoggedIn = ref(false);
const error = ref('');

const login = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    });
    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('loginSession', data.token);
      router.push('/certificates');
    } else {
      error.value = data.message;
    }
  } catch (err) {
    error.value = 'خطا در اتصال به سرور';
  }
};

onMounted(async () => {
  const token = localStorage.getItem('loginSession');
  
  if (token) {
    router.push('/certificates');
    return;
  }
});

</script>