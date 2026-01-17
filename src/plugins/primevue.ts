import Material from '@primeuix/themes/material'
import PrimeVue from 'primevue/config'
import type { App } from 'vue'

export function installPrimeVue(app: App) {
  app.use(PrimeVue, {
    theme: {
      preset: Material,
      options: {
        darkModeSelector: '.app-dark',
      },
    },
  })
}
