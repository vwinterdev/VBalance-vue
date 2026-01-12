import { createApp } from 'vue';

import App from './App.vue';
import { installPrimeVue } from './plugins/primevue';
import vueQuery from './plugins/vue-query';
import router from './router';
import './style.css';

const app = createApp(App);
app.use(router);
app.use(vueQuery);
installPrimeVue(app);
app.mount('#app');
