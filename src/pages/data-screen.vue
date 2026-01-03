<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import PerformanceMonitor from '../components/PerformanceMonitor.vue'

const router = useRouter()
const isFullscreen = ref(false)
const showPerformanceLab = ref(false) // Lab Toggle
const currentTime = ref('')

// 图表 DOM 元素引用
const memoryChartRef = ref<HTMLElement | null>(null)
const networkChartRef = ref<HTMLElement | null>(null)
const skillsChartRef = ref<HTMLElement | null>(null)
const apiChartRef = ref<HTMLElement | null>(null)
const compatibilityChartRef = ref<HTMLElement | null>(null)

// 大屏容器引用
const screenRef = ref<HTMLElement | null>(null)

// 图表实例
let charts: echarts.ECharts[] = []
const intervals: number[] = [] // 存储定时器ID
const currentThemeColor = ref('#00ff41') // Default Green


// 导航
const goBack = () => {
  router.push('/')
}

// 时间更新
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString() + ' ' + (now.getMilliseconds() / 10).toFixed(0).padStart(2, '0')
}

// 全屏切换
const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    await document.exitFullscreen()
    isFullscreen.value = false
  }
}

// ===============================================
// 核心代码: 缩放处理 (Scale-to-Fit Logic)
// ===============================================
const handleResize = () => {
  if (screenRef.value) {
    // 设计稿尺寸：1920 x 1080
    const designWidth = 1920
    const designHeight = 1080
    
    // 获取当前视口尺寸
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // 计算缩放比例 (保持比例)
    const scaleX = windowWidth / designWidth
    const scaleY = windowHeight / designHeight
    
    // 方案 B: 强制拉伸铺满
    screenRef.value.style.transform = `scale(${scaleX}, ${scaleY}) translate(-50%, -50%)`
  }
}

