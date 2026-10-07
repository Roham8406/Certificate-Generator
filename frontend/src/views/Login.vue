<template>
  <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
    <h1>Certificate Portal</h1>
    
    <!-- Login Form -->
    <div v-if="!isLoggedIn">
      <input v-model="username" placeholder="Username (admin)" style="margin: 5px; padding: 8px;" /><br/>
      <input v-model="password" type="password" placeholder="Password (password)" style="margin: 5px; padding: 8px;" /><br/>
      <button @click="login" style="padding: 10px 20px; cursor: pointer; margin-top: 10px;">Login</button>
      <p style="color: red;">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const username = ref('');
const password = ref('');
const isLoggedIn = ref(false);
const error = ref('');

const login = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/login', {
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

</script>