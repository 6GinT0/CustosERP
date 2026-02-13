<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useDatabase } from '@/composables/useDatabase'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useMessages } from './composables/useMessages'

const { loadInitialData } = useDatabase()
const { queue } = useMessages()

onMounted(async () => {
  await loadInitialData()
})
</script>

<template>
  <DefaultLayout>
    <RouterView />

    <v-snackbar-queue v-model="queue"></v-snackbar-queue>
  </DefaultLayout>
</template>
