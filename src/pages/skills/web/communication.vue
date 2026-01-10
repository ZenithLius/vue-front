<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Radio, Database, ExternalLink, Send } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()

// ==========================================
// Types
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
// State
// ==========================================
const logs = ref<LogEntry[]>([])
const messageInput = ref('')
const channelName = 'tech_nest_comm_channel'
const storageKey = 'tech_nest_storage_msg'
let broadcastChannel: BroadcastChannel | null = null
const logContainerRef = ref<HTMLElement | null>(null)

const MAX_LOGS = 100

// ==========================================
// Logging System
// ==========================================
const addLog = (type: LogType, message: string, source: string = 'LOCAL') => {
  const now = new Date()
  const timeString = now.toLocaleTimeString()
  
  logs.value.push({
    id: Date.now() + Math.random(),
    timestamp: timeString,
    type,
    message,
    source
  })

  if (logs.value.length > MAX_LOGS) {
    logs.value.shift()
  }

  nextTick(() => {
    if (logContainerRef.value) {
      logContainerRef.value.scrollTop = logContainerRef.value.scrollHeight
    }
  })
}

// ==========================================
// 1. BroadcastChannel API
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
// 2. LocalStorage API
// ==========================================
const initStorageListener = () => {
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey && event.newValue) {
      // Parse payload to remove timestamp if needed, currently just showing raw
      addLog('STORAGE', event.newValue, 'REMOTE')
    }
  })
}

const sendStorageMessage = () => {
  if (!messageInput.value) return

  const msg = messageInput.value
  const payload = `${msg} [${Date.now()}]`
  
  localStorage.setItem(storageKey, payload)
  addLog('STORAGE', payload, 'ME')
  messageInput.value = ''
}

// ==========================================
// 3. Page Visibility API
// ==========================================
const initVisibilityListener = () => {
  document.addEventListener('visibilitychange', () => {
    const state = document.hidden ? '隐藏' : '显示'
    addLog('SYSTEM', `当前标签页: ${state}`)
  })
}

// ==========================================
// Lifecycle
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

const openNewTab = () => {
  window.open(window.location.href, '_blank')
}
</script>

<template>
  <div class="h-full flex flex-col space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-skin-base flex items-center gap-2">
            {{ t('demos.comm.title') }}
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 animate-pulse">
                Live
            </span>
        </h2>
        <p class="text-skin-muted">{{ t('demos.comm.subtitle') }}</p>
      </div>
      <button 
        @click="openNewTab"
        class="flex items-center gap-2 px-4 py-2 bg-skin-card border border-skin-base rounded-lg text-sm font-medium text-skin-primary hover:bg-skin-base transition-colors shadow-sm"
      >
        <ExternalLink class="w-4 h-4" /> {{ t('demos.comm.open_new_tab') }}
      </button>
    </div>

    <div class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
      
      <!-- Control Panel -->
      <div class="space-y-6">
        <!-- Message Input -->
        <div class="bg-skin-card p-6 rounded-xl border border-skin-base shadow-sm">
           <h3 class="font-semibold text-skin-base mb-4 flex items-center gap-2">
              <Send class="w-4 h-4 text-skin-primary" /> Send Message
           </h3>
           
           <div class="space-y-4">
             <input 
               v-model="messageInput"
               type="text" 
               :placeholder="t('demos.comm.input_placeholder')"
               class="w-full bg-skin-base border border-skin-base rounded-lg p-3 text-skin-base focus:outline-none focus:ring-2 focus:ring-skin-primary focus:border-transparent transition-all"
               @keyup.enter="sendBroadcast"
             />
             
             <div class="grid grid-cols-2 gap-3">
               <button 
                 @click="sendBroadcast"
                 class="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:shadow-md transition-all active:scale-95"
               >
                 <Radio class="w-6 h-6" />
                 <span class="text-sm font-bold">{{ t('demos.comm.send_broadcast') }}</span>
               </button>
               
               <button 
                 @click="sendStorageMessage"
                 class="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:shadow-md transition-all active:scale-95"
               >
                 <Database class="w-6 h-6" />
                 <span class="text-sm font-bold">{{ t('demos.comm.send_storage') }}</span>
               </button>
             </div>
           </div>
        </div>

        <!-- Info Card -->
        <!-- <div class="bg-skin-card p-6 rounded-xl border border-skin-base shadow-sm text-sm text-skin-muted space-y-3">
           <div class="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
               <strong class="text-indigo-700 block mb-1">BroadcastChannel</strong>
               <span class="text-indigo-600/80">Efficient one-to-many communication between same-origin contexts (tabs, iframes, workers).</span>
           </div>
           <div class="p-3 bg-amber-50 rounded-lg border border-amber-100">
               <strong class="text-amber-700 block mb-1">LocalStorage</strong>
               <span class="text-amber-600/80">Persistent storage that triggers 'storage' events across tabs, useful for synchronization.</span>
           </div>
           
           <div class="pt-2 border-t border-skin-base/20">
              <p class="text-xs text-center text-skin-muted/70">
                  Try opening this page in multiple tabs to test synchronization.
              </p>
           </div>
        </div> -->
      </div>

      <!-- Live Logs -->
      <div class="lg:col-span-2 bg-skin-card rounded-xl border border-skin-base shadow-sm flex flex-col overflow-hidden">
        <div class="p-4 border-b border-skin-base bg-skin-base/50 flex justify-between items-center">
          <h3 class="font-semibold text-skin-base">{{ t('demos.comm.logs_title') }}</h3>
          <span class="text-xs text-skin-muted font-mono">Channel: {{ channelName }}</span>
        </div>
        
        <div 
          ref="logContainerRef"
          class="flex-1 overflow-auto p-4 space-y-3 custom-scrollbar bg-skin-base/30"
        >
          <div 
            v-for="log in logs" 
            :key="log.id"
            class="flex gap-3 text-sm animate-in fade-in slide-in-from-left-2 duration-300"
          >
            <div class="flex-none w-20 text-xs text-skin-muted font-mono pt-0.5">{{ log.timestamp }}</div>
            <div class="flex-1">
               <div class="flex items-center gap-2 mb-1">
                 <span 
                   class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
                   :class="{
                     'bg-indigo-100 text-indigo-700': log.type === 'BROADCAST',
                     'bg-amber-100 text-amber-700': log.type === 'STORAGE',
                     'bg-gray-200 text-gray-700': log.type === 'SYSTEM'
                   }"
                 >
                   {{ log.type }}
                 </span>
                 <span class="text-xs text-skin-muted font-medium" v-if="log.source">{{ log.source }}</span>
               </div>
               <div class="text-skin-base break-all">{{ log.message }}</div>
            </div>
          </div>
          
          <div v-if="logs.length === 0" class="h-full flex flex-col items-center justify-center text-skin-muted opacity-50">
            <Radio class="w-12 h-12 mb-2" />
            <p>{{ t('demos.comm.waiting') }}</p>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: dashboard
</route>

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
