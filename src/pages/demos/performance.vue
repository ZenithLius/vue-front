<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()

// Generate 100k items
const TOTAL_ITEMS = 100000
const items = ref<Array<{ id: number, nameIdentifier: string, status: string, value: number }>>([])
const loading = ref(true)

// Virtual Scroll State
const containerHeight = ref(500)
const itemHeight = 48 
const scrollTop = ref(0)
const containerRef = ref<HTMLElement | null>(null)

const updateContainerHeight = () => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight
  }
}

const generateData = () => {
  const newData = []
  const statuses = ['ACTIVE', 'OFFLINE', 'ERROR', 'SYNCING']
  
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    newData.push({
      id: i,
      // Store identifier instead of full string for flexibility
      nameIdentifier: i.toString().padStart(6, '0'), 
      status: statuses[Math.floor(Math.random() * statuses.length)],
      value: Math.floor(Math.random() * 1000)
    })
  }
  items.value = newData
  loading.value = false
  setTimeout(updateContainerHeight, 0)
}

onMounted(() => {
  setTimeout(generateData, 100)
  const observer = new ResizeObserver(updateContainerHeight)
  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})

const onScroll = (e: Event) => {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}

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
    case 'ACTIVE': return 'text-emerald-600 bg-emerald-50'
    case 'OFFLINE': return 'text-gray-500 bg-gray-100'
    case 'ERROR': return 'text-red-600 bg-red-50'
    case 'SYNCING': return 'text-blue-600 bg-blue-50'
    default: return 'text-gray-600'
  }
}
const props = defineProps<{
  embedded?: boolean
}>()
</script>

<template>
  <div class="h-full flex flex-col bg-skin-card">
    <div v-if="loading" class="flex-1 flex items-center justify-center text-skin-muted animate-pulse">
      {{ t('demos.perf.loading_data') }}
    </div>

    <!-- Header Row -->
    <div v-else class="grid grid-cols-12 gap-4 px-6 py-3 border-b border-skin-base bg-skin-base text-xs font-semibold text-skin-muted uppercase tracking-wider">
        <div class="col-span-2">{{ t('demos.perf.id') }}</div>
        <div class="col-span-4">{{ t('demos.perf.node_name') }}</div>
        <div class="col-span-3">{{ t('demos.perf.status') }}</div>
        <div class="col-span-3 text-right">{{ t('demos.perf.latency') }}</div>
    </div>

    <!-- Virtual List -->
    <div 
      v-if="!loading"
      ref="containerRef"
      class="flex-1 overflow-auto relative custom-scrollbar"
      @scroll="onScroll"
    >
      <div :style="{ height: totalHeight + 'px' }" class="relative w-full">
        <div 
          v-for="item in visibleItems" 
          :key="item.id"
          class="absolute w-full px-6 grid grid-cols-12 gap-4 items-center border-b border-skin-base hover:bg-skin-base transition-colors text-sm text-skin-base"
          :style="{ top: item.top + 'px', height: itemHeight + 'px' }"
        >
          <div class="col-span-2 font-mono text-skin-muted">#{{ item.id }}</div>
          <div class="col-span-4 font-medium">NODE_{{ item.nameIdentifier }}</div>
          <div class="col-span-3">
             <span :class="`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`">
                <!-- Reactive translation for status -->
                {{ t('demos.perf.status_' + item.status.toLowerCase()) }}
             </span>
          </div>
          <div class="col-span-3 flex items-center justify-end gap-3">
            <div class="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-skin-primary rounded-full transition-all duration-300" :style="{ width: (item.value / 10) + '%' }"></div>
            </div>
            <span class="text-xs font-mono w-12 text-right text-skin-muted">{{ item.value }}ms</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.8);
}
</style>
