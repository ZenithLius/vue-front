<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Demo {
  id: string
  title: string
  description: string
  cssCode: string
  tailwindCode: string
}

// Computed to support reactive language switching
const demos = computed<Demo[]>(() => [
  {
    id: 'neon',
    title: t('demos.css.neon'),
    description: t('demos.css.neon_desc'),
    cssCode: `.neon-pulse {
  background-color: #6366f1; /* Indigo 500 */
  border-radius: 9999px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}`,
    tailwindCode: `<div class="w-16 h-16 bg-indigo-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50"></div>`
  },
  {
    id: 'glitch',
    title: t('demos.css.glitch'),
    description: t('demos.css.glitch_desc'),
    cssCode: `/* Requires complex keyframes (omitted for brevity) */
.glitch-text {
  position: relative;
  font-weight: bold;
}
/* See full CSS implementation */`,
    tailwindCode: `<!-- Custom CSS class required -->
<div class="glitch-text text-4xl font-bold relative" data-text="ERROR">ERROR</div>`
  },
  {
    id: '3d',
    title: t('demos.css.threed'),
    description: t('demos.css.threed_desc'),
    cssCode: `.rotate-box:hover {
  transform: rotateY(180deg);
}
.perspective { perspective: 1000px; }`,
    tailwindCode: `<div class="group perspective-1000">
  <div class="w-20 h-20 bg-amber-500 transition-transform duration-700 group-hover:rotate-y-180 rounded-xl shadow-md"></div>
</div>`
  },
  {
    id: 'gradient',
    title: t('demos.css.gradient'),
    description: t('demos.css.gradient_desc'),
    cssCode: `.gradient-bg {
  background: linear-gradient(270deg, #6366f1, #ec4899);
  background-size: 400% 400%;
  animation: gradient 3s ease infinite;
}
@keyframes gradient {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}`,
    tailwindCode: `<div class="w-full h-24 bg-gradient-to-r from-indigo-500 to-pink-500 animate-gradient bg-[length:200%_200%]"></div>`
  }
])

const activeDemoId = ref<string | null>(null)
const activeTab = ref<'css' | 'tailwind'>('css')

const activeDemo = computed(() => demos.value.find(d => d.id === activeDemoId.value))

const toggleDemo = (id: string) => {
  if (activeDemoId.value === id) {
    activeDemoId.value = null
  } else {
    activeDemoId.value = id
    activeTab.value = 'css'
  }
}

const isCopied = ref(false)
const copyCode = async () => {
  const code = activeTab.value === 'css' ? activeDemo.value?.cssCode : activeDemo.value?.tailwindCode
  if (code) {
    await navigator.clipboard.writeText(code)
    isCopied.value = true
    setTimeout(() => isCopied.value = false, 2000)
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto space-y-8">
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="demo in demos" 
        :key="demo.id"
        class="bg-skin-card border border-skin-base rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <!-- Preview Area -->
        <div class="h-48 bg-gray-50 flex items-center justify-center p-6 border-b border-skin-base relative overflow-hidden group">
          
          <div v-if="demo.id === 'neon'">
            <div class="w-16 h-16 bg-indigo-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50"></div>
          </div>

          <div v-if="demo.id === 'glitch'">
            <div class="glitch-text text-4xl font-bold text-gray-900" data-text="GLITCH">GLITCH</div>
          </div>

          <div v-if="demo.id === '3d'">
             <div class="perspective-1000 w-24 h-24 relative group-hover:scale-110 transition-transform">
               <div class="w-full h-full bg-amber-400 rounded-xl shadow-lg border-2 border-amber-500/20 transform transition-transform duration-700 hover:rotate-y-180 flex items-center justify-center text-amber-900 font-bold text-xs uppercase cursor-pointer">
                 Flip Me
               </div>
             </div>
          </div>

          <div v-if="demo.id === 'gradient'" class="w-full h-full">
            <div class="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-[length:200%_200%] animate-gradient"></div>
          </div>

        </div>

        <!-- Content -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-lg text-skin-base">{{ demo.title }}</h3>
            <button 
              @click="toggleDemo(demo.id)"
              class="text-xs font-medium text-skin-primary hover:text-skin-primary-dark transition-colors px-3 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100"
            >
              {{ activeDemoId === demo.id ? t('common.hide_code') : t('common.view_code') }}
            </button>
          </div>
          <p class="text-sm text-skin-muted line-clamp-2">{{ demo.description }}</p>
        </div>

        <!-- Code Panel (Expandable) -->
        <div v-if="activeDemoId === demo.id" class="border-t border-skin-base bg-gray-900 text-gray-100">
          <div class="flex border-b border-gray-700">
            <button class="flex-1 py-2 text-xs font-medium text-gray-400 hover:text-white border-b-2 transition-colors"
                :class="activeTab === 'css' ? 'border-indigo-500 text-white' : 'border-transparent'"
                @click="activeTab = 'css'">CSS</button>
            <button class="flex-1 py-2 text-xs font-medium text-gray-400 hover:text-white border-b-2 transition-colors"
                :class="activeTab === 'tailwind' ? 'border-indigo-500 text-white' : 'border-transparent'"
                @click="activeTab = 'tailwind'">Tailwind</button>
          </div>
          <div class="relative group">
             <button class="absolute top-2 right-2 p-1 text-xs text-gray-500 hover:text-white transition-colors" @click="copyCode">
               {{ isCopied ? t('common.copied') : t('common.copy') }}
             </button>
             <pre class="p-4 overflow-x-auto text-xs font-mono leading-relaxed">{{ activeTab === 'css' ? demo.cssCode : demo.tailwindCode }}</pre>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
    layout: dashboard
</route>

<style scoped>
.animate-gradient {
  animation: gradient 3s ease infinite;
}
@keyframes gradient {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}

.perspective-1000 {
  perspective: 1000px;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}

/* Glitch */
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
  text-shadow: -1px 0 #ef4444;
  clip-path: inset(24% 0 29% 0);
  animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
}
.glitch-text::after {
  left: -2px;
  text-shadow: -1px 0 #3b82f6;
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
</style>
