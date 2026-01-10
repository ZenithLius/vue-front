<script setup lang="ts">
import { LayoutDashboard, Code2, Database, Box, Server, Terminal, Settings, ChevronDown, ChevronRight, PlayCircle, BookOpen, Globe, LogOut, Activity } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const userStore = useUserStore()

const handleLogout = async () => {
  await userStore.logout()
  router.push('/')
}

// Expanded state for submenus
const expandedMenus = ref<Record<string, boolean>>({
  'sidebar.frontend': true,
  'sidebar.web': true
})

interface MenuItem {
  name: string
  icon: any
  path?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  { name: 'sidebar.overview', icon: LayoutDashboard, path: '/dashboard' },
  { 
    name: 'sidebar.frontend', 
    icon: Code2, 
    children: [
      { name: 'sidebar.css-showcase', icon: PlayCircle, path: '/demos/css-showcase' },
      { name: 'sidebar.performance-hub', icon: PlayCircle, path: '/demos/performance-hub' },
      { name: 'sidebar.vue-skills', icon: BookOpen, path: '/skills/vue' },
      { 
        name: 'sidebar.web', 
        icon: Globe, 
        children: [
          { name: 'sidebar.web-skills', icon: BookOpen, path: '/skills/web' },
          { name: 'sidebar.communication', icon: BookOpen, path: '/skills/web/communication' }
        ]
      },
      { name: 'sidebar.flutter-skills', icon: BookOpen, path: '/skills/flutter' }
    ]
  },
  { name: 'sidebar.backend', icon: Server, path: '/dashboard/domain/backend' },
  { name: 'sidebar.algorithms', icon: Terminal, path: '/dashboard/domain/algorithms' },
  { name: 'sidebar.database', icon: Database, path: '/dashboard/domain/database' },
  { name: 'sidebar.devops', icon: Box, path: '/dashboard/domain/devops' },
]

const toggleMenu = (name: string) => {
  expandedMenus.value[name] = !expandedMenus.value[name]
}

const navigate = (path: string) => {
  if (path) {
    router.push(path)
  }
}

const isActive = (item: MenuItem): boolean => {
  if (item.path) {
    return route.path === item.path
  }
  if (item.children) {
    return item.children.some(child => child.path === route.path)
  }
  return false
}
</script>

<template>
  <aside class="w-64 bg-skin-card border-r border-skin-base flex flex-col transition-all duration-300">
    <!-- Logo Area -->
    <div class="h-16 flex items-center px-6 border-b border-skin-base bg-skin-card">
      <div class="flex items-center gap-2 text-skin-primary">
        <div class="bg-skin-primary text-white p-1 rounded-md">
           <Code2 class="w-5 h-5" />
        </div>
        <span class="font-bold text-lg tracking-tight text-skin-base">CodeRecord</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
      <div v-for="item in menuItems" :key="item.name">
        <!-- Single Link -->
        <a 
          v-if="!item.children"
          @click="navigate(item.path!)"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group"
          :class="route.path === item.path 
            ? 'bg-skin-primary/10 text-skin-primary shadow-sm ring-1 ring-skin-primary/20' 
            : 'text-skin-muted hover:bg-skin-base hover:text-skin-base'"
        >
          <component 
            :is="item.icon" 
            class="w-5 h-5 transition-colors"
            :class="route.path === item.path ? 'text-skin-primary' : 'text-skin-muted/70 group-hover:text-skin-muted'" 
          />
          {{ t(item.name) }}
        </a>

        <!-- Submenu -->
        <div v-else>
          <button 
            @click="toggleMenu(item.name)"
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-skin-muted hover:bg-skin-base hover:text-skin-base"
            :class="{ 'bg-skin-base text-skin-base': isActive(item) }"
          >
            <div class="flex items-center gap-3">
              <component 
                :is="item.icon" 
                class="w-5 h-5 transition-colors text-skin-muted/70 group-hover:text-skin-muted" 
              />
              {{ t(item.name) }}
            </div>
            <component :is="expandedMenus[item.name] ? ChevronDown : ChevronRight" class="w-4 h-4 text-skin-muted/50" />
          </button>
          
          <!-- Children -->
          <div v-show="expandedMenus[item.name]" class="mt-1 space-y-1 pl-11 pr-2">
            <template v-for="child in item.children" :key="child.name">
               <!-- 3rd Level Link -->
               <a 
                 v-if="!child.children"
                 @click="navigate(child.path!)"
                 class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer block"
                 :class="route.path === child.path 
                   ? 'text-skin-primary bg-skin-primary/5' 
                   : 'text-skin-muted hover:text-skin-base hover:bg-skin-base'"
               >
                 {{ t(child.name) }}
               </a>

               <!-- 3rd Level Group (Nested) -->
               <div v-else>
                 <button 
                  @click="toggleMenu(child.name)"
                  class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-skin-muted hover:bg-skin-base hover:text-skin-base"
                 >
                    <div class="flex items-center gap-2">
                       {{ t(child.name) }}
                    </div>
                    <component :is="expandedMenus[child.name] ? ChevronDown : ChevronRight" class="w-3 h-3 text-skin-muted/50" />
                 </button>
                 <div v-show="expandedMenus[child.name]" class="mt-1 space-y-1 pl-4 border-l border-skin-base/20 ml-3">
                    <a 
                      v-for="grandChild in child.children" 
                      :key="grandChild.name"
                      @click="navigate(grandChild.path!)"
                       class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer block"
                      :class="route.path === grandChild.path 
                        ? 'text-skin-primary font-bold' 
                        : 'text-skin-muted hover:text-skin-base'"
                    >
                      {{ t(grandChild.name) }}
                    </a>
                 </div>
               </div>
            </template>
          </div>
        </div>
      </div>
    </nav>

        <!-- Admin Section -->
        <template v-if="userStore.isAdmin">
          <div class="px-3 mb-2 mt-4">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
              Admin
            </h3>
          </div>
          
          <div class="px-3 mb-4">
          <router-link
            to="/admin/logs"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
            :class="[
              isActive({ path: '/admin/logs' } as any) 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <Activity 
              class="mr-3 h-5 w-5 transition-colors"
              :class="isActive({ path: '/admin/logs' } as any) ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'" 
            />
            Access Logs
          </router-link>
          </div>
        </template>
    
    <!-- Footer/Settings -->
    <div class="p-4 border-t border-skin-base bg-skin-card">
        <a class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-skin-muted hover:bg-skin-base hover:text-skin-base cursor-pointer">
            <Settings class="w-5 h-5 text-skin-muted/70" />
            {{ t('common.settings') }}
        </a>
        <button 
          @click="handleLogout"
          class="w-full mt-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-skin-muted hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors"
        >
            <LogOut class="w-5 h-5 opacity-70" />
            {{ t('common.logout') }}
        </button>
    </div>
  </aside>
</template>


