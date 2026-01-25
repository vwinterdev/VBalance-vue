<!-- vue/src/modules/wallet/components/WalletCard.vue -->

<script setup lang="ts">
import { type Wallet } from '../adapters/Wallet'
import { roleToDisplay } from '../utils/roleToDisplay'

interface Props {
  wallet: Wallet
}

defineProps<Props>()
</script>

<template>
  <Card class="cursor-pointer hover:shadow-lg transition-shadow">
    <template #content>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- Icon -->
          <div 
            class="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            :style="{ backgroundColor: wallet.color }"
          >
            {{ wallet.icon }}
          </div>

          <!-- Info -->
          <div>
            <h3 class="text-xl font-semibold">
              {{ wallet.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ roleToDisplay(wallet.role) }}
            </p>
          </div>
        </div>

        <!-- Balance -->
        <div class="text-right">
          <p class="text-2xl font-bold" :style="{ color: wallet.color }">
            {{ wallet.balance }}
          </p>
          <p class="text-sm">
            {{ wallet.currency }}
          </p>
        </div>
      </div>
    </template>
  </Card>
</template>
