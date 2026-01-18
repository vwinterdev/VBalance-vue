<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push({ name: 'login' })
}
</script>

<template>
  <Card class="w-full max-w-md shadow-2xl">
      <template #header>
        <div class="text-center pt-8 pb-4">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <i class="pi pi-envelope text-4xl text-green-600 dark:text-green-400"></i>
            </div>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Подтвердите email</h1>
        </div>
      </template>

      <template #content>
        <div class="flex flex-col gap-5">
          <Message severity="success" :closable="false">
            Регистрация прошла успешно!
          </Message>

          <div class="text-center text-gray-700 dark:text-gray-300">
            <p class="mb-4">
              Мы отправили письмо с подтверждением на вашу почту.
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Пожалуйста, проверьте входящие сообщения и перейдите по ссылке для активации аккаунта.
            </p>
          </div>

          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div class="flex gap-3">
              <i class="pi pi-info-circle text-blue-600 dark:text-blue-400 mt-0.5"></i>
              <div class="text-sm text-blue-800 dark:text-blue-300">
                <p class="font-semibold mb-1">Не пришло письмо?</p>
                <ul class="list-disc list-inside space-y-1">
                  <li>Проверьте папку "Спам"</li>
                  <li>Убедитесь, что указали правильный email</li>
                  <li>Письмо может прийти в течение нескольких минут</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            type="button"
            label="Перейти к авторизации"
            icon="pi pi-sign-in"
            class="w-full"
            severity="success"
            @click="goToLogin"
          />
        </div>
      </template>
    </Card>
</template>

