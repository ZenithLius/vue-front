<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import { useUserStore } from '@/stores/user'
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Languages, ChevronRight, Home } from 'lucide-vue-next'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()

onMounted(async () => {
  await userStore.fetchUser()
  if (!userStore.user) {
    router.push('/login')
  }
})

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
}

// Generate breadcrumbs based on route path
const breadcrumbs = computed(() => {
  const path = route.path
  if (path === '/dashboard') return []
  
  const segments = path.split('/').filter(Boolean)
  // Skip the first 'dashboard' segment if it's redundant for breadcrumb logic relative to Home
  if (segments[0] === 'dashboard') segments.shift()
  
  return segments.map((segment, index) => {
    const url = '/dashboard/' + segments.slice(0, index + 1).join('/')
    // Simple capitalization, in real app might map to titles
    const title = segment.charAt(0).toUpperCase() + segment.slice(1)
    return { title, url }
  })
})
</script>

<template>
  <div class="flex h-screen bg-skin-base font-sans text-skin-base transition-colors duration-300">
    <!-- Sidebar (Persistent) -->
    <Sidebar class="hidden md:flex shrink-0 border-r border-skin-base bg-skin-card" />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden relative">
      <!-- Header -->
      <header class="h-16 bg-skin-card border-b border-skin-base flex items-center justify-between px-6 shadow-sm z-10 w-full transition-colors duration-300">
         <div class="flex items-center gap-4">
            <!-- Mobile Menu Toggle could go here -->
            
            <!-- Breadcrumbs -->
            <nav class="flex items-center text-sm text-skin-muted">
               <router-link to="/dashboard" class="hover:text-skin-primary transition-colors">
                  <Home class="w-4 h-4" />
               </router-link>
               <template v-for="(crumb, index) in breadcrumbs" :key="crumb.url">
                  <ChevronRight class="w-4 h-4 mx-2 text-skin-muted/50" />
                  <span v-if="index === breadcrumbs.length - 1" class="font-medium text-skin-base">
                     {{ crumb.title.replace(/-/g, ' ') }}
                  </span>
                  <router-link v-else :to="crumb.url" class="hover:text-skin-primary transition-colors">
                     {{ crumb.title.replace(/-/g, ' ') }}
                  </router-link>
               </template>
            </nav>
         </div>

         <div class="flex items-center gap-4">
             <button 
               @click="toggleLanguage"
               class="p-2 rounded-lg text-skin-muted hover:bg-skin-base hover:text-skin-primary flex items-center gap-2 transition-colors"
               :title="t('common.language')"
             >
                <Languages class="w-5 h-5" />
                <span class="text-xs font-bold tracking-wide">{{ locale.toUpperCase() }}</span>
             </button>
             <div class="h-8 w-px bg-skin-base"></div>
             <span class="text-sm font-medium text-skin-base" v-if="userStore.user">{{ userStore.user.email }}</span>
         </div>
      </header>
      
      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-6 scroll-smooth bg-skin-base">
         <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
             </transition>
         </router-view>
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
