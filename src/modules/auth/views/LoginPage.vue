<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Message from 'primevue/message';

import { useLoginMutation } from '../composables/useAuth';

const router = useRouter();

const { mutateAsync } = useLoginMutation()

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  
  // Валидация
  if (!email.value || !password.value) {
    errorMessage.value = 'Пожалуйста, заполните все поля';
    return;
  }

  if (!email.value.includes('@')) {
    errorMessage.value = 'Введите корректный email';
    return;
  }

  isLoading.value = true;

  try {
    await mutateAsync({
      email: email.value,
      password: password.value,
    });
    
    // После успешной авторизации перенаправляем на главную
    router.push({ name: 'home' });
  } catch (error) {
    errorMessage.value = 'Ошибка авторизации. Проверьте данные и попробуйте снова.';
  } finally {
    isLoading.value = false;
  }
};

const goToRegister = () => {
  router.push({ name: 'register' });
};
</script>

<template>
  <Card class="w-full max-w-md shadow-2xl">
      <template #header>
        <div class="text-center pt-8 pb-4">
          <h1 class="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">VBalance</h1>
          <p class="text-gray-600 dark:text-gray-400">Войдите в свой аккаунт</p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
          <!-- Email -->
          <div class="flex flex-col gap-2">
            <label for="email" class="font-semibold text-gray-700 dark:text-gray-300">Email</label>
            <InputText
              id="email"
              v-model="email"
              type="email"
              placeholder="your@email.com"
              :disabled="isLoading"
              class="w-full"
              fluid
            />
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-2">
            <label for="password" class="font-semibold text-gray-700 dark:text-gray-300">Пароль</label>
            <Password
              id="password"
              v-model="password"
              placeholder="Введите пароль"
              :feedback="false"
              toggleMask
              :disabled="isLoading"
              fluid
            />
          </div>

          <!-- Error Message -->
          <Message v-if="errorMessage" severity="error" :closable="false">
            {{ errorMessage }}
          </Message>

          <!-- Login Button -->
          <Button
            type="submit"
            label="Войти"
            icon="pi pi-sign-in"
            :loading="isLoading"
            class="w-full"
            severity="success"
          />

          <!-- Divider -->
          <div class="flex items-center gap-2 my-2">
            <div class="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span class="text-sm text-gray-500 dark:text-gray-400">или</span>
            <div class="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          <!-- Register Link -->
          <Button
            type="button"
            label="Создать аккаунт"
            icon="pi pi-user-plus"
            outlined
            class="w-full"
            @click="goToRegister"
          />
        </form>
      </template>

      <template #footer>
        <div class="text-center text-sm text-gray-500 dark:text-gray-400">
          <a href="#" class="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
            Забыли пароль?
          </a>
        </div>
      </template>
    </Card>
</template>

