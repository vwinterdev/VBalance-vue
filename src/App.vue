<script setup lang="ts">
import { useMeQuery } from './modules/auth/composables/useAuth'

const {} = useMeQuery()
</script>

<template>
  <RouterView />
</template>


<style scoped></style>
