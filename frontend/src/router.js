import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import Certificates from './views/Certificates.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/certificates', component: Certificates }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;