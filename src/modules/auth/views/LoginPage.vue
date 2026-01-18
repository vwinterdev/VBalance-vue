<script setup lang="ts">

import { useRouter } from 'vue-router'
import { SchemasZod } from '@/modules/common/services/schemasZod'
import { useLoginMutation } from '../composables/useAuth'
import { useField } from 'vee-validate';
import { Routes } from '@/router/routes'

const router = useRouter()

const { mutateAsync, isPending, error } = useLoginMutation()

const { value: emailValue, errorMessage: emailErrorMessage } = useField('email', SchemasZod.email)
const { value: passwordValue, errorMessage: passwordErrorMessage } = useField('password', SchemasZod.password)

const handleLogin = async () => {
    const result = await mutateAsync({
      email: emailValue.value,
      password: passwordValue.value,
    })
    console.log(result)
    router.push(Routes.TRANSACTIONS)

}

const goToRegister = () => {
  router.push(Routes.REGISTER)
}
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
          <div class="flex flex-col gap-2">
            <label for="email" class="font-semibold text-gray-700 dark:text-gray-300">Email</label>
            <InputText
              id="email"
              v-model="emailValue"
              placeholder="your@email.com"
              class="w-full"
              fluid
            />
            <Message size="small" severity="error" variant="simple">{{emailErrorMessage}}</Message>
          </div>

          <div class="flex flex-col gap-2">
            <label for="password" class="font-semibold text-gray-700 dark:text-gray-300">Пароль</label>
            <Password
              id="password"
              v-model="passwordValue"
              placeholder="Введите пароль"
              :feedback="false"
              toggleMask
              :disabled="isPending"
              fluid
            />
            <Message size="small" severity="error" variant="simple">{{passwordErrorMessage}}</Message>
          </div>

          <Message v-if="error" severity="error" :closable="false">
            {{error}}
          </Message>

          <Button
            type="submit"
            label="Войти"
            icon="pi pi-sign-in"
            :loading="isPending"
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
            label="Создать аккаунт"
            icon="pi pi-user-plus"
            outlined
            class="w-full"
            @click="goToRegister"
          />
        </form>
      </template>
    </Card>
</template>

