import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import Certificates from './views/Certificates.vue';
import CertificateView from './views/CertificateView.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/certificates', component: Certificates },
  { path: '/certificate/:id', component: CertificateView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;