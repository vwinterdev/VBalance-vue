<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { useRegisterMutation } from '../composables/useAuth'

const router = useRouter()
const { mutateAsync } = useRegisterMutation()

const errorMessage = ref('')
const isLoading = ref(false)

const registerSchema = z.object({
  name: z
    .string({ error: 'Пожалуйста, введите имя' })
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя слишком длинное'),
  email: z
    .string({ error: 'Пожалуйста, введите email' })
    .email('Введите корректный email')
    .toLowerCase()
    .trim(),
  password: z
    .string({ error: 'Пожалуйста, введите пароль' })
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(100, 'Пароль слишком длинный'),
  confirmPassword: z
    .string({ error: 'Пожалуйста, подтвердите пароль' })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword']
})

const payload = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const fieldErrors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  errorMessage.value = ''
  fieldErrors.name = ''
  fieldErrors.email = ''
  fieldErrors.password = ''
  fieldErrors.confirmPassword = ''

  const validation = registerSchema.safeParse(payload)

  if (!validation.success) {
    validation.error.issues.forEach((error) => {
      const field = error.path[0] as keyof typeof fieldErrors
      if (field in fieldErrors) {
        fieldErrors[field] = error.message
      }
    })
    
    errorMessage.value = validation.error.issues?.[0]?.message || 'Ошибка регистрации. Попробуйте снова.'
    return
  }

  isLoading.value = true

  try {
    await mutateAsync({
      email: validation.data.email,
      password: validation.data.password,
      displayName: validation.data.name
    })

    router.push({ name: 'email-verification' })
  } catch (error: any) {
    if (error.response?.data?.error) {
      errorMessage.value = error.response.data.error
    } else {
      errorMessage.value = 'Ошибка регистрации. Попробуйте снова.'
    }
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
        <div class="flex flex-col gap-2">
          <label for="name" class="font-semibold text-gray-700 dark:text-gray-300">Имя</label>
          <InputText
            id="name"
            v-model="payload.name"
            type="text"
            placeholder="Ваше имя"
            :disabled="isLoading"
            :invalid="!!fieldErrors.name"
            class="w-full"
            fluid
          />
          <small v-if="fieldErrors.name" class="text-red-500">
            {{ fieldErrors.name }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="email" class="font-semibold text-gray-700 dark:text-gray-300">Email</label>
          <InputText
            id="email"
            v-model="payload.email"
            type="email"
            placeholder="your@email.com"
            :disabled="isLoading"
            :invalid="!!fieldErrors.email"
            class="w-full"
            fluid
          />
          <small v-if="fieldErrors.email" class="text-red-500">
            {{ fieldErrors.email }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="password" class="font-semibold text-gray-700 dark:text-gray-300">Пароль</label>
          <Password
            id="password"
            v-model="payload.password"
            placeholder="Минимум 6 символов"
            toggleMask
            :disabled="isLoading"
            :invalid="!!fieldErrors.password"
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
          <small v-if="fieldErrors.password" class="text-red-500">
            {{ fieldErrors.password }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="confirmPassword" class="font-semibold text-gray-700 dark:text-gray-300">
            Подтвердите пароль
          </label>
          <Password
            id="confirmPassword"
            v-model="payload.confirmPassword"
            placeholder="Повторите пароль"
            :feedback="false"
            toggleMask
            :disabled="isLoading"
            :invalid="!!fieldErrors.confirmPassword"
            fluid
          />
          <small v-if="fieldErrors.confirmPassword" class="text-red-500">
            {{ fieldErrors.confirmPassword }}
          </small>
        </div>

        <Message v-if="errorMessage" severity="error" :closable="false">
          {{ errorMessage }}
        </Message>

        <Button
          type="submit"
          label="Зарегистрироваться"
          icon="pi pi-user-plus"
          :loading="isLoading"
          class="w-full"
          severity="success"
        />

        <div class="flex items-center gap-2 my-2">
          <div class="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span class="text-sm text-gray-500 dark:text-gray-400">или</span>
          <div class="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

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
