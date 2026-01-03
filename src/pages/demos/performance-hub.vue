<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 异步加载组件，进一步优化首屏性能
// 虽然 v-if 已经保证了不渲染，但异步加载可以减少初始 bundle 大小
const DemoVirtualScroll = defineAsyncComponent(() => import('./performance.vue'))
const DemoTimeSlicing = defineAsyncComponent(() => import('./performance1.vue'))
const DemoVirtualTree = defineAsyncComponent(() => import('./performance2.vue'))

// 当前激活的 Tab 索引
const activeTab = ref(0)

const tabs = [
  { name: '列表', desc: '虚拟滚动 (100k list)' },
  { name: 'dom', desc: '时间分片,渲染大量dom节点 (10k dom)' },
  { name: '树', desc: '虚拟树 (1000k nodes)' }
]
</script>

<template>
  <div class="max-w-6xl mx-auto h-full flex flex-col">
    <!-- 顶部导航栏 (紧凑模式) -->
    <div class="flex items-center justify-between mb-2 border-b-2 border-retro-primary pb-2 shrink-0 gap-4">
      <div class="flex items-center gap-2 shrink-0">
        <button @click="router.push('/skills/vue')" class="text-retro-primary hover:text-retro-amber text-lg font-bold">
          [<]
        </button>
        <h2 class="text-xl md:text-2xl whitespace-nowrap">
          PERFORMANCE_LAB
        </h2>
      </div>
      
      <!-- Tab 切换按钮 -->
      <div class="flex gap-1 overflow-x-auto no-scrollbar">
        <button 
          v-for="(tab, index) in tabs" 
          :key="index"
          @click="activeTab = index"
          class="px-2 py-1 border transition-all whitespace-nowrap font-mono text-xs md:text-sm"
          :class="activeTab === index ? 'bg-retro-primary text-black border-retro-primary font-bold' : 'border-retro-primary text-retro-primary hover:bg-retro-primary/20'"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- Tab 内容区域 -->
    <!-- 关键点：使用 v-if 确保未激活的 Tab 不会渲染任何 DOM 节点，保证极致性能 -->
    <div class="flex-1 overflow-hidden relative border-2 border-retro-primary bg-black/50 p-1">
      
      <!-- 1. 虚拟滚动演示 -->
      <div v-if="activeTab === 0" class="h-full w-full">
        <DemoVirtualScroll embedded />
      </div>

      <!-- 2. 时间分片演示 -->
      <div v-if="activeTab === 1" class="h-full w-full">
        <DemoTimeSlicing embedded />
      </div>

      <!-- 3. 虚拟树演示 -->
      <div v-if="activeTab === 2" class="h-full w-full">
        <DemoVirtualTree embedded />
      </div>

    </div>
    
    <!-- 底部说明 -->
    <div class="mt-2 text-center text-retro-primary/50 text-xs font-mono">
      > CURRENT_MODE: {{ tabs[activeTab].desc }} 
    </div>
  </div>
</template>
