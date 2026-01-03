<!-- src/components/PerformanceMonitor.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'
import Worker from '../workers/chartData.worker.ts?worker'
import VirtualChartList from './VirtualChartList.vue'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits(['close'])

const chartData = ref<any[]>([])
const isGenerating = ref(false)
const progress = ref(0)
const generationTime = ref(0)
const renderStartTime = ref(0)

// 性能指标
const fps = ref(0)
const memory = ref(0)
let worker: Worker | null = null
let frameId: number

// 性能对比数据
const performanceStats = ref({
    baseline: 0,
    worker: 0,
    ultimate: 0
})
const comparisionChartRef = ref<HTMLElement | null>(null)

// 模拟主线程耗时操作 (Baseline)
const runBaseline = () => {
    if (isGenerating.value) return
    isGenerating.value = true
    chartData.value = []
    progress.value = 0
    generationTime.value = 0
    
    // 强制 UI 渲染一帧 loading
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const start = performance.now()
            
            
            // 这是一个非常耗时的同步循环，会阻塞主线程
            const data = []
            for (let i = 0; i < 10000; i++) {
                // 模拟复杂计算：每个节点增加 0.2ms 的阻塞
                const startCalc = performance.now()
                while(performance.now() - startCalc < 0.2) {
                    Math.sqrt(Math.random())
                }

                const points = 20
                const d: number[] = []
                const labels: string[] = []
                for (let j = 0; j < points; j++) {
                    d.push(Math.floor(Math.random() * 100))
                    labels.push(`${j}s`)
                }
                data.push({
                    id: i,
                    title: `SYNC_NODE_${i}`,
                    data: d,
                    labels
                })
            }
            
            chartData.value = data
            const end = performance.now()
            const time = Math.round(end - start)
            generationTime.value = time
            performanceStats.value.baseline = time
            isGenerating.value = false
            progress.value = 100
            
            updateComparisonChart()
        })
    })
}

// 仅 Web Worker (无时间切片优化渲染)
const runWorkerOnly = () => {
     if (isGenerating.value) return
     isGenerating.value = true
     chartData.value = []
     progress.value = 0
     
     const start = performance.now()
     
     if (!worker) worker = new Worker()
     
     const onMessage = (e: MessageEvent) => {
         const { type, data, progress: p } = e.data
         if (type === 'CHUNK') {
             progress.value = Math.round(p * 100)
             // 直接全部 push，如果在接收大量数据时也可能卡顿
             chartData.value.push(...data)
         } else if (type === 'COMPLETE') {
             const end = performance.now()
             const time = Math.round(end - start)
             generationTime.value = time
             performanceStats.value.worker = time
             isGenerating.value = false
             
             // 移除临时监听器
             if(worker) worker.removeEventListener('message', onMessage)
             // 恢复默认监听器(如果有)
             updateComparisonChart()
         }
     }
     
     worker.addEventListener('message', onMessage)
     worker.postMessage({ type: 'GENERATE', count: 10000 })
}

// 终极优化 (Worker + Time Slicing) - 原有的 startGeneration 改造
const processQueue: any[] = []
const isProcessing = ref(false)

const processDataInIdle = (deadline: IdleDeadline) => {
  while (deadline.timeRemaining() > 1 && processQueue.length > 0) {
     const chunk = processQueue.shift()
     chartData.value.push(...chunk)
  }
  
  if (processQueue.length > 0) {
     requestIdleCallback(processDataInIdle)
  } else {
     isProcessing.value = false
     const end = performance.now()
     const time = Math.round(end - renderStartTime.value)
     generationTime.value = time
     performanceStats.value.ultimate = time
     updateComparisonChart()
  }
}

