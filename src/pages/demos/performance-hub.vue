<script setup lang="ts">
import { ref, defineAsyncComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Activity, Cpu, GitGraph } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

// Async load components
const DemoVirtualScroll = defineAsyncComponent(() => import('./performance.vue'))
const DemoTimeSlicing = defineAsyncComponent(() => import('./performance1.vue'))
const DemoVirtualTree = defineAsyncComponent(() => import('./performance2.vue'))

const activeTab = ref(0)

const tabs = computed(() => [
  { name: t('demos.perf.virtual_scroll'), desc: t('demos.perf.virtual_scroll_desc'), icon: Activity },
  { name: t('demos.perf.time_slicing'), desc: t('demos.perf.time_slicing_desc'), icon: Cpu },
  { name: t('demos.perf.virtual_tree'), desc: t('demos.perf.virtual_tree_desc'), icon: GitGraph }
])
</script>

<template>
  <div class="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between shrink-0">
      <div class="space-y-1">
        <h2 class="text-2xl font-bold text-skin-base">{{ t('demos.perf.title') }}</h2>
        <p class="text-sm text-skin-muted">{{ t('demos.perf.subtitle') }}</p>
      </div>
      
      <!-- Tabs -->
      <div class="flex p-1 bg-skin-base/50 rounded-lg border border-skin-base">
        <button 
          v-for="(tab, index) in tabs" 
          :key="index"
          @click="activeTab = index"
          class="flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium"
          :class="activeTab === index 
            ? 'bg-skin-card text-skin-primary shadow-sm ring-1 ring-black/5' 
            : 'text-skin-muted hover:text-skin-base'"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          <span class="hidden md:inline">{{ tab.name }}</span>
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="flex-1 overflow-hidden relative border border-skin-base bg-skin-card rounded-xl shadow-sm">
      <div v-if="activeTab === 0" class="h-full w-full">
        <DemoVirtualScroll embedded />
      </div>

      <div v-if="activeTab === 1" class="h-full w-full">
        <DemoTimeSlicing embedded />
      </div>

      <div v-if="activeTab === 2" class="h-full w-full">
        <DemoVirtualTree embedded />
      </div>
    </div>
    
    <!-- Footer Info -->
    <div class="text-center text-xs text-skin-muted">
      {{ t('demos.perf.running') }}: <span class="font-medium text-skin-primary">{{ tabs[activeTab].desc }}</span>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
    layout: dashboard
</route>
