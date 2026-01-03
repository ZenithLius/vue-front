<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center mb-8">
      <button @click="router.push('/skills')" class="mr-4 text-retro-blue hover:text-retro-primary text-xl">
        < [BACK]
      </button>
      <h2 class="text-4xl border-b-4 border-retro-blue pr-8 text-retro-blue">
        FLUTTER_MODULES
      </h2>
    </div>

    <div class="border-2 border-retro-blue border-dashed p-12 text-center">
      <h3 class="text-2xl text-retro-blue mb-4">NO_MODULES_LOADED</h3>
      <p class="opacity-70 font-mono">Flutter demos coming soon...</p>
    </div>
  </div>
</template>
