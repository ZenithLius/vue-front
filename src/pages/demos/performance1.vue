<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  embedded?: boolean
}>()

// 总数据量：5万个点
const TOTAL_ITEMS = 10000
// 每一帧渲染的数量
const ITEMS_PER_FRAME = 500

// 数据列表 (只存颜色)
const items = ref<Array<{ id: number, color: string }>>([])
// 渲染进度
const progress = ref(0)
// 状态控制
const isRendering = ref(false)
const isPaused = ref(false)
const currentStartIndex = ref(0)

// 生成随机颜色
const getRandomColor = () => {
  const colors = [
    'bg-retro-primary', 'bg-retro-amber', 'bg-retro-red', 'bg-retro-blue', 
    'bg-purple-500', 'bg-pink-500', 'bg-yellow-400', 'bg-cyan-400'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 预生成所有数据颜色 (避免渲染时计算开销)
let allColors: string[] = []

onMounted(() => {
  // 初始化数据
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
  if (!isRendering.value) return // 如果已经结束，不能继续
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
  
  // 批量添加数据
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
  <div class="max-w-6xl mx-auto h-full flex flex-col">
    <!-- 头部导航 & 控制栏 -->
    <div class="flex flex-col md:flex-row md:items-center  mb-8 border-b-4 border-retro-primary pb-4 gap-4">
      <div v-if="!embedded" class="flex items-center">
        <button @click="router.push('/skills/vue')" class="mr-4 text-retro-primary hover:text-retro-amber text-xl">
          < [BACK]
        </button>
        <h2 class="text-3xl md:text-4xl">
          PIXEL_DOTS_RENDER
        </h2>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="font-mono text-sm text-right mr-4">
          <p>COUNT: {{ items.length.toLocaleString() }} / {{ TOTAL_ITEMS.toLocaleString() }}</p>
          <p>STATUS: {{ isPaused ? 'PAUSED' : (isRendering ? 'RENDERING' : 'COMPLETED') }}</p>
        </div>
        
        <button 
          v-if="isRendering && !isPaused"
          @click="pauseRendering"
          class="border-2 border-retro-amber text-retro-amber px-4 py-2 hover:bg-retro-amber hover:text-black transition-colors font-bold"
        >
          || 暂停生成
        </button>
        
        <button 
          v-if="isRendering && isPaused"
          @click="resumeRendering"
          class="border-2 border-retro-primary text-retro-primary px-4 py-2 hover:bg-retro-primary hover:text-black transition-colors font-bold"
        >
          > 继续生成
        </button>

        <button 
          v-if="!isRendering && items.length === TOTAL_ITEMS"
          @click="() => { items.splice(0); currentStartIndex = 0; progress = 0; startRendering() }"
          class="border-2 border-retro-blue text-retro-blue px-4 py-2 hover:bg-retro-blue hover:text-black transition-colors font-bold"
        >
          R 重置演示
        </button>
        
      </div>
    </div>

    <!-- 进度条 -->
    <div class="mb-6 relative h-6 border border-retro-primary/30 bg-black/50 shrink-0">
      <div 
        class="h-full bg-retro-primary/50 transition-all duration-75 flex items-center justify-end px-2 text-xs text-white font-mono"
        :style="{ width: progress + '%' }"
      >
        {{ progress }}%
      </div>
    </div>

    <!-- 密集点阵容器 -->
    <div class="flex-1 bg-black/40 border-2 border-retro-primary p-4 overflow-auto relative min-h-0">
      <!-- 使用 flex-wrap 让点自动换行排列 -->
      <div class="flex flex-wrap content-start gap-0.5">
        <div 
          v-for="item in items" 
          :key="item.id"
          class="w-1 h-1 rounded-full opacity-80 hover:opacity-100 hover:scale-150 transition-transform duration-300"
          :class="item.color"
        ></div>
      </div>
      
      <!-- 渲染完成提示 -->
      <div v-if="!isRendering && items.length === TOTAL_ITEMS" class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="bg-black/80 border-4 border-retro-primary p-8 text-4xl text-glow animate-pulse">
          RENDER_COMPLETE
        </div>
      </div>
    </div>
    
    <!-- <div class="mt-4 p-4 border border-retro-amber text-retro-amber text-sm font-mono shrink-0">
      <p>>通过requestAnimationFrame 渲染 10,000 个 DOM 节点 | 每一帧渲染 {{ ITEMS_PER_FRAME }} 个 | 保持 60FPS 流畅度</p>
    </div> -->
  </div>
</template>