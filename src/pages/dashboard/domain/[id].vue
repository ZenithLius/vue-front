<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { Code2, Terminal, ChevronRight, Copy, Check } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()

const domainId = computed(() => route.params.id as string)
const copiedId = ref<string | null>(null)

// Mock Data (In reality, fetch this from Supabase based on domainId)
const snippets = ref([
  {
    id: '1',
    title: 'Vue 3 Composition API Basics',
    description: 'A quick reference for setup script syntax.',
    code: `<script setup>
import { ref, onMounted } from 'vue'

const count = ref(0)
onMounted(() => console.log('mounted'))
<\/script>`,
    language: 'vue',
    tags: ['Vue', 'Frontend']
  },
  {
    id: '2',
    title: 'Tailwind Centering',
    description: 'The classic flexbox center trick.',
    code: `<div class="flex items-center justify-center h-screen">
  Centered Content
</div>`,
    language: 'html',
    tags: ['CSS', 'Tailwind']
  }
])

const copyCode = (code: string, id: string) => {
  navigator.clipboard.writeText(code)
  copiedId.value = id
  setTimeout(() => copiedId.value = null, 2000)
}

// Watch for domain changes to fetch new data
watch(domainId, (newId) => {
  console.log('Fetching data for:', newId)
  // fetchSnippets(newId)
})
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <span>{{ t('common.dashboard') }}</span>
      <ChevronRight class="w-4 h-4" />
      <span class="font-medium text-gray-900 capitalize">{{ t(\`sidebar.\${domainId}\`) }}</span>
    </div>

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 capitalize flex items-center gap-3">
          {{ t(\`sidebar.\${domainId}\`) }}
          <span class="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium border border-indigo-100">
            {{ snippets.length }} Records
          </span>
        </h1>
        <p class="text-gray-500 mt-2">Personal collection of code snippets and resources.</p>
      </div>
      <button class="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
        <Terminal class="w-4 h-4" />
        Add New Record
      </button>
    </div>

    <!-- Snippets Grid -->
    <div class="grid grid-cols-1 gap-6">
      <div v-for="snippet in snippets" :key="snippet.id" class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div class="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-lg text-gray-900 mb-1">{{ snippet.title }}</h3>
            <p class="text-gray-500 text-sm">{{ snippet.description }}</p>
          </div>
          <div class="flex gap-2">
            <span v-for="tag in snippet.tags" :key="tag" class="px-2 py-1 rounded-md bg-white border border-gray-200 text-xs text-gray-600 font-medium">
              {{ tag }}
            </span>
          </div>
        </div>
        
        <div class="relative group">
          <div class="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              @click="copyCode(snippet.code, snippet.id)"
              class="p-2 bg-gray-900/80 text-white rounded-md hover:bg-gray-900 transition-colors backdrop-blur-sm"
            >
              <Check v-if="copiedId === snippet.id" class="w-4 h-4 text-green-400" />
              <Copy v-else class="w-4 h-4" />
            </button>
          </div>
          <pre class="bg-[#1e1e1e] text-gray-300 p-6 overflow-x-auto text-sm font-mono leading-relaxed"><code>{{ snippet.code }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>
