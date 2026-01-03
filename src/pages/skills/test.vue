<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="max-w-4xl mx-auto text-center">
    <div class="flex items-center mb-8 justify-center relative">
      <button @click="router.push('/skills')" class="absolute left-0 text-white hover:text-retro-primary text-xl">
        < [BACK]
      </button>
      <h2 class="text-4xl border-b-4 border-white pr-8 inline-block">
        TEST_ZONE_ALPHA
      </h2>
    </div>

    <div class="border-2 border-white p-12">
      <h3 class="text-3xl mb-4 animate-pulse">SYSTEM_CHECK_OK</h3>
      <p class="text-xl mb-8">Navigation is working correctly.</p>
      
      <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div class="bg-white/10 p-4 border border-white">
          <p class="font-bold">LATENCY</p>
          <p class="text-retro-primary">12ms</p>
        </div>
        <div class="bg-white/10 p-4 border border-white">
          <p class="font-bold">FPS</p>
          <p class="text-retro-primary">60</p>
        </div>
      </div>
    </div>
  </div>
</template>
