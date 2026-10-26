<template>
  <div class="page-container">
    <button @click="router.back()" class="btn-secondary">
      بازگشت
    </button>

    <div v-if="loading" class="loading-container">
      <p class="text-dark" style="margin-bottom: 15px; font-weight: bold;">در حال آماده‌سازی گواهی...</p>
      <div class="progress-bar">
        <div class="progress-bar-fill"></div>
      </div>
    </div>
    
    <p v-else-if="error" class="text-error">{{ error }}</p>

    <div v-else-if="finalImageUrl" class="detail-card">
      <img :src="finalImageUrl" alt="Official Certificate" class="event-image" />
      
      <div class="mt-20">
        <button @click="downloadPDF" class="btn-primary" style="width: 100%; max-width: 300px; font-size: 1.1rem;">
          دانلود گواهی
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

const route = useRoute();
const router = useRouter();

const certData = ref(null);
const error = ref('');
const loading = ref(true);
const finalImageUrl = ref('');

const certWidth = ref(0);
const certHeight = ref(0);

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
      
      // CRITICAL UPDATE: Wait for the custom Abar fonts to load before drawing
      document.fonts.ready.then(() => {
        bakeTextIntoImage(data.data);
      });
      
    } else {
      error.value = data.message;
      loading.value = false;
    }
  } catch (err) {
    error.value = 'خطا در ارتباط با سرور.';
    console.log(err);
    loading.value = false;
  }
});

const bakeTextIntoImage = (data) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const img = new Image();
  img.crossOrigin = "Anonymous"; 
  img.src = data.image; 

  img.onload = async () => {
    certWidth.value = img.width;
    certHeight.value = img.height;
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imgW = img.width;
    const imgH = img.height;

    const hashX = (data.hash_x / 100) * imgW;
    const hashY = (data.hash_y / 100) * imgH;
    const hashFontSize = (data.hash_font_size / 100) * imgW;
    
    // UPDATE: Apply Abar Mid to the hash
    ctx.font = `${hashFontSize}px 'Abar Mid', monospace`;
    ctx.fillStyle = '#777777';
    ctx.fillText(data.hash, hashX, hashY);

    const nameX = (data.name_x / 100) * imgW;
    const nameY = (data.name_y / 100) * imgH;
    const nameFontSize = (data.name_font_size / 100) * imgW;
    
    // UPDATE: Apply Abar Mid to the name
    ctx.font = `bold ${nameFontSize}px 'Abar Mid', sans-serif`;
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'right'; 
    ctx.textBaseline = 'bottom'; 
    
    const fullName = `${data.first_name} ${data.last_name}`;
    ctx.fillText(fullName, nameX, nameY);

    try {
      const domain = window.location.origin; 
      const validationUrl = `${domain}/validate/${data.hash}`;
      
      const qrSize = (data.qrcode_size / 100) * imgW;
      const qrX = (data.qrcode_x / 100) * imgW;
      const qrY = (data.qrcode_y / 100) * imgH;

      const qrDataUrl = await QRCode.toDataURL(validationUrl, {
        width: qrSize, 
        margin: 1,
        errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#0000' }
      });

      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
        
        const logoImg = new Image();
        logoImg.onload = () => {
          const logoSize = qrSize * 0.26; 
          const centerX = qrX + (qrSize / 2);
          const centerY = qrY + (qrSize / 2);
          const logoX = centerX - (logoSize / 2);
          const logoY = centerY - (logoSize / 2);
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, (logoSize / 2) + (qrSize * 0.02), 0, 2 * Math.PI); 
          ctx.fillStyle = '#ffffff'; 
          ctx.fill();
          
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

          finalImageUrl.value = canvas.toDataURL('image/png');
          loading.value = false;
        };
        logoImg.onerror = () => {
          finalImageUrl.value = canvas.toDataURL('image/png');
          loading.value = false;
        };
        logoImg.src = '/images/logo.png'; 
      };
      qrImg.onerror = () => {
         finalImageUrl.value = canvas.toDataURL('image/png');
         loading.value = false;
      }
      qrImg.src = qrDataUrl;

    } catch (err) {
      console.error('خطا در تولید QR Code:', err);
      finalImageUrl.value = canvas.toDataURL('image/png');
      loading.value = false;
    }
  };

  img.onerror = () => {
    error.value = 'خطا در بارگذاری تصویر پس‌زمینه.';
    loading.value = false;
  };
};

const downloadPDF = () => {
  if (!finalImageUrl.value) return;
  const orientation = certWidth.value > certHeight.value ? 'landscape' : 'portrait';
  const doc = new jsPDF({
    orientation: orientation,
    unit: 'px',
    format: [certWidth.value, certHeight.value]
  });
  doc.addImage(finalImageUrl.value, 'PNG', 0, 0, certWidth.value, certHeight.value);
  const fileName = `Certificate_${certData.value.first_name}_${certData.value.last_name}.pdf`;
  doc.save(fileName);
};
</script>

<style scoped>
.loading-container {
  max-width: 400px;
  margin: 60px auto;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--border);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  width: 40%;
  background-color: var(--accent);
  border-radius: 4px;
  position: absolute;
  left: 0;
  top: 0;
  animation: slide 1.5s ease-in-out infinite;
}

@keyframes slide {
  0% {
    left: -40%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: -40%;
  }
}
</style>