<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Smartphone, Layers, Layout } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

// Placeholder content for Flutter section
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8 h-full flex flex-col items-center justify-center text-center">
    <div class="bg-blue-50 p-6 rounded-full">
        <Smartphone class="w-16 h-16 text-blue-500" />
    </div>
    
    <div>
      <h2 class="text-3xl font-bold text-skin-base">{{ t('sidebar.flutter-skills') }}</h2>
      <p class="text-skin-muted mt-2 max-w-md mx-auto">Cross-platform mobile development showcase. Coming soon.</p>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
    layout: dashboard
</route>
