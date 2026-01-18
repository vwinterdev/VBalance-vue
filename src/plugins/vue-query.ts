import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import type { App } from 'vue'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 10,
    },
    mutations: {
      retry: 10,
    },
  },
})

export default {
  install(app: App) {
    app.use(VueQueryPlugin, {
      queryClient,
    })
  },
}

export { queryClient }
