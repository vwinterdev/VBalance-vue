<script setup lang="ts">
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Card from 'primevue/card';


const router = useRouter();


const goToLogin = () => {
  router.push({ name: 'login' });
};

const goToRegister = () => {
  router.push({ name: 'register' });
};

const handleLogout = () => {
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
    
  </div>
</template>

