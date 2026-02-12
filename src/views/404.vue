<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'Home' })
}

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="container">
    <h1 class="text-h1">404</h1>
    <h2 class="text-h5">Esta página no existe</h2>
    <div class="mt-4">
      <v-btn color="indigo-darken-3" flat variant="outlined" @click="goBack">Volver atrás</v-btn>
      <v-btn color="indigo-darken-3" flat @click="goHome" class="ml-2">Volver al inicio</v-btn>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100dvh - 100px);
  background: linear-gradient(
    45deg,
    #efefef 0%,
    #efefef 5%,
    transparent 5%,
    transparent 10%,
    #efefef 10%,
    #efefef 15%,
    transparent 15%,
    transparent 20%,
    #efefef 20%,
    #efefef 25%,
    transparent 25%,
    transparent 30%,
    #efefef 30%,
    #efefef 35%,
    transparent 35%,
    transparent 40%,
    #efefef 40%,
    #efefef 45%,
    transparent 45%,
    transparent 50%,
    #efefef 50%,
    #efefef 55%,
    transparent 55%,
    transparent 60%,
    #efefef 60%,
    #efefef 65%,
    transparent 65%,
    transparent 70%,
    #efefef 70%,
    #efefef 75%,
    transparent 70%,
    transparent 80%,
    #efefef 80%,
    #efefef 85%,
    transparent 85%,
    transparent 90%,
    #efefef 90%,
    #efefef 95%,
    transparent 95%
  );
  background-size: 3em 3em;
  background-color: #ffffff;
  opacity: 1;
}
</style>
