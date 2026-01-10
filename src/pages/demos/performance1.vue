<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Play, Pause, RotateCcw } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

const props = defineProps<{
  embedded?: boolean
}>()

const TOTAL_ITEMS = 10000
const ITEMS_PER_FRAME = 500

const items = ref<Array<{ id: number, color: string }>>([])
const progress = ref(0)
const isRendering = ref(false)
const isPaused = ref(false)
const currentStartIndex = ref(0)

const getRandomColor = () => {
  const colors = [
    'bg-indigo-500', 'bg-blue-500', 'bg-sky-500', 
    'bg-emerald-500', 'bg-teal-500', 'bg-purple-500', 
    'bg-fuchsia-500', 'bg-pink-500'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

let allColors: string[] = []

onMounted(() => {
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    allColors.push(getRandomColor())
  }
  startRendering()
})

const startRendering = () => {
  isRendering.value = true
  isPaused.value = false
  renderFrame()
}

const pauseRendering = () => {
  isPaused.value = true
}

const resumeRendering = () => {
  if (!isRendering.value) return
  isPaused.value = false
  renderFrame()
}

const renderFrame = () => {
  if (isPaused.value || currentStartIndex.value >= TOTAL_ITEMS) {
    if (currentStartIndex.value >= TOTAL_ITEMS) {
      isRendering.value = false
    }
    return
  }

  const endIndex = Math.min(currentStartIndex.value + ITEMS_PER_FRAME, TOTAL_ITEMS)
  const chunk = []
  for (let i = currentStartIndex.value; i < endIndex; i++) {
    chunk.push({
      id: i,
      color: allColors[i]
    })
  }
  items.value.push(...chunk)

  currentStartIndex.value = endIndex
  progress.value = Math.floor((endIndex / TOTAL_ITEMS) * 100)

  requestAnimationFrame(renderFrame)
}
</script>

<template>
  <div class="h-full flex flex-col bg-skin-card font-sans">
    <!-- Controls Toolbar -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-skin-base shrink-0">
       <div class="flex items-center gap-4">
          <div class="text-sm font-medium text-skin-muted">
            <span class="text-skin-base font-bold">{{ items.length.toLocaleString() }}</span> / {{ TOTAL_ITEMS.toLocaleString() }} {{ t('demos.perf.dots') }}
          </div>
          
          <!-- Progress Bar -->
          <div class="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
             <div class="h-full bg-skin-primary transition-all duration-75" :style="{ width: progress + '%' }"></div>
          </div>
          
          <div class="text-xs font-mono text-skin-muted uppercase min-w-[80px]">
             {{ isPaused ? t('demos.perf.state_paused') : (isRendering ? t('demos.perf.state_rendering') : t('demos.perf.state_completed')) }}
          </div>
       </div>

       <div class="flex items-center gap-2">
         <button 
           v-if="isRendering && !isPaused"
           @click="pauseRendering"
           class="flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 text-sm font-medium transition-colors"
         >
           <Pause class="w-4 h-4" /> {{ t('demos.perf.pause') }}
         </button>
         
         <button 
           v-if="isRendering && isPaused"
           @click="resumeRendering"
           class="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-medium transition-colors"
         >
           <Play class="w-4 h-4" /> {{ t('demos.perf.resume') }}
         </button>

         <button 
           v-if="!isRendering && items.length === TOTAL_ITEMS"
           @click="() => { items.splice(0); currentStartIndex = 0; progress = 0; startRendering() }"
           class="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-sm font-medium transition-colors"
         >
           <RotateCcw class="w-4 h-4" /> {{ t('demos.perf.restart') }}
         </button>
       </div>
    </div>

    <!-- Render Container -->
    <div class="flex-1 p-6 overflow-auto bg-skin-base/50 relative">
      <div class="flex flex-wrap content-start gap-1">
        <div 
          v-for="item in items" 
          :key="item.id"
          class="w-1.5 h-1.5 rounded-full shadow-sm transition-transform hover:scale-150"
          :class="item.color"
        ></div>
      </div>
      
      <div v-if="!isRendering && items.length === TOTAL_ITEMS" class="absolute bottom-6 left-1/2 -translate-x-1/2">
         <div class="bg-skin-card border border-skin-base shadow-lg px-6 py-2 rounded-full text-sm font-medium text-skin-primary animate-bounce">
            {{ t('demos.perf.render_complete') }}
         </div>
      </div>
    </div>
  </div>
</template>