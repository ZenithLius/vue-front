<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const menuItems = [
  { name: 'HOME', path: '/' },
  { name: 'SKILLS', path: '/skills' },
  { name: 'DATA_SCREEN', path: '/data-screen' },
]

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// Theme Switching Logic
const themes = [
  { char: 'S', color: '#00ff41', name: 'Green', bg: '#0a0a0a' },
  { char: 'Y', color: '#ffb000', name: 'Amber', bg: '#1a1100' },
  { char: 'S', color: '#ff0033', name: 'Red', bg: '#1a0005' },
  { char: 'T', color: '#00f0ff', name: 'Blue', bg: '#001a1d' },
  { char: 'E', color: '#ff00ff', name: 'Magenta', bg: '#1a001a' },
  { char: 'M', color: '#bfff00', name: 'Lime', bg: '#121a00' },
  { char: '_', color: '#ffffff', name: 'White', bg: '#1a1a1a' },
  { char: 'R', color: '#ff4d00', name: 'Orange', bg: '#1a0800' },
  { char: 'E', color: '#ad00ff', name: 'Purple', bg: '#11001a' },
  { char: 'A', color: '#00ff9d', name: 'Mint', bg: '#001a10' },
  { char: 'D', color: '#ffff00', name: 'Yellow', bg: '#1a1a00' },
  { char: 'Y', color: '#0099ff', name: 'Sky', bg: '#00101a' },
]

const setTheme = (theme: typeof themes[0]) => {
  const root = document.documentElement
  root.style.setProperty('--retro-primary', theme.color)
  root.style.setProperty('--retro-bg', theme.bg)
  
  // Dispatch custom event for canvas/charts to update
  window.dispatchEvent(new CustomEvent('theme-change', { 
    detail: { color: theme.color, bg: theme.bg } 
  }))
}
</script>

<template>
  <div class="min-h-screen bg-retro-bg text-retro-primary font-retro relative overflow-hidden selection:bg-retro-primary selection:text-retro-bg">
    <!-- CRT Overlay Effects -->
    <div class="scanlines"></div>
    <div class="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>
    
    <!-- Main Container -->
    <div class="relative z-10 w-full px-2 py-2 h-screen flex flex-col">
      
      <!-- Header -->
      <header class="border-b-2 border-retro-primary pb-1 mb-1 flex justify-between items-end shrink-0">
        <div>
          <h1 class="text-2xl md:text-4xl font-pixel select-none flex gap-1">
            <span 
              v-for="(t, i) in themes" 
              :key="i"
              @click="setTheme(t)"
              class="cursor-pointer hover:scale-110 transition-transform duration-200 inline-block text-glow"
              :style="{ color: t.color }"
            >
              {{ t.char }}
            </span>
          </h1>
          <p class="text-retro-primary/80 mt-1 text-xs">:: WELCOME USER :: {{ new Date().toLocaleDateString() }} ::</p>
        </div>
        
        <!-- Desktop Menu -->
        <nav class="hidden md:flex gap-6">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path" 
            :to="item.path"
            class="hover:bg-retro-primary hover:text-retro-bg px-2 py-1 transition-colors duration-200"
            :class="{ 'bg-retro-primary text-retro-bg': route.path === item.path }"
          >
            [{{ item.name }}]
          </router-link>
        </nav>

        <!-- Mobile Menu Button -->
        <button @click="toggleMenu" class="md:hidden text-2xl border-2 border-retro-primary px-2 hover:bg-retro-primary hover:text-retro-bg">
          [MENU]
        </button>
      </header>

      <!-- Mobile Menu Overlay -->
      <div v-if="isMenuOpen" class="md:hidden absolute inset-0 bg-retro-bg z-50 flex flex-col items-center justify-center gap-8 border-4 border-retro-primary m-4">
        <button @click="toggleMenu" class="absolute top-4 right-4 text-2xl">[X]</button>
        <router-link 
          v-for="item in menuItems" 
          :key="item.path" 
          :to="item.path"
          @click="toggleMenu"
          class="text-2xl hover:text-retro-primary/70"
          :class="{ 'text-retro-primary underline': route.path === item.path }"
        >
          {{ item.name }}
        </router-link>
      </div>

      <!-- Content Area -->
      <main class="flex-1 overflow-auto border-2 border-retro-primary/50 p-2 shadow-[0_0_15px_rgba(0,0,0,0.5)] bg-black/20 backdrop-blur-sm relative box-glow">
        <slot></slot>
      </main>

      <!-- Footer -->
      <footer class="mt-1 text-center text-sm text-retro-primary/60 shrink-0">
        <p>TERMINAL_ID: 80S-RETRO-V1.0 | STATUS: ONLINE</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.router-link-active {
  text-shadow: 0 0 8px currentColor;
}
</style>
