<script setup lang="ts">
import { ref, provide } from 'vue'
import { useRouter } from 'vue-router'
import Drawer from 'primevue/drawer'
import { Routes } from '@/router/routes'

const router = useRouter()
const drawerVisible = ref(false)

const navigateToHome = () => {
  drawerVisible.value = false
  router.push({ name: Routes.HOME.name })
}

const navigateToTransactions = () => {
  drawerVisible.value = false
  router.push({ name: Routes.TRANSACTIONS.name })
}

const navigateToCategories = () => {
  drawerVisible.value = false
  router.push({ name: Routes.CATEGORIES.name })
}

const navigateToProfile = () => {
  drawerVisible.value = false
  router.push({ path: Routes.PROFILE.path })
}

const openDrawer = () => {
  drawerVisible.value = true
}

// Provide drawer control to child components
provide('openDrawer', openDrawer)
provide('closeDrawer', () => { drawerVisible.value = false })
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Drawer v-model:visible="drawerVisible" header="Меню">
      <ul class="list-none p-0 m-0">
        <li>
          <a
            @click="navigateToHome"
            class="flex items-center cursor-pointer p-4 rounded text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <i class="pi pi-home mr-3 text-lg"></i>
            <span class="font-medium">Главная</span>
          </a>
        </li>
        <li>
          <a
            @click="navigateToTransactions"
            class="flex items-center cursor-pointer p-4 rounded text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <i class="pi pi-list mr-3 text-lg"></i>
            <span class="font-medium">Все транзакции</span>
          </a>
        </li>
        <li>
          <a
            @click="navigateToCategories"
            class="flex items-center cursor-pointer p-4 rounded text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <i class="pi pi-tag mr-3 text-lg"></i>
            <span class="font-medium">Категории</span>
          </a>
        </li>
        <li>
          <a
            @click="navigateToProfile"
            class="flex items-center cursor-pointer p-4 rounded text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <i class="pi pi-user mr-3 text-lg"></i>
            <span class="font-medium">Профиль</span>
          </a>
        </li>
      </ul>
    </Drawer>

    <router-view />
  </div>
</template>
