<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()


const demos = [
  {
    id: 'perf_hub',
    name: '性能相关',
    desc: '虚拟滚动 / 时间分片 / 虚拟树',
    path: '/demos/performance-hub'
  },
  {
    id: 'css',
    name: '样式相关',
    desc: '霓虹 / 故障风',
    path: '/demos/css-showcase'
  },
   {
    id: 'vue',
    name: '功能相关',
    desc: '页面通信 / ',
    path: '/demos/vue-operations/vue-operations'
  }
]
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex items-center mb-8">
      <button @click="router.push('/skills')" class="mr-4 text-retro-primary hover:text-retro-amber text-xl">
        < [BACK]
      </button>
      <h2 class="text-4xl border-b-4 border-retro-primary pr-8">
        VUE_OPERATIONS
      </h2>
    </div>

    <div class="grid gap-6">
      <div 
        v-for="demo in demos" 
        :key="demo.id"
        @click="router.push(demo.path)"
        class="border-2 border-retro-primary p-6 cursor-pointer hover:bg-retro-primary/10 transition-colors flex justify-between items-center group"
      >
        <div>
          <h3 class="text-2xl mb-2 group-hover:text-glow">{{ demo.name }}</h3>
          <p class="opacity-70 font-mono text-lg">{{ demo.desc }}</p>
        </div>
        <span class="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">>></span>
      </div>
    </div>
  </div>
</template>
