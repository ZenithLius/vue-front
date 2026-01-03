<script setup lang="ts">
import { ref, onMounted } from 'vue'

const lines = [
  'INITIALIZING SYSTEM...',
  'LOADING KERNEL...',
  'MOUNTING FILESYSTEM...',
  'CHECKING MEMORY... OK',
  'LOADING USER PROFILE...',
  'ACCESS GRANTED.',
  'WELCOME TO MY PORTFOLIO.'
]

const displayedLines = ref<string[]>([])
const showContent = ref(false)

const typeLines = async () => {
  for (const line of lines) {
    displayedLines.value.push(line)
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400))
  }
  setTimeout(() => {
    showContent.value = true
    localStorage.setItem('boot_sequence_shown', 'true')
  }, 500)
}

onMounted(() => {
  const hasSeenBoot = localStorage.getItem('boot_sequence_shown')
  
  if (hasSeenBoot) {
    showContent.value = true
  } else {
    typeLines()
  }
})
</script>

<template>
  <div class="h-full flex flex-col justify-center max-w-4xl mx-auto">
    <!-- Boot Sequence -->
    <div v-if="!showContent" class="font-mono text-lg space-y-2">
      <div v-for="(line, index) in displayedLines" :key="index" class="text-retro-primary">
        <span class="text-retro-amber">root@SYSTEM:~$</span> {{ line }}
      </div>
      <div class="animate-pulse">_</div>
    </div>

    <!-- Main Content -->
    <div v-else class="animate-in fade-in zoom-in duration-1000">
      <div class="border-4 border-retro-primary p-8 bg-black/40 relative overflow-hidden group">
        <div class="absolute inset-0 bg-retro-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        
        <h2 class="text-4xl md:text-6xl mb-6 text-retro-blue text-glow">
          HI
        </h2>
        
        <div class="space-y-6 text-xl md:text-2xl leading-relaxed relative z-10">
          <p>
            I am a <span class="text-retro-amber">Frontend Developer</span> & 
            <span class="text-retro-red">Security Enthusiast</span>.
          </p>
          <p>
            Specializing in:
            <span class="inline-block bg-retro-primary text-retro-bg px-2 mx-1">Vue.js</span>
            <span class="inline-block bg-retro-blue text-retro-bg px-2 mx-1">Flutter</span>
            <span class="inline-block bg-retro-red text-retro-bg px-2 mx-1">CyberSec</span>
          </p>
          
          <div class="pt-8 flex gap-4">
            <router-link to="/skills" class="btn-retro">
              [VIEW_SKILLS]
            </router-link>
            <router-link to="/css-showcase" class="btn-retro">
              [EXPLORE_VISUALS]
            </router-link>
          </div>
        </div>
      </div>

      <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="border border-retro-primary p-4 hover:bg-retro-primary/10 transition-colors cursor-pointer">
          <h3 class="text-retro-amber mb-2">LATEST_LOG</h3>
          <p class="text-sm opacity-80">Updated CSS animation module. Optimized rendering engine.</p>
        </div>
        <div class="border border-retro-primary p-4 hover:bg-retro-primary/10 transition-colors cursor-pointer">
          <h3 class="text-retro-amber mb-2">STATUS</h3>
          <p class="text-sm opacity-80">All systems operational. 0 errors found.</p>
        </div>
        <div class="border border-retro-primary p-4 hover:bg-retro-primary/10 transition-colors cursor-pointer">
          <h3 class="text-retro-amber mb-2">CONTACT</h3>
          <p class="text-sm opacity-80">Open for new missions. Signal strength: 100%</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-retro {
  @apply border-2 border-retro-primary px-6 py-2 text-xl hover:bg-retro-primary hover:text-retro-bg transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,65,0.6)];
}
</style>
