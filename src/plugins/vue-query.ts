import { VueQueryPlugin } from '@tanstack/vue-query'
import type { App } from 'vue'

export default {
  install(app: App) {
    app.use(VueQueryPlugin)
  },
}
