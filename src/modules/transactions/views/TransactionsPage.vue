<script setup lang="ts">
import Chart from 'primevue/chart'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

onMounted(() => {
  chartData.value = setChartData()
})

const chartData = ref()

const setChartData = () => {
  return {
    datasets: [
      {
        data: [1000, 2000, 3000],
        backgroundColor: ['#0275d8', '#5cb85c', '#5bc0de']
      }
    ]
  }
}

const router = useRouter()

const addTransaction = () => {
  router.push({ name: 'create-transaction' })
}

const openSettings = () => {
  console.log('Open settings')
}
</script>

<template>
  <div class="min-h-screen flex flex-col pb-20">
    <main class="flex-1 p-4">
      <div class="flex justify-center">
        <div class="relative w-full md:w-[30rem]">
          <Chart type="doughnut" :data="chartData" class="w-full" />
          <div class="absolute inset-0 flex items-center justify-center">
            <h1 class="text-4xl font-bold">+20300</h1>
          </div>
        </div>
      </div>
    </main>

    <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div class="flex items-center justify-between px-8 py-4">
        <Avatar
          icon="pi pi-user"
          shape="circle"
          class="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
        />
        
        <Button
          icon="pi pi-plus"
          rounded
          size="large"
          severity="success"
          @click="addTransaction"
          class="w-14 h-14"
        />
        
        <Button
          icon="pi pi-cog"
          text
          rounded
          @click="openSettings"
        />
      </div>
    </nav>
  </div>
</template>

