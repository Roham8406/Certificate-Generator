<template>
  <div class="page-container">
    <h1>صفحهٔ ورود</h1>
    
    <div v-if="!isLoggedIn">
      <input v-model="username" placeholder="Username" class="input-field" /><br/>
      
      <div style="position: relative; display: inline-block; width: 100%; max-width: 280px; margin: 0 auto;">
        <input 
          v-model="password" 
          :type="showPassword ? 'text' : 'password'" 
          placeholder="Password" 
          class="input-field" 
          style="width: 100%; padding-right: 40px; box-sizing: border-box; margin: 5px 0;" 
        />
        
        <!-- Glassy Eye Icon -->
        <span 
          @click="showPassword = !showPassword" 
          style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); cursor: pointer; color: var(--text); opacity: 0.5; transition: opacity 0.2s; display: flex; align-items: center; justify-content: center;"
          @mouseover="$event.currentTarget.style.opacity = '0.9'"
          @mouseleave="$event.currentTarget.style.opacity = '0.5'"
        >
          <!-- Eye Open SVG -->
          <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          
          <!-- Eye Slashed SVG -->
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        </span>
      </div>
      <br/>

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
const showPassword = ref(false);

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