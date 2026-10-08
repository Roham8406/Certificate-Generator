<template>
  <div class="page-container">
    <h1>اعتبارسنجی گواهی (Certificate Validation)</h1>

    <div v-if="loading" class="mt-20">در حال بررسی... (Checking...)</div>
    
    <p v-else-if="error" class="text-error-large">
      ❌ {{ error }}
    </p>

    <div v-else-if="validData" class="validation-card">
      <h2 class="text-success">✅ گواهی معتبر است (Valid Certificate)</h2>
      
      <h3 class="text-dark">نام و نام خانوادگی: {{ validData.first_name }} {{ validData.last_name }}</h3>
      <h4 class="text-muted mt-15">رویداد: {{ validData.name }}</h4>
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