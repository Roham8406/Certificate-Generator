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

    <!-- Dashboard after login -->
    <div v-else>
      <h2 style="color: green;">{{ successMessage }}</h2>
      <button @click="getCertificate" style="padding: 10px 20px; background: blue; color: white; cursor: pointer;">
        Get Certificate
      </button>
      <p style="margin-top: 20px; font-weight: bold;">{{ certData }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const isLoggedIn = ref(false);
const error = ref('');
const successMessage = ref('');
const certData = ref('');

const login = async () => {
  try {
    // Send a POST request to your backend container
    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    });
    const data = await response.json();
    
    if (data.success) {
      isLoggedIn.value = true;
      successMessage.value = data.message;
      error.value = '';

      localStorage.setItem('loginSession', data.token);
    } else {
      error.value = data.message;
    }
  } catch (err) {
    error.value = 'خطا در اتصال به سرور';
  }
};

const getCertificate = async () => {
  try {
    const token = localStorage.getItem('sessionToken');
    
    const response = await fetch('http://localhost:8000/api/certificate', {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    const data = await response.json();
    certData.value = data.message;
  } catch (err) {
    certData.value = 'Failed to fetch certificate.';
  }
};
</script>