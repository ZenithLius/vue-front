<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()


interface Demo {
  id: string
  title: string
  description: string
  cssCode: string
  tailwindCode: string
}

const demos: Demo[] = [
  {
    id: 'neon',
    title: 'NEON_PULSE',
    description: 'CSS keyframes for pulsing glow effect.',
    cssCode: `.neon-pulse {
  width: 4rem;
  height: 4rem;
  background-color: #00f0ff;
  border-radius: 9999px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  box-shadow: 0 0 20px currentColor;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}`,
    tailwindCode: `<div class="w-16 h-16 bg-retro-blue rounded-full animate-pulse shadow-[0_0_20px_currentColor]"></div>`
  },
  {
    id: 'glitch',
    title: 'GLITCH_TXT',
    description: 'Pseudo-elements with clip-path animation.',
    cssCode: `.glitch-text {
  position: relative;
  font-size: 2.25rem;
  font-weight: bold;
}
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.glitch-text::before {
  left: 2px;
  text-shadow: -1px 0 red;
  clip-path: inset(24% 0 29% 0);
  animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
}
.glitch-text::after {
  left: -2px;
  text-shadow: -1px 0 blue;
  clip-path: inset(85% 0 3% 0);
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}
/* Keyframes omitted for brevity */`,
    tailwindCode: `<!-- Custom CSS required for complex glitch effect -->
<div class="glitch-text text-4xl font-bold relative" data-text="ERROR">ERROR</div>`
  },
  {
    id: '3d',
    title: '3D_ROTATE',
    description: 'Perspective and transform-style: preserve-3d.',
    cssCode: `.perspective-container {
  perspective: 500px;
}
.rotate-box {
  width: 4rem;
  height: 4rem;
  border: 4px solid #ffb000;
  transition: transform 1s;
}
.rotate-box:hover {
  transform: rotateY(180deg) rotateX(180deg);
}`,
    tailwindCode: `<div class="perspective-500">
  <div class="w-16 h-16 border-4 border-retro-amber transform transition-transform duration-1000 hover:rotate-y-180 hover:rotate-x-180"></div>
</div>`
  },
  {
    id: 'typewriter',
    title: 'TYPE_WRITER',
    description: 'Width transition with steps() timing function.',
    cssCode: `.typing-demo {
  width: 100%;
  animation: typing 2s steps(20), blink .5s step-end infinite alternate;
  white-space: nowrap;
  overflow: hidden;
  border-right: 4px solid #00ff41;
}

@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}
@keyframes blink {
  50% { border-color: transparent }
}`,
    tailwindCode: `<div class="typing-demo overflow-hidden whitespace-nowrap border-r-4 border-retro-primary pr-1">
  console.log('Hello');
</div>`
  },
  {
    id: 'crt',
    title: 'CRT_SCAN',
    description: 'Linear gradient animation moving vertically.',
    cssCode: `.scan-line {
  width: 100%;
  height: 1rem;
  background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
  animation: scanline 8s linear infinite;
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}`,
    tailwindCode: `<div class="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent h-4 w-full animate-scanline"></div>`
  },
  {
    id: 'matrix',
    title: 'MATRIX_FALL',
    description: 'Vertical translation with different delays.',
    cssCode: `.matrix-char {
  animation: matrix-fall 2s linear infinite;
}
.delay-100 { animation-delay: 100ms; }
/* ... other delays */

@keyframes matrix-fall {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}`,
    tailwindCode: `<div class="animate-matrix-fall delay-100">1 0 1 0</div>`
  }
]

const activeDemoId = ref<string | null>(null)
const activeTab = ref<'css' | 'tailwind'>('css')

const activeDemo = computed(() => demos.find(d => d.id === activeDemoId.value))

const openDemo = (id: string) => {
  activeDemoId.value = id
  activeTab.value = 'css'
}

const closeDemo = () => {
  activeDemoId.value = null
}


const isCopied = ref(false)

