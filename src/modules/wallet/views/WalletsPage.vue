<!-- vue/src/modules/wallet/views/WalletsPage.vue -->

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWalletsQuery } from '../composables/useWallets'
import WalletCard from '../components/WalletCard.vue'
import CreateWalletDialog from '../components/CreateWalletDialog.vue'

const router = useRouter()
const { data: wallets, isLoading, error } = useWalletsQuery()

const showCreateDialog = ref(false)

const openWallet = (walletId: number) => {
  router.push({ name: 'wallet-detail', params: { id: walletId } })
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">
        Мои кошельки
      </h1>
      <Button
        label="Добавить кошелек"
        icon="pi pi-plus"
        @click="showCreateDialog = true"
      />
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <ProgressSpinner />
    </div>

    <!-- Error -->
    <Message v-else-if="error" severity="error">
      Ошибка загрузки кошельков
    </Message>

    <!-- Empty State -->
    <div v-else-if="!wallets || wallets.length === 0" class="text-center py-12">
      <i class="pi pi-wallet text-6xl text-gray-400 mb-4"></i>
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        У вас пока нет кошельков
      </h2>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        Создайте свой первый кошелек для учета финансов
      </p>
      <Button
        label="Создать кошелек"
        icon="pi pi-plus"
        @click="showCreateDialog = true"
      />
    </div>

    <!-- Wallets Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="wallet in wallets"
        :key="wallet.id"
        @click="openWallet(wallet.id)"
      >
        <WalletCard :wallet="wallet" />
      </div>
    </div>

    <!-- Create Dialog -->
    <CreateWalletDialog v-model:visible="showCreateDialog" />
  </div>
</template>
