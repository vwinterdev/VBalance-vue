<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRegisterMutation } from '../composables/useAuth'

const router = useRouter()
const { mutateAsync } = useRegisterMutation()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const passwordsMatch = computed(() => {
  if (!confirmPassword.value) return true
  return password.value === confirmPassword.value
})

const handleRegister = async () => {
  errorMessage.value = ''

  // Валидация
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Пожалуйста, заполните все поля'
    return
  }

  if (!email.value.includes('@')) {
    errorMessage.value = 'Введите корректный email'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Пароль должен содержать минимум 6 символов'
    return
  }

  if (!passwordsMatch.value) {
    errorMessage.value = 'Пароли не совпадают'
    return
  }

  isLoading.value = true

  try {
    await mutateAsync({
      email: email.value,
      password: password.value,
    })

    router.push({ name: 'email-verification' })
  } catch (error) {
    errorMessage.value = 'Ошибка регистрации. Попробуйте снова.'
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  router.push({ name: 'login' })
}
</script>

<template>
  <Card class="w-full max-w-md shadow-2xl">
      <template #header>
        <div class="text-center pt-8 pb-4">
          <h1 class="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">VBalance</h1>
          <p class="text-gray-600 dark:text-gray-400">Создайте новый аккаунт</p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleRegister" class="flex flex-col gap-5">
          <!-- Name -->
          <div class="flex flex-col gap-2">
            <label for="name" class="font-semibold text-gray-700 dark:text-gray-300">Имя</label>
            <InputText
              id="name"
              v-model="name"
              type="text"
              placeholder="Ваше имя"
              :disabled="isLoading"
              class="w-full"
              fluid
            />
          </div>

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
              placeholder="Минимум 6 символов"
              toggleMask
              :disabled="isLoading"
              fluid
            >
              <template #footer>
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  <p>Рекомендации:</p>
                  <ul class="list-disc list-inside">
                    <li>Минимум 6 символов</li>
                    <li>Используйте буквы и цифры</li>
                  </ul>
                </div>
              </template>
            </Password>
          </div>

          <!-- Confirm Password -->
          <div class="flex flex-col gap-2">
            <label for="confirmPassword" class="font-semibold text-gray-700 dark:text-gray-300">
              Подтвердите пароль
            </label>
            <Password
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="Повторите пароль"
              :feedback="false"
              toggleMask
              :disabled="isLoading"
              fluid
            />
            <Message v-if="!passwordsMatch" severity="error" :closable="false" size="small">
              Пароли не совпадают
            </Message>
          </div>

          <!-- Error Message -->
          <Message v-if="errorMessage" severity="error" :closable="false">
            {{ errorMessage }}
          </Message>

          <!-- Register Button -->
          <Button
            type="submit"
            label="Зарегистрироваться"
            icon="pi pi-user-plus"
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

          <!-- Login Link -->
          <Button
            type="button"
            label="Уже есть аккаунт? Войти"
            icon="pi pi-sign-in"
            outlined
            class="w-full"
            @click="goToLogin"
          />
        </form>
      </template>
    </Card>
</template>

