<template>
  <div class="page-container">
    <button @click="router.back()" class="btn-secondary">
      بازگشت
    </button>

    <div v-if="loading">در حال بارگذاری... (Loading...)</div>
    
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
      bakeTextIntoImage(data.data);
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


    ctx.font = '30px monospace';
    ctx.fillStyle = '#777777';
    const hashX = data.hash_x;
    const hashY = data.hash_y;
    ctx.fillText(data.hash, hashX, hashY);

    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'right'; 
    ctx.textBaseline = 'bottom'; 
    const nameX = data.name_x;
    const nameY = data.name_y;
    const fullName = `${data.first_name} ${data.last_name}`;
    ctx.fillText(fullName, nameX, nameY);

    try {
      const domain = window.location.origin; 
      const validationUrl = `${domain}/validate/${data.hash}`;
      
      const qrDataUrl = await QRCode.toDataURL(validationUrl, {
        width: 150, 
        margin: 1,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#000000',
          light: '#0000'
        }
      });

      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, data.qrcode_x, data.qrcode_y, 150, 150);
        
        const logoImg = new Image();
        logoImg.onload = () => {
          const logoSize = 80;
          const logoX = data.qrcode_x + (150 / 2) - (logoSize / 2);
          const logoY = data.qrcode_y + (150 / 2) - (logoSize / 2);
          
          ctx.fillStyle = '#0000'; 
          ctx.fillRect(logoX - 2, logoY - 2, logoSize + 4, logoSize + 4);
          
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

          finalImageUrl.value = canvas.toDataURL('image/png');
        };
        logoImg.src = '/images/logo.png'; 
      };
      qrImg.src = qrDataUrl;

    } catch (err) {
      console.error('خطا در تولید QR Code:', err);
      finalImageUrl.value = canvas.toDataURL('image/png');
    }
  };

  img.onerror = () => {
    error.value = 'خطا در بارگذاری تصویر پس‌زمینه.';
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