// import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // for all icons
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { createApp } from 'vue'
import App from './App.vue'
import router from './routes';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia)
app.mount('#app')
