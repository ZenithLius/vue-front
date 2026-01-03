<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Generate 100k items
const TOTAL_ITEMS = 100000
const items = ref<Array<{ id: number, name: string, status: string, value: number }>>([])
const loading = ref(true)

// Virtual Scroll State
const containerHeight = ref(500)
const itemHeight = 40
const scrollTop = ref(0)
const containerRef = ref<HTMLElement | null>(null)

const updateContainerHeight = () => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight
  }
}

const generateData = () => {
  console.time('Data Generation')
  const newData = []
  const statuses = ['ACTIVE', 'OFFLINE', 'ERROR', 'SYNCING']
  
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    newData.push({
      id: i,
      name: `NODE_${i.toString().padStart(6, '0')}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      value: Math.floor(Math.random() * 1000)
    })
  }
  items.value = newData
  loading.value = false
  console.timeEnd('Data Generation')
  
  // Recalculate height after data load (just in case)
  // nextTick would be better but setTimeout is simple enough here
  setTimeout(updateContainerHeight, 0)
}

onMounted(() => {
  // Use setTimeout to allow UI to render "Loading" state first
  setTimeout(generateData, 100)
  
  // Observe container resize
  const observer = new ResizeObserver(updateContainerHeight)
  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
  
  // Cleanup not strictly necessary for this demo but good practice
})

const onScroll = (e: Event) => {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}

// Computed visible items
const visibleItems = computed(() => {
  const start = Math.floor(scrollTop.value / itemHeight)
  const visibleCount = Math.ceil(containerHeight.value / itemHeight)
  const buffer = 5
  
  const startIndex = Math.max(0, start - buffer)
  const endIndex = Math.min(items.value.length, start + visibleCount + buffer)
  
  return items.value.slice(startIndex, endIndex).map((item, index) => ({
    ...item,
    top: (startIndex + index) * itemHeight
  }))
})

const totalHeight = computed(() => items.value.length * itemHeight)

const getStatusColor = (status: string) => {
  switch(status) {
    case 'ACTIVE': return 'text-retro-primary'
    case 'OFFLINE': return 'text-gray-500'
    case 'ERROR': return 'text-retro-red'
    case 'SYNCING': return 'text-retro-blue'
    default: return 'text-white'
  }
}
const props = defineProps<{
  embedded?: boolean
}>()
</script>

<template>
  <div class="max-w-4xl mx-auto h-full flex flex-col">
    <div v-if="!embedded" class="flex justify-between items-center mb-8 border-b-4 border-retro-primary pb-2 shrink-0">
      <button @click="router.push('/skills/vue')" class="mr-4 text-retro-blue hover:text-retro-primary text-xl">
        < [BACK]
      </button>
      <h2 class="text-4xl">
        DATA_STREAM_100K
      </h2>
      <div class="text-right font-mono text-sm">
        <p>TOTAL_RECORDS: {{ items.length.toLocaleString() }}</p>
        <p>RENDER_MODE: VIRTUAL_SCROLL</p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 animate-pulse text-2xl flex-1 flex items-center justify-center">
      GENERATING_DATA...
    </div>

    <div 
      v-else
      ref="containerRef"
      class="border-2 border-retro-primary bg-black/80 overflow-auto relative custom-scrollbar flex-1 min-h-0"
      @scroll="onScroll"
    >
      <div :style="{ height: totalHeight + 'px' }" class="relative w-full">
        <div 
          v-for="item in visibleItems" 
          :key="item.id"
          class="absolute w-full h-[40px] flex items-center px-4 border-b border-retro-primary/20 hover:bg-retro-primary/20 transition-colors font-mono text-sm"
          :style="{ top: item.top + 'px' }"
        >
          <div class="w-24 text-retro-amber">#{{ item.id }}</div>
          <div class="w-40">{{ item.name }}</div>
          <div class="w-32" :class="getStatusColor(item.status)">[{{ item.status }}]</div>
          <div class="flex-1">
            <div class="h-2 bg-retro-bg border border-retro-primary/30 w-full max-w-[200px]">
              <div 
                class="h-full bg-retro-primary" 
                :style="{ width: (item.value / 10) + '%' }"
              ></div>
            </div>
          </div>
          <div class="w-20 text-right">{{ item.value }}ms</div>
        </div>
      </div>
    </div>

    <!-- <div class="mt-4 p-4 border border-retro-amber text-retro-amber text-sm font-mono shrink-0">
      <p>> 100,000 个行数据</p>
    </div> -->
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 16px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #000;
  border-left: 1px solid var(--retro-primary);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--retro-primary);
  border: 2px solid #000;
}
</style>
