<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ==========================================
// 类型定义
// ==========================================
type LogType = 'BROADCAST' | 'STORAGE' | 'SYSTEM'

interface LogEntry {
  id: number
  timestamp: string
  type: LogType
  message: string
  source?: string
}

// ==========================================
// 状态管理
// ==========================================
const logs = ref<LogEntry[]>([])
const messageInput = ref('')
const channelName = '页面通信API以及标签激活状态API'
const storageKey = 'demo_storage_message'
let broadcastChannel: BroadcastChannel | null = null
const logContainerRef = ref<HTMLElement | null>(null)

// 性能优化：限制最大日志数量以防止 DOM 膨胀
const MAX_LOGS = 100

// ==========================================
// 日志系统
// ==========================================
const addLog = (type: LogType, message: string, source: string = 'LOCAL') => {
  const now = new Date()
  const timeString = now.toLocaleTimeString() + '.' + now.getMilliseconds().toString().padStart(3, '0')
  
  logs.value.push({
    id: Date.now() + Math.random(),
    timestamp: timeString,
    type,
    message,
    source
  })

  // 性能优化：保持日志数量可控
  if (logs.value.length > MAX_LOGS) {
    logs.value.shift()
  }

  // 自动滚动到底部
  nextTick(() => {
    if (logContainerRef.value) {
      logContainerRef.value.scrollTop = logContainerRef.value.scrollHeight
    }
  })
}

const getLogColor = (type: LogType) => {
  switch (type) {
    case 'BROADCAST': return 'text-retro-blue border-retro-blue'
    case 'STORAGE': return 'text-retro-amber border-retro-amber'
    case 'SYSTEM': return 'text-retro-primary border-retro-primary'
    default: return 'text-white'
  }
}

// ==========================================
// 1. BroadcastChannel API（广播通道API - 核心API）
// ==========================================
const initBroadcastChannel = () => {
  broadcastChannel = new BroadcastChannel(channelName)
  
  broadcastChannel.onmessage = (event) => {
    addLog('BROADCAST', event.data, 'REMOTE')
  }
}

const sendBroadcast = () => {
  if (!messageInput.value) return
  
  const msg = messageInput.value
  broadcastChannel?.postMessage(msg)
  addLog('BROADCAST', msg, 'ME')
  messageInput.value = ''
}

// ==========================================
// 2. LocalStorage API（本地存储API - 核心API）
// ==========================================
const initStorageListener = () => {
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey && event.newValue) {
      addLog('STORAGE', event.newValue, 'REMOTE')
    }
  })
}

const sendStorageMessage = () => {
  if (!messageInput.value) return

  const msg = messageInput.value
  // 必须改变值才能触发其他标签页的事件
  // 添加时间戳确保唯一性
  const payload = `${msg} [${Date.now()}]`
  
  localStorage.setItem(storageKey, payload)
  addLog('STORAGE', payload, 'ME')
  messageInput.value = ''
}

// ==========================================
// 3. Page Visibility API（页面可见性API - 核心API）
// ==========================================
const initVisibilityListener = () => {
  document.addEventListener('visibilitychange', () => {
    const state = document.hidden ? '标签页关闭 ' : '标签页打开 '
    addLog('SYSTEM', `Page State Changed: ${state}`)
  })
}

// ==========================================
// 生命周期钩子
// ==========================================
onMounted(() => {
  initBroadcastChannel()
  initStorageListener()
  initVisibilityListener()
  
  addLog('SYSTEM', 'Communication Channels Initialized')
})

onUnmounted(() => {
  broadcastChannel?.close()
})
</script>

