<!-- src/components/SimpleLineChart.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  data: {
    id: number
    title: string
    data: number[]
    labels: string[]
  }
}>()

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return
  
  // 必须确保 DOM 已渲染
  chartInstance = echarts.init(chartRef.value)
  
  const option = {
    animation: false, // 禁用动画以提高性能
    backgroundColor: 'transparent',
    grid: {
      top: 30, right: 10, bottom: 20, left: 30
    },
    title: {
      text: props.data.title,
      textStyle: {
        color: '#00ff41',
        fontSize: 12,
        fontFamily: 'VT323'
      },
      left: 10,
      top: 5
    },
    xAxis: {
      type: 'category',
      data: props.data.labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLine: { show: false },
      axisLabel: { show: false }
    },
    series: [
      {
        data: props.data.data,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 1,
          color: '#00ff41'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 255, 65, 0.3)' },
            { offset: 1, color: 'rgba(0, 255, 65, 0)' }
          ])
        }
      }
    ]
  }
  
  chartInstance.setOption(option)
}

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})

// 监听数据变化（虽然虚拟列表通常是销毁重建，但为了健壮性）
watch(() => props.data, () => {
    if (chartInstance) {
        chartInstance.setOption({
            series: [{
                data: props.data.data
            }]
        })
    }
}, { deep: true })

</script>

<template>
  <div class="simple-chart-container bg-black/50 border border-retro-primary/20 backdrop-blur-sm">
    <div ref="chartRef" class="w-full h-full"></div>
  </div>
</template>

<style scoped>
.simple-chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
