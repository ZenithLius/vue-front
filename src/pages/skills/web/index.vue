<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Globe, Layers, Layout } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const router = useRouter()
const { t } = useI18n()

const topics = computed(() => [
  {
    id: 'responsive',
    name: 'Responsive Layouts',
    desc: 'Grid, Flexbox & Container Queries',
    path: '/skills/web/layout',
    icon: Layout,
    color: 'text-blue-500 bg-blue-50'
  },
  {
    id: 'api',
    name: 'API Integration',
    desc: 'REST, GraphQL & WebSocket Patterns',
    path: '/skills/web/api',
    icon: Globe,
    color: 'text-cyan-500 bg-cyan-50'
  }
])
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold text-skin-base">{{ t('sidebar.web-skills') }}</h2>
        <p class="text-skin-muted mt-2">Modern web development techniques and patterns.</p>
      </div>
    </div>

    <!-- Currently using static content as placeholders for demonstration -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="topic in topics" 
        :key="topic.id"
        class="group bg-skin-card border border-skin-base rounded-xl p-6 cursor-pointer hover:shadow-md hover:border-skin-primary/30 transition-all duration-300"
      >
        <div class="flex items-start justify-between mb-4">
          <div :class="`p-3 rounded-lg ${topic.color} group-hover:scale-110 transition-transform`">
            <component :is="topic.icon" class="w-6 h-6" />
          </div>
        </div>
        
        <h3 class="font-semibold text-lg text-skin-base mb-2">{{ topic.name }}</h3>
        <p class="text-sm text-skin-muted leading-relaxed">
          {{ topic.desc }}
        </p>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
    layout: dashboard
</route>
