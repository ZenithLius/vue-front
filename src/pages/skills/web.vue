<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const demos = [
  {
    id: 'css',
    name: 'CSS_FX_LIBRARY',
    desc: 'Advanced CSS3 Animations & Effects',
    path: '/demos/css-showcase'
  }
]
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center mb-8">
      <button @click="router.push('/skills')" class="mr-4 text-retro-amber hover:text-retro-primary text-xl">
        < [BACK]
      </button>
      <h2 class="text-4xl border-b-4 border-retro-amber pr-8 text-retro-amber">
        WEB_CORE_SYSTEMS
      </h2>
    </div>

    <div class="grid gap-6">
      <div 
        v-for="demo in demos" 
        :key="demo.id"
        @click="router.push(demo.path)"
        class="border-2 border-retro-amber p-6 cursor-pointer hover:bg-retro-amber/10 transition-colors flex justify-between items-center group"
      >
        <div>
          <h3 class="text-2xl mb-2 text-retro-amber group-hover:text-glow">{{ demo.name }}</h3>
          <p class="opacity-70 font-mono text-retro-amber">{{ demo.desc }}</p>
        </div>
        <span class="text-2xl text-retro-amber opacity-0 group-hover:opacity-100 transition-opacity">>></span>
      </div>
    </div>
  </div>
</template>