<template>
  <div class="max-w-6xl mx-auto h-full flex flex-col p-4">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 border-b-4 border-retro-primary pb-4 shrink-0">
      <div class="flex items-center">
        <!-- <button @click="router.push('/skills/vue')" class="mr-4 text-retro-primary hover:text-retro-amber text-xl">
          < [BACK]
        </button> -->
        <h2 class="text-2xl md:text-4xl">
          复制本页地址进行通信
        </h2>
      </div>
      <div class="font-mono text-xs md:text-sm text-right opacity-70">
        <p>{{ channelName }}</p>
      </div>
    </div>

    <div class="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
      
      <!-- Left: Control Panel -->
      <div class="md:w-1/3 flex flex-col gap-6 shrink-0">
        <div class="border-2 border-retro-primary p-4 bg-black/40">
          <h3 class="text-xl mb-4 text-retro-primary border-b border-retro-primary/30 pb-2">标签页通信</h3>
          
          <div class="flex flex-col gap-4">
            <input 
              v-model="messageInput"
              type="text" 
              placeholder="输入通信内容..."
              class="bg-black border border-retro-primary p-2 text-retro-primary placeholder-retro-primary/30 focus:outline-none focus:border-retro-amber focus:shadow-[0_0_10px_rgba(255,176,0,0.5)] transition-all font-mono"
              @keyup.enter="sendBroadcast"
            />
            
            <div class="grid grid-cols-1 gap-2">
              <button 
                @click="sendBroadcast"
                class="border border-retro-blue text-retro-blue p-2 hover:bg-retro-blue hover:text-black transition-colors font-bold flex items-center justify-center gap-2"
              >
                [BROADCAST_SEND]
                <span class="text-xs opacity-70"></span>
              </button>
              
              <button 
                @click="sendStorageMessage"
                class="border border-retro-amber text-retro-amber p-2 hover:bg-retro-amber hover:text-black transition-colors font-bold flex items-center justify-center gap-2"
              >
                [STORAGE_SEND]
                <span class="text-xs opacity-70"></span>
              </button>
            </div>
          </div>
          
          <!-- <div class="mt-6 text-xs text-retro-primary/60 font-mono">
            <p>> BroadcastChannel: 页面通信 (高效)</p>
            <p>> LocalStorage: 跨标签页同步 (持久化)</p>
          </div> -->
        </div>

        <!-- Visibility Status -->
        <!-- <div class="border-2 border-retro-primary p-4 bg-black/40 flex-1">
           <h3 class="text-xl mb-4 text-retro-primary border-b border-retro-primary/30 pb-2">页面激活状态</h3>
           <div class="flex items-center gap-2 mb-2">
             <div class="w-3 h-3 rounded-full bg-retro-primary animate-pulse"></div>
             <span>PAGE_VISIBLE</span>
           </div>
           <p class="text-xs text-retro-primary/60">
             试着关闭打开此浏览器标签
           </p>
        </div> -->
      </div>

      <!-- Right: Logs -->
      <div class="flex-1 border-2 border-retro-primary bg-black/80 flex flex-col min-h-0">
        <div class="p-2 border-b border-retro-primary/30 flex justify-between items-center bg-retro-primary/10">
          <h3 class="font-bold">通信日志</h3>
          <span class="text-xs font-mono">MAX_LINES: {{ MAX_LOGS }}</span>
        </div>
        
        <div 
          ref="logContainerRef"
          class="flex-1 overflow-auto p-4 font-mono text-sm space-y-2 custom-scrollbar"
        >
          <div 
            v-for="log in logs" 
            :key="log.id"
            class="border-l-2 pl-2 animate-in fade-in slide-in-from-left-2 duration-300"
            :class="getLogColor(log.type)"
          >
            <div class="flex justify-between text-xs opacity-70 mb-1">
              <span>[{{ log.timestamp }}]</span>
              <span>{{ log.source }}</span>
            </div>
            <div class="break-all">
              <span class="font-bold mr-2">{{ log.type }}:</span>
              {{ log.message }}
            </div>
          </div>
          
          <div v-if="logs.length === 0" class="text-center text-retro-primary/30 mt-20">
            WAITING_FOR_SIGNALS...
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #000;
  border-left: 1px solid #00ff41;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #00ff41;
  border: 1px solid #000;
}
</style>