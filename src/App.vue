<script setup lang="ts">
import { useMeQuery } from './modules/auth/composables/useAuth';


const { data } = useMeQuery()

</script>

<template>
  <RouterView />
</template>

<style scoped></style>
