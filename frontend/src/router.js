import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import Certificates from './views/Certificates.vue';
import CertificateView from './views/CertificateView.vue';
import Validate from './views/Validate.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/certificates', component: Certificates },
  { path: '/certificate/:id', component: CertificateView },
  { path: '/validate/:hash', component: Validate}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;