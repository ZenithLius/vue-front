<!-- src/components/VirtualChartList.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SimpleLineChart from './SimpleLineChart.vue'

const props = defineProps<{
  items: any[]
  itemHeight: number
  height: string // e.g. "500px" or "100%"
}>()

const containerRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const containerHeight = ref(0)

// 缓冲数量
const buffer = 4

// 计算总高度
const totalHeight = computed(() => props.items.length * props.itemHeight)

// 计算开始和结束索引
const startIndex = computed(() => {
  return Math.floor(scrollTop.value / props.itemHeight)
})

const endIndex = computed(() => {
  const visibleCount = Math.ceil(containerHeight.value / props.itemHeight)
  return Math.min(
    startIndex.value + visibleCount + buffer,
    props.items.length
  )
})

// 实际渲染的数据片段
const visibleData = computed(() => {
  const start = Math.max(0, startIndex.value - buffer)
  const end = endIndex.value
  
  return props.items.slice(start, end).map((item, index) => ({
    ...item,
    // 保持绝对定位的偏移量
    offset: (start + index) * props.itemHeight,
    // 原始索引，用于key
    originalIndex: start + index
  }))
})

// 滚动处理
const handleScroll = (e: Event) => {
  // 使用 requestAnimationFrame 优化滚动事件处理
  window.requestAnimationFrame(() => {
    scrollTop.value = (e.target as HTMLElement).scrollTop
  })
}

const updateContainerHeight = () => {
    if (containerRef.value) {
        containerHeight.value = containerRef.value.clientHeight
    }
}

onMounted(() => {
  updateContainerHeight()
  window.addEventListener('resize', updateContainerHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerHeight)
})
</script>

<template>
  <div 
    ref="containerRef"
    class="virtual-scroller-container overflow-y-auto w-full custom-scrollbar"
    :style="{ height: height }"
    @scroll="handleScroll"
  >
    <!-- 幽灵容器，撑开滚动条 -->
    <div class="virtual-phantom" :style="{ height: totalHeight + 'px' }"></div>
    
    <!-- 实际渲染区域 -->
    <div class="visible-content relative w-full">
      <div 
        v-for="item in visibleData" 
        :key="item.originalIndex"
        class="absolute w-full px-4"
        :style="{ 
          height: itemHeight + 'px',
          transform: `translateY(${item.offset}px)`
        }"
      >
         <div class="chart-wrapper w-full h-full flex items-center gap-4">
             <div class="text-retro-primary font-mono text-xl w-24 text-right">
                 #{{ item.id }}
             </div>
             <div class="flex-1 h-[90%]">
                 <SimpleLineChart :data="item" />
             </div>
         </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.virtual-scroller-container {
  position: relative;
  /* 优化滚动性能 */
  will-change: transform;
}
.virtual-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
    width: 10px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0,0,0,0.5);
    border-left: 1px solid rgba(0, 255, 65, 0.2);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #00ff41;
    border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #00cc33;
}
</style>
