<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

console.log('Skills Hub Mounted')

const categories = [
  { 
    id: 'vue', 
    name: 'VUE / WEB', 
    desc: 'Vue 3, Vite, Pinia Ecosystem / HTML5, CSS3, Vanilla JS',
    path: '/skills/vue',
    color: 'text-retro-primary border-retro-primary'
  },
  // { 
  //   id: 'web', 
  //   name: 'WEB_CORE', 
  //   desc: 'HTML5, CSS3, Vanilla JS',
  //   path: '/skills/web',
  //   color: 'text-retro-amber border-retro-amber'
  // },
  { 
    id: 'flutter', 
    name: 'FLUTTER_UI', 
    desc: 'Cross-platform Mobile Dev',
    path: '/skills/flutter',
    color: 'text-retro-blue border-retro-blue'
  },
  { 
    id: 'security', 
    name: 'SEC_NET', 
    desc: 'Cybersecurity & Network Ops',
    path: '/skills/security',
    color: 'text-retro-red border-retro-red'
  },
]

const navigateTo = (path: string) => {
  console.log('Navigating to:', path)
  router.push(path)
}
</script>

<template>
  <div class="max-w-6xl mx-auto h-full flex flex-col justify-center">
    <h2 class="text-3xl md:text-5xl mb-6 text-center text-glow animate-pulse">
      相关技能
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
      <div 
        v-for="cat in categories" 
        :key="cat.id"
        @click="navigateTo(cat.path)"
        class="border-4 p-6 cursor-pointer hover:bg-white/5 transition-all duration-300 group relative overflow-hidden"
        :class="cat.color"
      >
        <!-- Hover Effect Background -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-10 bg-current transition-opacity"></div>
        
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-2xl font-bold group-hover:translate-x-2 transition-transform">
            [{{ cat.name }}]
          </h3>
          <span class="text-xl opacity-50 group-hover:opacity-100">></span>
        </div>
        
        <p class="text-lg opacity-80 font-mono">
          {{ cat.desc }}
        </p>

        <!-- Corner Accents -->
        <div class="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-current"></div>
        <div class="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-current"></div>
        <div class="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-current"></div>
        <div class="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-current"></div>
      </div>
    </div>

    <div class="mt-6 text-center font-mono text-sm opacity-50">
      <p></p>
    </div>
  </div>
</template>
