<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDatabase } from './composables/useDatabase'
import { useMessages } from './composables/useMessages'
import { RouterView, useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'

const route = useRoute()
const { loadInitialData } = useDatabase()
const { queue } = useMessages()

const layout = computed(() => {
  return route.meta.layout === 'none' ? 'div' : DefaultLayout
})

onMounted(async () => {
  await loadInitialData()
})
</script>

<template>
  <component :is="layout">
    <RouterView />

    <v-snackbar-queue v-model="queue"></v-snackbar-queue>
  </component>
</template>
