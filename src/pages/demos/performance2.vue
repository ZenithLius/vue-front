<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRight, ChevronDown, Folder, FileText, PlusCircle, MinusCircle } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const props = defineProps<{ embedded?: boolean }>()

interface TreeNode {
  id: string
  // Store raw index instead of translated label
  index: number 
  level: number
  isExpanded: boolean
  children?: TreeNode[]
  hasChildren: boolean
}

const TOTAL_NODES = 1000000 
const containerHeight = ref(600)
const ITEM_HEIGHT = 40 

const loading = ref(true)
const treeData = shallowRef<TreeNode[]>([]) 
const flatData = shallowRef<TreeNode[]>([]) 
const scrollTop = ref(0)
const containerRef = ref<HTMLElement | null>(null)

const updateContainerHeight = () => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight
  }
}

const generateTreeData = () => {
  let count = 0
  
  const createNode = (level: number, maxLevel: number, index: number): TreeNode => {
    count++
    const hasChildren = level < maxLevel && count < TOTAL_NODES
    const node: TreeNode = {
      id: `node-${count}`,
      index: count,
      level: level,
      isExpanded: level === 0, 
      hasChildren: hasChildren,
      children: []
    }
    
    if (hasChildren) {
      const childCount = Math.floor(Math.random() * 4) + 2
      for (let i = 0; i < childCount; i++) {
        if (count >= TOTAL_NODES) break
        node.children!.push(createNode(level + 1, maxLevel, i))
      }
    }
    return node
  }

  const roots: TreeNode[] = []
  while (count < TOTAL_NODES) {
    roots.push(createNode(0, 10, roots.length))
  }
  return roots
}

const flattenTree = (nodes: TreeNode[]): TreeNode[] => {
  const result: TreeNode[] = []
  const traverse = (list: TreeNode[]) => {
    for (const node of list) {
      result.push(node)
      if (node.isExpanded && node.children) {
        traverse(node.children)
      }
    }
  }
  traverse(nodes)
  return result
}

onMounted(() => {
  setTimeout(() => {
    treeData.value = generateTreeData()
    flatData.value = flattenTree(treeData.value)
    loading.value = false
    setTimeout(updateContainerHeight, 0)
  }, 100)
  
  const observer = new ResizeObserver(updateContainerHeight)
  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})

const toggleNode = (node: TreeNode) => {
  if (!node.hasChildren) return
  node.isExpanded = !node.isExpanded
  flatData.value = flattenTree(treeData.value)
}

const expandAll = () => {
  const toggleAll = (nodes: TreeNode[], expand: boolean) => {
    for (const node of nodes) {
      node.isExpanded = expand
      if (node.children) toggleAll(node.children, expand)
    }
  }
  toggleAll(treeData.value, true)
  flatData.value = flattenTree(treeData.value)
}

const collapseAll = () => {
  const toggleAll = (nodes: TreeNode[], expand: boolean) => {
    for (const node of nodes) {
      node.isExpanded = expand
      if (node.children) toggleAll(node.children, expand)
    }
  }
  toggleAll(treeData.value, false)
  flatData.value = flattenTree(treeData.value)
}

const onScroll = (e: Event) => {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}

const visibleNodes = computed(() => {
  const start = Math.floor(scrollTop.value / ITEM_HEIGHT)
  const visibleCount = Math.ceil(containerHeight.value / ITEM_HEIGHT)
  const buffer = 5 
  
  const startIndex = Math.max(0, start - buffer)
  const endIndex = Math.min(flatData.value.length, start + visibleCount + buffer)
  
  return flatData.value.slice(startIndex, endIndex).map((node, index) => ({
    data: node, 
    top: (startIndex + index) * ITEM_HEIGHT
  }))
})

const totalHeight = computed(() => flatData.value.length * ITEM_HEIGHT)
</script>

<template>
  <div class="h-full flex flex-col bg-skin-card font-sans">
    <!-- Header Controls -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-skin-base shrink-0">
      <div class="flex items-center gap-4 text-sm text-skin-muted">
         <div>{{ t('demos.perf.nodes') }}: <span class="font-bold text-skin-base">{{ TOTAL_NODES.toLocaleString() }}</span></div>
         <div>{{ t('demos.perf.visible') }}: <span class="font-bold text-skin-base">{{ flatData.length.toLocaleString() }}</span></div>
      </div>
      
      <div class="flex gap-2 text-sm">
        <button @click="expandAll" class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-skin-primary hover:bg-skin-base transition-colors">
          <PlusCircle class="w-4 h-4" /> {{ t('demos.perf.expand_all') }}
        </button>
        <button @click="collapseAll" class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-skin-muted hover:bg-skin-base hover:text-skin-base transition-colors">
          <MinusCircle class="w-4 h-4" /> {{ t('demos.perf.collapse_all') }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex-1 flex items-center justify-center text-skin-muted animate-pulse">
      {{ t('demos.perf.generating_tree') }}
    </div>

    <!-- Tree Container -->
    <div 
      v-else
      ref="containerRef"
      class="flex-1 overflow-auto relative custom-scrollbar bg-skin-base/30"
      @scroll="onScroll"
    >
      <div :style="{ height: totalHeight + 'px' }" class="relative w-full">
        <div 
          v-for="item in visibleNodes" 
          :key="item.data.id"
          class="absolute w-full flex items-center px-4 hover:bg-skin-primary/5 transition-colors cursor-pointer select-none text-sm text-skin-base border-b border-dashed border-skin-base/50"
          :style="{ 
            top: item.top + 'px', 
            height: ITEM_HEIGHT + 'px',
            paddingLeft: (item.data.level * 24 + 16) + 'px' 
          }"
          @click="toggleNode(item.data)"
        >
          <!-- Icon -->
          <div class="mr-2 w-5 h-5 flex items-center justify-center text-skin-muted">
            <template v-if="item.data.hasChildren">
               <component :is="item.data.isExpanded ? ChevronDown : ChevronRight" class="w-4 h-4" />
            </template>
          </div>

          <component 
             :is="item.data.hasChildren ? Folder : FileText" 
             class="w-4 h-4 mr-2"
             :class="item.data.hasChildren ? 'text-amber-500' : 'text-blue-400'" 
          />
          
          <span :class="{ 'font-medium': item.data.hasChildren }">
            <!-- Reactive translation in template using the raw index -->
            {{ t('demos.perf.system_node') }} {{ item.data.index }} 
            <span class="text-xs text-skin-muted ml-2 opacity-50 font-normal">[L{{ item.data.level }}]</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

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