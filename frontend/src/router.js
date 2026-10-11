import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import Certificates from './views/Certificates.vue';
import CertificateView from './views/CertificateView.vue';
import Validate from './views/Validate.vue'
import Calibrate from './views/Calibrate.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/certificates', component: Certificates },
  { path: '/certificate/:id', component: CertificateView },
  { path: '/validate/:hash', component: Validate},
  { path: '/calibrate', component: Calibrate}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;