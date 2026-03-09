<script setup lang="ts">
defineProps<{
  title: string
  resume: any
  icon: string
  color: string
  border: string
}>()
</script>

<template>
  <v-card flat class="pa-4 card-border bg-white" :style="'border-left: 5px solid ' + border">
    <div class="d-flex justify-space-between align-center">
      <div>
        <div class="text-overline text-grey mb-1">{{ title }}</div>
        <div class="text-h6 font-weight-black text-uppercase">{{ resume }}</div>
      </div>
      <v-icon :icon="icon" size="40" :color="color"></v-icon>
    </div>
  </v-card>
</template>

<style scoped>
.card-border {
  border: 1px solid #eeeeee;
}
</style>
