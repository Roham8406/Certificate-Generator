<template>
  <div style="text-align: center; margin-top: 50px; font-family: sans-serif;">
    <h1>اعتبارسنجی گواهی (Certificate Validation)</h1>

    <div v-if="loading" style="margin-top: 20px;">در حال بررسی... (Checking...)</div>
    
    <p v-else-if="error" style="color: red; font-size: 1.2rem; margin-top: 20px; font-weight: bold;">
      ❌ {{ error }}
    </p>

    <div v-else-if="validData" style="border: 2px solid green; padding: 30px; border-radius: 12px; max-width: 500px; margin: 30px auto; background: #f0fff0;">
      <h2 style="color: green; margin-bottom: 20px;">✅ گواهی معتبر است (Valid Certificate)</h2>
      
      <h3 style="color: #333;">نام و نام خانوادگی: {{ validData.first_name }} {{ validData.last_name }}</h3>
      <h4 style="color: #555; margin-top: 15px;">رویداد: {{ validData.name }}</h4>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const validData = ref(null);
const error = ref('');
const loading = ref(true);

onMounted(async () => {
  const hash = route.params.hash;

  try {    
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/validate/${hash}`, {
      method: 'GET'
    });
    
    const data = await response.json();
    
    if (data.success) {
      validData.value = data.data;
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