const runUltimateOptimization = () => {
  if (isGenerating.value) return
  
  // Reset
  chartData.value = []
  progress.value = 0
  generationTime.value = 0
  isGenerating.value = true
  renderStartTime.value = performance.now()
  
  // Init Worker
  if (!worker) worker = new Worker()
  
  const onMessage = (e: MessageEvent) => {
        const { type, data, progress: p } = e.data
        
        if (type === 'CHUNK') {
             progress.value = Math.round(p * 100)
             processQueue.push(data)
             if (!isProcessing.value) {
                 isProcessing.value = true
                 requestIdleCallback(processDataInIdle)
             }
        } else if (type === 'COMPLETE') {
             isGenerating.value = false
             if(worker) worker.removeEventListener('message', onMessage)
        }
  }
  
  worker.addEventListener('message', onMessage)
  worker.postMessage({ type: 'GENERATE', count: 10000 })
}

// 更新对比图表
const currentThemeColor = ref('#00ff41')

const updateComparisonChart = () => {
    if (!comparisionChartRef.value) return
    const chart = echarts.init(comparisionChartRef.value)
    const option = {
        backgroundColor: 'transparent',
        title: { text: '性能对比 (ms)', textStyle: { color: currentThemeColor.value, fontFamily: 'VT323' }, left: 'center' },
        grid: { top: 40, bottom: 20, left: 20, right: 20, containLabel: true },
        xAxis: { type: 'value', splitLine: { show: false }, axisLabel: { color: currentThemeColor.value } },
        yAxis: { 
            type: 'category', 
            data: ['Baseline (Sync)', 'Worker Only', 'Ultimate (Sliced)'],
            axisLabel: { color: currentThemeColor.value, fontFamily: 'VT323' }
        },
        series: [{
            type: 'bar',
            data: [
                performanceStats.value.baseline,
                performanceStats.value.worker,
                performanceStats.value.ultimate
            ],
            label: { show: true, position: 'right', color: '#fff' },
            itemStyle: {
                color: (params: any) => {
                    const colors = ['#ff0033', '#ffb000', currentThemeColor.value]
                    return colors[params.dataIndex]
                }
            }
        }]
    }
    chart.setOption(option)
}

const monitorPerformance = () => {
    // FPS Monitor
    let lastTime = performance.now()
    let frames = 0
    
    const loop = () => {
        const now = performance.now()
        frames++
        if (now - lastTime >= 1000) {
            fps.value = frames
            frames = 0
            lastTime = now
            
            // Memory Monitor
            if ((performance as any).memory) {
                memory.value = Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
            }
        }
        frameId = requestAnimationFrame(loop)
    }
    loop()
}

onMounted(() => {
    // Init theme color
    const rootStyle = getComputedStyle(document.documentElement)
    const cssColor = rootStyle.getPropertyValue('--retro-primary').trim()
    if (cssColor) currentThemeColor.value = cssColor

    window.addEventListener('theme-change', (e: any) => {
        currentThemeColor.value = e.detail.color
        updateComparisonChart()
    })

    monitorPerformance()
})

onUnmounted(() => {
    if (worker) worker.terminate()
    cancelAnimationFrame(frameId)
})

