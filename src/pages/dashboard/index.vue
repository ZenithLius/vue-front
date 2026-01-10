<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { 
  Briefcase, 
  Code, 
  Zap, 
  Clock, 
  ArrowRight,
  Activity,
  CheckCircle,
  FileText
} from 'lucide-vue-next'

const { t } = useI18n()

// Mock data - in a real app this would come from a store or API
const userName = 'Developer' 

const stats = [
  { 
    key: 'projects', 
    icon: Briefcase, 
    value: 12, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50' 
  },
  { 
    key: 'skills', 
    icon: Zap, 
    value: 24, 
    color: 'text-amber-600', 
    bg: 'bg-amber-50' 
  },
  { 
    key: 'snippets', 
    icon: Code, 
    value: 148, 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50' 
  },
  { 
    key: 'hours', 
    icon: Clock, 
    value: 1250, 
    color: 'text-purple-600', 
    bg: 'bg-purple-50' 
  }
]

const recentActivities = [
  {
    id: 1,
    type: 'updated',
    target: 'Vue Performance Demo',
    date: '2 hours ago',
    icon: Activity
  },
  {
    id: 2,
    type: 'created',
    target: 'Flutter Animation Guide',
    date: '5 hours ago',
    icon: FileText
  },
  {
    id: 3,
    type: 'updated',
    target: 'Global Theme System',
    date: '1 day ago',
    icon: Activity
  }
]
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Banner with Glassmorphism -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-200 p-8">
      <!-- Decorative circles -->
      <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white opacity-10 blur-3xl"></div>
      
      <div class="relative z-10">
        <h2 class="text-3xl font-bold mb-2">
          {{ t('dashboard.welcome_title', { name: userName }) }}
        </h2>
        <p class="text-indigo-100 max-w-xl text-lg">
          {{ t('dashboard.welcome_subtitle') }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Stats Grid (Left 2 Columns) -->
      <div class="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="stat in stats" 
          :key="stat.key" 
          class="bg-skin-card p-5 rounded-xl border border-skin-base shadow-sm hover:shadow-md transition-shadow"
        >
          <div :class="`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.bg}`">
            <component :is="stat.icon" :class="`w-5 h-5 ${stat.color}`" />
          </div>
          <div class="text-2xl font-bold text-skin-base mb-1">{{ stat.value }}</div>
          <div class="text-xs font-medium text-skin-muted uppercase tracking-wider">
            {{ t(`dashboard.stat_${stat.key}`) }}
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="col-span-2 md:col-span-4 bg-skin-card p-6 rounded-xl border border-skin-base shadow-sm mt-2">
           <h3 class="text-lg font-semibold text-skin-base mb-4">{{ t('dashboard.quick_actions') }}</h3>
           <div class="flex flex-wrap gap-3">
              <router-link 
                to="/demos/performance-hub" 
                class="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
              >
                 <Zap class="w-4 h-4" /> {{ t('dashboard.action_demos') }}
              </router-link>
              <router-link 
                to="/skills/vue" 
                class="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
              >
                 <Code class="w-4 h-4" /> {{ t('dashboard.action_skills') }}
              </router-link>
              <!-- Placeholder link -->
              <button 
                class="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                 <Briefcase class="w-4 h-4" /> {{ t('dashboard.action_profile') }}
              </button>
           </div>
        </div>
      </div>

      <!-- Right Column: System Status & Activity -->
      <div class="space-y-6">
         <!-- System Status -->
         <div class="bg-skin-card p-6 rounded-xl border border-skin-base shadow-sm">
            <div class="flex items-center justify-between mb-4">
               <h3 class="font-semibold text-skin-base">{{ t('dashboard.system_status') }}</h3>
               <div class="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  Online
               </div>
            </div>
            
            <div class="flex items-center gap-3 text-sm text-skin-muted mb-2">
               <CheckCircle class="w-5 h-5 text-emerald-500" />
               {{ t('dashboard.status_operational') }}
            </div>
            <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
               <div class="h-full bg-emerald-500 w-full rounded-full"></div>
            </div>
         </div>

         <!-- Recent Activity -->
         <div class="bg-skin-card p-6 rounded-xl border border-skin-base shadow-sm flex-1">
            <h3 class="font-semibold text-skin-base mb-4">{{ t('dashboard.recent_activity') }}</h3>
            <div class="space-y-4">
               <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start gap-3">
                  <div class="bg-skin-base p-2 rounded-full mt-0.5">
                     <component :is="activity.icon" class="w-4 h-4 text-skin-muted" />
                  </div>
                  <div>
                     <p class="text-sm text-skin-base">
                        <span class="font-medium text-indigo-600">{{ t(`dashboard.activity_${activity.type}`) }}</span> 
                        {{ activity.target }}
                     </p>
                     <p class="text-xs text-skin-muted">{{ activity.date }}</p>
                  </div>
               </div>
            </div>
            
            <button class="w-full mt-4 py-2 text-xs font-medium text-skin-muted hover:text-skin-primary transition-colors flex items-center justify-center gap-1">
               {{ t('common.view_code') }} <ArrowRight class="w-3 h-3" />
            </button>
         </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: dashboard
</route>
