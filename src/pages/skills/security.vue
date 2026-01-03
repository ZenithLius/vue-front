<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center mb-8">
      <button @click="router.push('/skills')" class="mr-4 text-retro-red hover:text-retro-primary text-xl">
        < [BACK]
      </button>
      <h2 class="text-4xl border-b-4 border-retro-red pr-8 text-retro-red">
        SECURITY_OPS
      </h2>
    </div>

    <div class="border-2 border-retro-red border-dashed p-12 text-center">
      <h3 class="text-2xl text-retro-red mb-4">ACCESS_RESTRICTED</h3>
      <p class="opacity-70 font-mono">Security demos classified. Authorization pending...</p>
    </div>
  </div>
</template>
