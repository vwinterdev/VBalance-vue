import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import type { App } from 'vue';

export function installPrimeVue(app: App) {
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.app-dark',
      },
    },
  });
}

