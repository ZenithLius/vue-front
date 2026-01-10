<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowRight, Code2, FileCode, Palette, Zap, Database, Box } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center space-y-8 py-12">
    <!-- Hero Text -->
    <div class="space-y-4 max-w-2xl">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium border border-indigo-100 mb-4">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        {{ t('home.version') }}
      </div>
      
      <h1 class="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight" v-html="t('home.hero_title')"></h1>
      
      <p class="text-lg text-gray-600 leading-relaxed">
        {{ t('home.hero_subtitle') }}
      </p>
    </div>

    <!-- CTA -->
    <div class="flex gap-4">
      <button 
        @click="router.push('/login')"
        class="px-8 py-3.5 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
      >
        {{ t('home.get_started') }}
        <ArrowRight class="w-4 h-4" />
      </button>
      <button 
        class="px-8 py-3.5 bg-white text-gray-700 border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-all hover:border-gray-300"
      >
        {{ t('home.docs') }}
      </button>
    </div>

    <!-- Tech Stack Grid -->
    <div class="mt-20 w-full max-w-5xl">
       <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-gray-900">{{ t('home.built_with') }}</h2>
          <p class="text-gray-500 mt-2">{{ t('home.tech_desc') }}</p>
       </div>

       <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          <!-- Vue -->
          <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Code2 class="w-5 h-5" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-1">{{ t('home.tech_vue') }}</h3>
            <p class="text-sm text-gray-500">{{ t('home.tech_vue_desc') }}</p>
          </div>
          
          <!-- TypeScript -->
          <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileCode class="w-5 h-5" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-1">{{ t('home.tech_ts') }}</h3>
            <p class="text-sm text-gray-500">{{ t('home.tech_ts_desc') }}</p>
          </div>

          <!-- Tailwind -->
          <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div class="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Palette class="w-5 h-5" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-1">{{ t('home.tech_tailwind') }}</h3>
            <p class="text-sm text-gray-500">{{ t('home.tech_tailwind_desc') }}</p>
          </div>

          <!-- Vite -->
          <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div class="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap class="w-5 h-5" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-1">{{ t('home.tech_vite') }}</h3>
            <p class="text-sm text-gray-500">{{ t('home.tech_vite_desc') }}</p>
          </div>

          <!-- Supabase -->
          <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div class="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Database class="w-5 h-5" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-1">{{ t('home.tech_supabase') }}</h3>
            <p class="text-sm text-gray-500">{{ t('home.tech_supabase_desc') }}</p>
          </div>

          <!-- Pinia -->
          <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Box class="w-5 h-5" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-1">{{ t('home.tech_pinia') }}</h3>
            <p class="text-sm text-gray-500">{{ t('home.tech_pinia_desc') }}</p>
          </div>
       </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: guest
</route>