</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md text-retro-primary font-mono flex flex-col">
    <!-- Header -->
    <div class="h-16 border-b border-retro-primary flex items-center justify-between px-6 shrink-0 bg-retro-bg/90">
      <h2 class="text-2xl font-bold flex items-center gap-3">
          <span class="inline-block w-3 h-3 bg-retro-primary animate-pulse"></span>
          大屏性能相关API
      </h2>
      <button @click="emit('close')" class="hover:text-retro-red hover:border-retro-red border border-retro-primary px-4 py-1 transition-colors">
          [X] CLOSES
      </button>
    </div>
    
    <!-- Controls & Stats -->
    <div class="h-32 border-b border-retro-primary/50 flex items-center bg-black/50 shrink-0">
        <div class="flex-1 flex items-center justify-between px-8">
             <div class="flex flex-col gap-2">
                 <div class="text-xs text-retro-primary/60 uppercase tracking-widest mb-1">Select Test Mode</div>
                 <div class="flex gap-4">
                    <button 
                        @click="runBaseline" 
                        :disabled="isGenerating"
                        class="bg-retro-red/80 text-black font-bold px-4 py-2 hover:bg-retro-red transition-all disabled:opacity-50 text-sm"
                    >
                        [1] 基础测试 (SYNC)
                    </button>
                    <button 
                        @click="runWorkerOnly" 
                        :disabled="isGenerating"
                        class="bg-retro-amber/80 text-black font-bold px-4 py-2 hover:bg-retro-amber transition-all disabled:opacity-50 text-sm"
                    >
                        [2] 空闲线程测试
                    </button>
                    <button 
                        @click="runUltimateOptimization" 
                        :disabled="isGenerating"
                        class="bg-retro-primary text-black font-bold px-4 py-2 hover:bg-white hover:text-black transition-all disabled:opacity-50 text-sm shadow-[0_0_15px_rgba(0,255,65,0.4)]"
                    >
                        [3] 极致优化 (SLICED)
                    </button>
                 </div>
                 <div class="text-xs text-stone-400 mt-1">
                      基础测试模式会卡顿页面 (预期行为)
                 </div>
             </div>
             
             <!-- Metrics & Chart -->
             <div class="flex gap-8 items-center">
                 <div ref="comparisionChartRef" class="w-64 h-24 bg-black/30 border border-retro-primary/20"></div>
                 
                 <div class="flex gap-8 font-bold text-xl">
                     <div class="flex flex-col items-center">
                         <span class="text-xs text-retro-primary/60">FPS</span>
                         <span :class="fps > 50 ? 'text-retro-primary' : 'text-retro-red'">{{ fps }}</span>
                     </div>
                     <div class="flex flex-col items-center">
                         <span class="text-xs text-retro-primary/60">MEMORY</span>
                         <span>{{ memory }} MB</span>
                     </div>
                     <div class="flex flex-col items-center">
                         <span class="text-xs text-retro-primary/60">TIME</span>
                         <span class="text-retro-amber">{{ generationTime }}ms</span>
                     </div>
                 </div>
             </div>
        </div>
    </div>
    
    <!-- Workspace -->
    <div class="flex-1 flex relative overflow-hidden">
        <!-- Sidebar Info -->
        <div class="w-64 border-r border-retro-primary/30 p-4 text-sm flex flex-col gap-4">
            <div class="p-3 border border-retro-primary/30 bg-retro-primary/5">
                <!-- <h3 class="font-bold mb-2 text-retro-amber">技术栈:</h3> -->
                <ul class="list-disc list-inside space-y-2 text-retro-primary/80">
                    <!-- <li>Web Workers (Thread Offloading)</li>
                    <li>Virtual Scrolling (DOM Reuse)</li>
                    <li>RequestIdleCallback (Time Slicing)</li>
                    <li>Object Freezing (Vue Perf)</li> -->
                </ul>
            </div>
            
             <div v-if="progress > 0 && progress < 100" class="p-4 border border-retro-primary/30">
                 <div class="text-xs mb-1">GENERATING DATA...</div>
                 <div class="h-2 bg-black w-full border border-retro-primary">
                     <div class="h-full bg-retro-primary transition-all duration-300" :style="{ width: progress + '%' }"></div>
                 </div>
                 <div class="text-right mt-1">{{ progress }}%</div>
             </div>
        </div>

        <!-- Chart Area -->
        <div class="flex-1 bg-gradient-to-br from-gray-900 to-black relative">
            <VirtualChartList 
                v-if="chartData.length > 0" 
                :items="chartData" 
                :item-height="200" 
                height="100%" 
            />
            
            <!-- <div v-else class="absolute inset-0 flex items-center justify-center flex-col text-retro-primary/50 gap-4">
                <div class="text-6xl animate-bounce">⇩</div>
                <div>点击左上角测试</div>
            </div> -->
        </div>
    </div>
  </div>
</template>
