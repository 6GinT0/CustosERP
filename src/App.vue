<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useDatabase } from '@/composables/useDatabase'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const { loadInitialData } = useDatabase()

onMounted(async () => {
  await loadInitialData()
})
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>