// 图表配置与初始化
const initCharts = (themeColor = currentThemeColor.value) => {
  // Clear existing
  charts.forEach(c => c.dispose())
  charts = []

  const commonTextStyle = {
    fontFamily: '"VT323", monospace',
    color: themeColor,
    fontSize: 24 // 增大通用字体大小
  }


  // 1. 内存使用 (仪表盘)
  if (memoryChartRef.value) {
    const chart = echarts.init(memoryChartRef.value)
    const option = {
      backgroundColor: 'transparent',
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['50%', '75%'], // 调整位置使其垂直居中
        radius: '85%', // 缩小半径以留出两侧空间显示标签
        min: 0,
        max: 800,
        splitNumber: 5,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.7, themeColor],
              [0.9, '#ffb000'],
              [1, '#ff0033']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 10,
          offsetCenter: [0, '-60%'],
          itemStyle: { color: 'auto' }
        },
        axisTick: { length: 12, lineStyle: { color: 'auto', width: 2 } },
        splitLine: { length: 20, lineStyle: { color: 'auto', width: 5 } },
        axisLabel: { color: themeColor, fontSize: 16, distance: -50, fontFamily: 'VT323' },
        title: { offsetCenter: [0, '-20%'], fontSize: 28, color: themeColor, fontFamily: 'VT323' },
        detail: {
          fontSize: 40,
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          formatter: '{value}MB',
          color: 'auto',
          fontFamily: 'VT323'
        },
        data: [{ 
          value: (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 70, 
          name: '内存使用' 
        }]
      }]
    }
    chart.setOption(option)
    charts.push(chart)
  }

  // 2. 网络延迟 (折线图)
  if (networkChartRef.value) {
    const chart = echarts.init(networkChartRef.value)
    const option = {
      backgroundColor: 'transparent',
      title: { text: '网络延迟', left: 'center', textStyle: commonTextStyle },
      grid: { top: 50, bottom: 20, left: 50, right: 30, containLabel: true },
      xAxis: {
        type: 'category',
        data: ['0s', '1s', '2s', '3s', '4s', '5s', '6s'],
        axisLine: { lineStyle: { color: themeColor } },
        axisLabel: { fontFamily: 'VT323', fontSize: 18 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: '#004411' } }, // Keep dark green as generic grid or adjust if needed
        axisLine: { lineStyle: { color: themeColor } },
        axisLabel: { fontFamily: 'VT323', fontSize: 18 }
      },
      series: [{
        data: [20, 32, 25, 45, 22, 18, 24],
        type: 'line',
        smooth: true,
        lineStyle: { color: '#ffb000', width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 176, 0, 0.5)' },
            { offset: 1, color: 'rgba(255, 176, 0, 0)' }
          ])
        },
        symbol: 'none'
      }]
    }
    chart.setOption(option)
    charts.push(chart)
  }

  // 3. 前端技能 (雷达图)
  if (skillsChartRef.value) {
    const chart = echarts.init(skillsChartRef.value)
    const option = {
      backgroundColor: 'transparent',
      title: { text: 'SKILL_MATRIX_V2.0', left: 'center', top: '5%', textStyle: {
        ...commonTextStyle,
        fontSize: 32
      }},
      radar: {
        indicator: [
          { name: 'VUE.JS', max: 100 },
          { name: 'FLUTTER', max: 100 },
          { name: 'TYPESCRIPT', max: 100 },
          { name: 'NODE.JS', max: 100 },
          { name: 'WEBGL', max: 100 },
          { name: 'CSS/TAILWIND', max: 100 }
        ],
        shape: 'circle',
        splitNumber: 5,
        axisName: { color: themeColor, fontSize: 24, fontFamily: 'VT323' },
        splitLine: {
          lineStyle: {
            color: [
              'rgba(255, 255, 255, 0.1)',
              'rgba(255, 255, 255, 0.2)',
              themeColor
            ]
          }
        },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: themeColor } }
      },
      series: [{
        name: 'Skills',
        type: 'radar',
        lineStyle: { width: 3, color: '#00fff0' },
        areaStyle: { color: 'rgba(0, 255, 240, 0.4)' },
        data: [{ value: [95, 80, 90, 75, 70, 95], name: 'Current Level' }]
      }]
    }
    chart.setOption(option)
    charts.push(chart)
  }

  // 4. API 使用情况 (水平柱状图)
  if (apiChartRef.value) {
    const chart = echarts.init(apiChartRef.value)
    const option = {
      backgroundColor: 'transparent',
      title: { text: 'API KNOWLEDGE', left: 'left', textStyle: commonTextStyle },
      grid: { top: 40, bottom: 20, left: 100, right: 30 },
      xAxis: {
        type: 'value',
        splitLine: { show: false },
        axisLabel: { show: false }
      },
      yAxis: {
        type: 'category',
        data: ['DOM', 'Fetch', 'Canvas', 'Storage', 'Workers', 'WebRTC'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: themeColor, fontFamily: 'VT323', fontSize: 20 }
      },
      series: [{
        type: 'bar',
        data: [98, 95, 90, 92, 85, 80],
        barWidth: 20,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: themeColor },
            { offset: 1, color: '#000000' }
          ]),
          borderRadius: [0, 4, 4, 0]
        },
        label: {
          show: true,
          position: 'right',
          color: themeColor,
          fontFamily: 'VT323',
          formatter: '{c}%',
          fontSize: 18
        }
      }]
    }
    chart.setOption(option)
    charts.push(chart)
  }

  // 5. 浏览器兼容性 (饼图)
  if (compatibilityChartRef.value) {
    const chart = echarts.init(compatibilityChartRef.value)
    const option = {
      backgroundColor: 'transparent',
      title: { text: '浏览器兼容性', left: 'center', textStyle: commonTextStyle },
      tooltip: { trigger: 'item' },
      legend: { 
        bottom: '0%', 
        textStyle: { color: themeColor, fontFamily: 'VT323', fontSize: 18 },
        itemWidth: 25,
        itemHeight: 14
      },
      series: [{
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 2,
          borderColor: '#000',
          borderWidth: 2
        },
        label: { show: false },
        data: [
          { value: 92, name: 'Chrome', itemStyle: { color: themeColor } },
          { value: 4, name: 'Firefox', itemStyle: { color: '#ffb000' } },
          { value: 3, name: 'Safari', itemStyle: { color: '#00fff0' } },
          { value: 1, name: 'Other', itemStyle: { color: '#ff0033' } }
        ]
      }]
    }
    chart.setOption(option)
    charts.push(chart)
  }
}

// 随机数据动画
const animateCharts = () => {
    // 动画: 内存仪表盘 (真实数据)
    const memChart = echarts.getInstanceByDom(memoryChartRef.value as HTMLElement)
    if(memChart) {
        const timer = window.setInterval(() => {
             const memory = (performance as any).memory
             const value = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : Math.floor(Math.random() * 40) + 40
             memChart.setOption({
                series: [{
                    data: [{ value, name: '内存使用' }]
                }]
             })
        }, 2000)
        intervals.push(timer)
    }

    // 动画: 网络延迟 (真实数据)
     const netChart = echarts.getInstanceByDom(networkChartRef.value as HTMLElement)
      if(netChart) {
         // 初始化数据队列
         const dataQueue = Array(7).fill(0)
         
         const timer = window.setInterval(async () => {
             // 测量延迟
             const start = performance.now()
             try {
                await fetch('/?t=' + Date.now(), { method: 'HEAD' })
             } catch(e) {}
             const end = performance.now()
             const latency = Math.round(end - start)
             
             // 更新队列
             dataQueue.shift()
             dataQueue.push(latency)

             netChart.setOption({ series: [{ data: dataQueue }] })
         }, 3000) // 3秒更新一次，避免请求过于频繁
         intervals.push(timer)
     }
}

