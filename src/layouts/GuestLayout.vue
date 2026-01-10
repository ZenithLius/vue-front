<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Languages } from 'lucide-vue-next'

const { locale } = useI18n()

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-slate-900 relative">
    
    <!-- Language Switcher -->
    <div class="absolute top-6 right-6 z-50">
      <button 
        @click="toggleLanguage"
        class="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-95"
      >
        <Languages class="w-4 h-4" />
        <span class="text-xs font-bold tracking-wide">{{ locale.toUpperCase() }}</span>
      </button>
    </div>

    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <router-view />
    </div>
  </div>
</template>