const copyCode = async () => {
  const code = activeTab.value === 'css' ? activeDemo.value?.cssCode : activeDemo.value?.tailwindCode
  if (code) {
    try {
      await navigator.clipboard.writeText(code)
      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto relative min-h-[600px]">
    <button @click="router.push('/skills/vue')" class="mr-4 text-retro-blue hover:text-retro-primary text-xl">
      < [BACK]
    </button>
    <h2 class="text-4xl mb-8 border-b-4 border-retro-primary inline-block pr-8">
      VISUAL_FX_LIBRARY
    </h2>

    <!-- List View -->
    <div v-if="!activeDemoId" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div 
        v-for="demo in demos"
        :key="demo.id"
        class="border-2 border-retro-primary p-6 relative group cursor-pointer overflow-hidden hover:bg-retro-primary/5 transition-colors"
        @click="openDemo(demo.id)"
      >
        <div class="absolute inset-0 bg-retro-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        <h3 class="text-2xl mb-4 text-retro-blue group-hover:text-glow transition-all">{{ demo.title }}</h3>
        
        <!-- Preview Box -->
        <div class="h-32 flex items-center justify-center bg-black/50 border border-retro-primary/30 overflow-hidden relative">
          
          <!-- Neon Preview -->
          <div v-if="demo.id === 'neon'" class="w-16 h-16 bg-retro-blue rounded-full animate-pulse shadow-[0_0_20px_currentColor]"></div>
          
          <!-- Glitch Preview -->
          <div v-if="demo.id === 'glitch'" class="glitch-text text-4xl font-bold relative" data-text="ERROR">ERROR</div>
          
          <!-- 3D Preview -->
          <div v-if="demo.id === '3d'" class="perspective-500">
            <div class="w-16 h-16 border-4 border-retro-amber transform transition-transform duration-1000 group-hover:rotate-y-180 group-hover:rotate-x-180"></div>
          </div>

          <!-- Typewriter Preview -->
          <div v-if="demo.id === 'typewriter'" class="px-4">
            <div class="typing-demo overflow-hidden whitespace-nowrap border-r-4 border-retro-primary pr-1">
              console.log('Hello');
            </div>
          </div>

          <!-- CRT Preview -->
          <div v-if="demo.id === 'crt'" class="w-full h-full relative">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent h-4 w-full animate-scanline"></div>
            <div class="absolute inset-0 flex items-center justify-center text-white/50">SCANNING...</div>
          </div>

          <!-- Matrix Preview -->
          <div v-if="demo.id === 'matrix'" class="w-full font-mono text-xs leading-none">
            <div class="flex justify-around">
              <div class="animate-matrix-fall delay-100">1 0 1 0</div>
              <div class="animate-matrix-fall delay-300">0 1 1 0</div>
              <div class="animate-matrix-fall delay-700">1 1 0 1</div>
              <div class="animate-matrix-fall delay-500">0 0 1 1</div>
            </div>
          </div>

        </div>
        <p class="mt-4 text-sm opacity-70">{{ demo.description }}</p>
      </div>
    </div>

    <!-- Detail View -->
    <div v-else class="animate-in zoom-in-95 duration-300 h-full flex flex-col">
      <button 
        @click="closeDemo"
        class="mb-6 flex items-center text-retro-amber hover:text-retro-primary transition-colors w-fit"
      >
        <span class="mr-2 text-xl"><</span> [RETURN_TO_LIBRARY]
      </button>

      <div class="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 border-2 border-retro-primary p-1 bg-black/40">
        
        <!-- Left: Visual -->
        <div class="border border-retro-primary/50 p-8 flex items-center justify-center bg-black/60 min-h-[300px] relative overflow-hidden">
          <div class="absolute top-2 left-2 text-xs text-retro-primary/50">PREVIEW_MODE</div>
          
          <!-- Neon Visual -->
          <div v-if="activeDemoId === 'neon'" class="scale-150">
            <div class="w-16 h-16 bg-retro-blue rounded-full animate-pulse shadow-[0_0_20px_currentColor]"></div>
          </div>
          
          <!-- Glitch Visual -->
          <div v-if="activeDemoId === 'glitch'" class="scale-150">
            <div class="glitch-text text-6xl font-bold relative" data-text="SYSTEM FAILURE">SYSTEM FAILURE</div>
          </div>
          
          <!-- 3D Visual -->
          <div v-if="activeDemoId === '3d'" class="scale-150 perspective-500">
            <div class="w-32 h-32 border-4 border-retro-amber transform transition-transform duration-1000 hover:rotate-y-180 hover:rotate-x-180 flex items-center justify-center text-retro-amber font-bold">
              HOVER ME
            </div>
          </div>

          <!-- Typewriter Visual -->
          <div v-if="activeDemoId === 'typewriter'" class="scale-125">
             <div class="typing-demo overflow-hidden whitespace-nowrap border-r-4 border-retro-primary pr-1 text-2xl">
              > wake_up_neo...
            </div>
          </div>

          <!-- CRT Visual -->
          <div v-if="activeDemoId === 'crt'" class="w-full h-full relative bg-retro-primary/5">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent h-8 w-full animate-scanline"></div>
            <div class="absolute inset-0 flex items-center justify-center text-2xl text-retro-primary">
              SCANNING_SECTOR_7G...
            </div>
          </div>

          <!-- Matrix Visual -->
          <div v-if="activeDemoId === 'matrix'" class="w-full h-full font-mono text-lg leading-none flex justify-around items-start pt-10">
             <div class="animate-matrix-fall delay-100 text-retro-primary">1 0 1 0 1</div>
             <div class="animate-matrix-fall delay-300 text-retro-primary/80">0 1 1 0 0</div>
             <div class="animate-matrix-fall delay-700 text-retro-primary/60">1 1 0 1 1</div>
             <div class="animate-matrix-fall delay-500 text-retro-primary/90">0 0 1 1 0</div>
             <div class="animate-matrix-fall delay-200 text-retro-primary/70">1 0 0 1 1</div>
          </div>

        </div>

        <!-- Right: Code -->
        <div class="flex flex-col border border-retro-primary/50 bg-black/80">
          <div class="flex border-b border-retro-primary/50">
            <button 
              @click="activeTab = 'css'"
              class="flex-1 py-2 text-center hover:bg-retro-primary/20 transition-colors"
              :class="{ 'bg-retro-primary text-retro-bg font-bold': activeTab === 'css' }"
            >
              CSS_SOURCE
            </button>
            <button 
              @click="activeTab = 'tailwind'"
              class="flex-1 py-2 text-center hover:bg-retro-primary/20 transition-colors"
              :class="{ 'bg-retro-primary text-retro-bg font-bold': activeTab === 'tailwind' }"
            >
              TAILWIND_CONFIG
            </button>
          </div>
          
          <div class="flex-1 p-4 overflow-auto custom-scrollbar relative group">
            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                @click="copyCode"
                class="text-xs border px-2 py-1 transition-all duration-300"
                :class="isCopied ? 'border-retro-amber text-retro-amber bg-retro-amber/10' : 'border-retro-primary hover:bg-retro-primary hover:text-retro-bg'"
              >
                {{ isCopied ? 'COPIED!' : 'COPY' }}
              </button>
            </div>
            <pre class="font-mono text-sm text-retro-blue whitespace-pre-wrap">{{ activeTab === 'css' ? activeDemo?.cssCode : activeDemo?.tailwindCode }}</pre>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-500 {
  perspective: 500px;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
.rotate-x-180 {
  transform: rotateX(180deg);
}

/* Glitch Effect */
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.glitch-text::before {
  left: 2px;
  text-shadow: -1px 0 red;
  clip-path: inset(24% 0 29% 0);
  animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
}
.glitch-text::after {
  left: -2px;
  text-shadow: -1px 0 blue;
  clip-path: inset(85% 0 3% 0);
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

@keyframes glitch-anim-1 {
  0% { clip-path: inset(80% 0 2% 0); }
  20% { clip-path: inset(20% 0 50% 0); }
  40% { clip-path: inset(50% 0 10% 0); }
  60% { clip-path: inset(10% 0 80% 0); }
  80% { clip-path: inset(30% 0 40% 0); }
  100% { clip-path: inset(60% 0 20% 0); }
}
@keyframes glitch-anim-2 {
  0% { clip-path: inset(10% 0 60% 0); }
  20% { clip-path: inset(30% 0 10% 0); }
  40% { clip-path: inset(70% 0 30% 0); }
  60% { clip-path: inset(20% 0 80% 0); }
  80% { clip-path: inset(60% 0 20% 0); }
  100% { clip-path: inset(40% 0 50% 0); }
}

/* Typing Demo */
.typing-demo {
  animation: typing 2s steps(20), blink .5s step-end infinite alternate;
}
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}
@keyframes blink {
  50% { border-color: transparent }
}

/* Matrix Fall */
@keyframes matrix-fall {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}
.animate-matrix-fall {
  animation: matrix-fall 2s linear infinite;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #000;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #00ff41;
}
</style>
