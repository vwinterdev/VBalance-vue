<script setup lang="ts">
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import { ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { useUploadImageMutation } from '@/modules/common/composables/useUpload'
import { useCreateProfileMutation } from '../composables/useProfile'

const avatar = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)

const { mutateAsync } = useUploadImageMutation()
const { mutateAsync: createProfileMutation } = useCreateProfileMutation()

const createProfileParams = shallowRef({
  firstName: '',
  lastName: '',
  avatarPath: '',
})

const onFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    avatar.value = file
    const reader = new FileReader()
    reader.onload = async (e) => {
      avatarPreview.value = e.target?.result as string
      console.log(file)
      const response = await mutateAsync(file)

      createProfileParams.value.avatarPath = response.url
    }
    reader.readAsDataURL(file)
  }
}

const handleCreateProfile = async () => {
  await createProfileMutation(createProfileParams.value)
}
</script>

<template>
  <Card class="w-full max-w-md shadow-2xl">
      <template #header>
        <div class="text-center pt-8 pb-4">
          <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Создание профиля</h1>
          <p class="text-gray-600 dark:text-gray-400">Расскажите немного о себе</p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="handleCreateProfile" class="flex flex-col gap-5">
          <div class="flex justify-center">
            <div class="flex flex-col items-center gap-3">
              <Avatar
                v-if="avatarPreview"
                :image="avatarPreview"
                size="xlarge"
                shape="circle"
                class="w-32 h-32"
              />
              <Avatar
                v-else
                icon="pi pi-user"
                size="xlarge"
                shape="circle"
                class="w-32 h-32 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
              />
              
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                @change="onFileSelect"
                style="display: none;"
              />
              <label for="avatar-upload">
                <Button
                  as="span"
                  type="button"
                  label="Выбрать фото"
                  icon="pi pi-upload"
                  size="small"
                  outlined
                />
              </label>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label for="firstName" class="font-semibold text-gray-700 dark:text-gray-300">Имя</label>
            <InputText
              id="firstName"
              v-model.trim="createProfileParams.firstName"
              type="text"
              placeholder="Введите ваше имя"
         
              class="w-full"
              fluid
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="lastName" class="font-semibold text-gray-700 dark:text-gray-300">Фамилия</label>
            <InputText
              id="lastName"
              v-model.trim="createProfileParams.lastName"
              type="text"
              placeholder="Введите вашу фамилию"
              :disabled="isLoading"
              class="w-full"
              fluid
            />
          </div>


          <Button
            type="submit"
            label="Создать профиль"
            icon="pi pi-check"
 
            class="w-full"
            severity="success"
          />
        </form>
      </template>
    </Card>
</template>

