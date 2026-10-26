import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import Certificates from './views/Certificates.vue';
import CertificateView from './views/CertificateView.vue';
import Validate from './views/Validate.vue'
import Calibrate from './views/Calibrate.vue';

const routes = [
  { path: '/', component: Login, name: 'Login', meta: { title: 'ورود' } },
  { path: '/certificates', component: Certificates, name: 'Certificates', meta: { title: 'گواهی‌ها' } },
  { path: '/certificate/:id', component: CertificateView, name: 'CertificateView', meta: { title: 'مشاهده گواهی' } },
  { path: '/validate/:hash', component: Validate, name: 'Validate', meta: { title: 'اعتبارسنجی گواهی' } },
  { path: '/calibrate', component: Calibrate, name: 'Calibrate', meta: { title: 'کالیبره' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;