// 生命周期
let timer: number
const handleThemeChange = (e: any) => {
  currentThemeColor.value = e.detail.color
  initCharts(currentThemeColor.value)
}

onMounted(async () => {
  timer = window.setInterval(updateTime, 50)
  
  // Get initial color from CSS variable if possible, or fallback
  const rootStyle = getComputedStyle(document.documentElement)
  const cssColor = rootStyle.getPropertyValue('--retro-primary').trim()
  if (cssColor) currentThemeColor.value = cssColor

  window.addEventListener('theme-change', handleThemeChange)
  window.addEventListener('resize', handleResize)
  document.addEventListener('fullscreenchange', () => {
      isFullscreen.value = !!document.fullscreenElement
  })

  await nextTick()
  initCharts()
  animateCharts()
  
  handleResize()
})

onUnmounted(() => {
  clearInterval(timer)
  
  clearInterval(timer)
  intervals.forEach(i => clearInterval(i)) // 清理图表动画定时器
  
  window.removeEventListener('theme-change', handleThemeChange)
  window.removeEventListener('resize', handleResize)
  charts.forEach(chart => chart.dispose())
})
</script>

<template>
  <div class="h-screen w-full bg-retro-bg text-retro-primary font-retro overflow-hidden relative selection:bg-retro-primary selection:text-retro-bg">
    
    <!-- 
      ===============================================
      核心代码: 网格遮罩 (Grid Overlay)
      使用 pointer-events-none 确保点击穿透，
      fixed inset-0 确保始终覆盖全屏
      ===============================================
    -->
    <div class="pointer-events-none fixed inset-0 z-50">
        <div class="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none"></div>
    </div>

    <!-- 
      ===============================================
      核心代码: 缩放容器 (Scale Container)
      固定 1920x1080 尺寸，通过 CSS transform 进行缩放
      transform-origin: left top 设置变换原点为左上角
      absolute top-1/2 left-1/2 配合 transform translate 实现居中 (逻辑在JS中处理)
      ===============================================
    -->
    <div 
      ref="screenRef"
      class="fixed top-1/2 left-1/2 w-[1920px] h-[1080px] bg-retro-bg flex flex-col origin-center"
      style="transform-origin: left top;"
    >
      <!-- Header -->
      <header class="h-20 border-b-2 border-retro-primary flex items-center justify-between px-8 shrink-0 relative z-20 bg-retro-bg/90 backdrop-blur">
        <div class="flex items-center gap-6">
          <button @click="goBack" class="hover:bg-retro-primary hover:text-retro-bg px-4 py-2 transition-colors duration-200 border-2 border-retro-primary text-2xl font-bold">
            [<] BACK
          </button>
          <div class="h-10 w-[3px] bg-retro-primary/50"></div>
          <h1 class="text-4xl font-pixel text-glow uppercase tracking-[0.2em]">
              数据大屏_v1
          </h1>
        </div>
        
        <div class="flex items-center gap-8">
          <div class="flex flex-col items-end text-sm text-retro-amber font-mono">
             <!-- <span>SYS.STATUS: OPTIMAL</span> -->
             <button @click="showPerformanceLab = true" class="text-[24px]  hover:opacity-100 hover:text-retro-primary cursor-pointer transition-all">
                 [10K折线图]
             </button>
             <!-- <span>NET.CONN: SECURE</span> -->
          </div>
          <div class="text-3xl font-bold tracking-widest font-mono">
              {{ currentTime }}
          </div>
           <button @click="toggleFullscreen" class="hover:text-retro-amber transition-colors text-xl">
              [{{ isFullscreen ? 'EXIT' : 'FULL' }}]
          </button>
        </div>
      </header>

      <!-- Performance Monitor Overlay -->
      <PerformanceMonitor :visible="showPerformanceLab" @close="showPerformanceLab = false" />

      <!-- Main Content Grid -->
      <main class="flex-1 p-6 grid grid-cols-4 gap-6 min-h-0 relative z-10">
        
        <!-- 左侧栏: 性能监控 -->
        <div class="col-span-1 flex flex-col gap-6 min-h-0">
          <!-- Card 1 -->
          <section class="flex-1 border-2 border-retro-primary/30 bg-black/40 backdrop-blur-sm relative box-border group hover:border-retro-primary/80 transition-colors p-4 flex flex-col">
              <div class="absolute top-0 left-0 bg-retro-primary text-retro-bg px-3 py-1 text-lg font-bold opacity-80">JS内容监控</div>
              <div class="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-retro-primary"></div>
              <div ref="memoryChartRef" class="w-full h-full min-h-[200px]"></div>
          </section>
          
          <!-- Card 2 -->
          <section class="flex-1 border-2 border-retro-primary/30 bg-black/40 backdrop-blur-sm relative box-border group hover:border-retro-primary/80 transition-colors p-4 flex flex-col">
               <div class="absolute top-0 left-0 bg-retro-primary text-retro-bg px-3 py-1 text-lg font-bold opacity-80">网络延迟</div>
               <div class="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-retro-primary"></div>
               <div ref="networkChartRef" class="w-full h-full min-h-[200px]"></div>
          </section>
        </div>

        <!-- 中间栏: 核心指标 -->
        <div class="col-span-2 flex flex-col gap-6 min-h-0">
           <section class="flex-1 border-4 border-retro-primary bg-black/40 backdrop-blur-sm relative box-border p-4 flex flex-col shadow-[0_0_30px_rgba(0,255,65,0.15)]">
               <!-- 装饰元素 -->
               <div class="absolute top-0 left-1/2 -translate-x-1/2 bg-retro-primary text-retro-bg px-12 py-1 clip-path-trapezoid font-bold text-2xl tracking-widest">核心指标</div>
               
               <!-- Center Chart -->
               <div class="flex-1 flex flex-col relative top-8">
                   <div ref="skillsChartRef" class="flex-1 min-h-[400px] w-full"></div>
                   
                   <!-- 底部统计行 -->
                   <div class="h-32 grid grid-cols-3 gap-4 mt-4 px-8 border-t-2 border-dashed border-retro-primary/30 ">
                       <div class="flex flex-col items-center justify-center ">
                           <span class="text-retro-amber text-lg block mb-2">PROJECTS</span>
                           <span class="text-5xl font-pixel animate-pulse">42</span>
                       </div>
                        <div class="flex flex-col items-center justify-center border-x-2 border-retro-primary/20">
                           <span class="text-retro-blue text-lg block mb-2">COMMIT_RATE</span>
                           <span class="text-5xl font-pixel">98%</span>
                       </div>
                        <div class="flex flex-col items-center justify-center">
                           <span class="text-retro-red text-lg block mb-2">BUGS</span>
                           <span class="text-5xl font-pixel">0</span>
                       </div>
                   </div>
               </div>
           </section>
        </div>

        <!-- 右侧栏: API & 统计 -->
        <div class="col-span-1 flex flex-col gap-6 min-h-0">
            <section class="flex-1 border-2 border-retro-primary/30 bg-black/40 backdrop-blur-sm relative box-border group hover:border-retro-primary/80 transition-colors p-4 flex flex-col">
               <div class="absolute top-0 right-0 bg-retro-primary text-retro-bg px-3 py-1 text-lg font-bold opacity-80">API相关</div>
               <div class="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-retro-primary"></div>
               <div ref="apiChartRef" class="w-full h-full min-h-[200px]"></div>
            </section>

            <section class="flex-1 border-2 border-retro-primary/30 bg-black/40 backdrop-blur-sm relative box-border group hover:border-retro-primary/80 transition-colors p-4 flex flex-col">
               <div class="absolute top-0 right-0 bg-retro-primary text-retro-bg px-3 py-1 text-lg font-bold opacity-80">浏览器兼容性</div>
               <div class="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-retro-primary"></div>
               <div ref="compatibilityChartRef" class="w-full h-full min-h-[200px]"></div>
            </section>
        </div>
        
      </main>
      
      <!-- Footer marquee -->
      <div class="h-10 bg-retro-primary text-retro-bg flex items-center overflow-hidden shrink-0 text-lg font-bold border-t-2 border-retro-bg">
          <div class="whitespace-nowrap animate-marquee">
             大屏
          </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.text-glow {
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.7);
}

.clip-path-trapezoid {
    clip-path: polygon(0 0, 100% 0, 90% 100%, 10% 100%);
}

.animate-marquee {
    animation: marquee 20s linear infinite;
    padding-left: 100%;
}

@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
}

/* Custom scrollbar for webkit */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-track {
    background: #000;
}
::-webkit-scrollbar-thumb {
  background: var(--retro-primary);

}
</style>
