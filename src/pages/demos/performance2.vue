<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  embedded?: boolean
}>()

// ==========================================
// 类型定义
// ==========================================
interface TreeNode {
  id: string
  label: string
  level: number
  isExpanded: boolean
  children?: TreeNode[]
  hasChildren: boolean
}

interface FlatNode extends TreeNode {
  // 扁平化后的节点不需要存储 children 引用来渲染，
  // 但为了逻辑方便，我们保留引用，或者只存必要信息
}

// ==========================================
// 配置参数
// ==========================================
const TOTAL_NODES = 1000000 // 总节点数
const containerHeight = ref(600) // 容器高度 (初始值，会动态更新)
const ITEM_HEIGHT = 32 // 每一行的高度

// ==========================================
// 状态管理
// ==========================================
const loading = ref(true)
const treeData = shallowRef<TreeNode[]>([]) // 原始树结构
const flatData = shallowRef<TreeNode[]>([]) // 扁平化后的可见列表 (用于虚拟滚动)
const scrollTop = ref(0)
const containerRef = ref<HTMLElement | null>(null)

const updateContainerHeight = () => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight
  }
}

// ==========================================
// 1. 数据生成 (模拟 10万个节点)
// ==========================================
const generateTreeData = () => {
  console.time('Tree Generation')
  
  // 为了演示，我们生成一个深度较深或者广度较大的树
  // 这里采用简单的递归生成，确保总数达到目标
  
  let count = 0
  
  const createNode = (level: number, maxLevel: number, index: number): TreeNode => {
    count++
    const hasChildren = level < maxLevel && count < TOTAL_NODES
    const node: TreeNode = {
      id: `node-${count}`,
      label: `系统节点 ${count} [层级 ${level}]`,
      level: level,
      isExpanded: level === 0, // 默认展开第一层
      hasChildren: hasChildren,
      children: []
    }
    
    if (hasChildren) {
      // 每层随机生成 2-5 个子节点
      const childCount = Math.floor(Math.random() * 4) + 2
      for (let i = 0; i < childCount; i++) {
        if (count >= TOTAL_NODES) break
        node.children!.push(createNode(level + 1, maxLevel, i))
      }
    }
    
    return node
  }

  const roots: TreeNode[] = []
  // 生成多个根节点
  while (count < TOTAL_NODES) {
    roots.push(createNode(0, 10, roots.length))
  }
  
  console.timeEnd('Tree Generation')
  return roots
}

// ==========================================
// 2. 树的扁平化 (核心优化)
// ==========================================
// 将树结构转换为一维数组，只包含当前 "可见" (即父节点已展开) 的节点
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

// 初始化
onMounted(() => {
  setTimeout(() => {
    treeData.value = generateTreeData()
    // 初始扁平化
    flatData.value = flattenTree(treeData.value)
    loading.value = false
    
    setTimeout(updateContainerHeight, 0)
  }, 100)
  
  const observer = new ResizeObserver(updateContainerHeight)
  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})

// ==========================================
// 3. 交互逻辑
// ==========================================
const toggleNode = (node: TreeNode) => {
  if (!node.hasChildren) return
  
  node.isExpanded = !node.isExpanded
  
  // 重新计算扁平化列表
  // 优化点：其实不需要全量重新扁平化，只需要增删数组片段
  // 但为了代码简单易懂，这里演示全量重新计算 (在 10万级数据下 JS 计算依然很快)
  // 如果是百万级，需要优化为局部更新
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

// ==========================================
// 4. 虚拟滚动逻辑
// ==========================================
const onScroll = (e: Event) => {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}

// 计算可视区域内的节点
const visibleNodes = computed(() => {
  const start = Math.floor(scrollTop.value / ITEM_HEIGHT)
  const visibleCount = Math.ceil(containerHeight.value / ITEM_HEIGHT)
  const buffer = 5 // 缓冲区，防止滚动白屏
  
  const startIndex = Math.max(0, start - buffer)
  const endIndex = Math.min(flatData.value.length, start + visibleCount + buffer)
  
  return flatData.value.slice(startIndex, endIndex).map((node, index) => ({
    data: node, // 保留原始引用，而不是使用 ...node 复制
    top: (startIndex + index) * ITEM_HEIGHT
  }))
})

// 总高度 = 扁平化后的节点数 * 单行高度
const totalHeight = computed(() => flatData.value.length * ITEM_HEIGHT)

</script>

<template>
  <div class="max-w-6xl mx-auto h-full flex flex-col">
    <!-- 头部 -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b-4 border-retro-primary pb-4 shrink-0">
      <div v-if="!embedded" class="flex items-center mb-4 md:mb-0">
        <button @click="router.push('/skills/vue')" class="mr-4 text-retro-primary hover:text-retro-amber text-xl">
          < [BACK]
        </button>
        <h2 class="text-3xl md:text-4xl">
          VIRTUAL_TREE_100K
        </h2>
      </div>
      
      <div class="flex gap-4 text-sm font-mono">
        <button @click="expandAll" class="border border-retro-primary px-3 py-1 hover:bg-retro-primary hover:text-black transition-colors">
          [+] 展开全部
        </button>
        <button @click="collapseAll" class="border border-retro-amber px-3 py-1 hover:bg-retro-amber hover:text-black transition-colors">
          [-] 折叠全部
        </button>
      </div>
    </div>

    <!-- 状态栏 -->
    <div class="flex justify-between font-mono text-sm text-retro-blue mb-4 bg-retro-blue/10 p-2 border border-retro-blue/30 shrink-0">
      <span>总共节点数量: {{ TOTAL_NODES.toLocaleString() }}</span>
      <span>可见节点数量: {{ flatData.length.toLocaleString() }}</span>
      <span>渲染策略: VIRTUAL_SCROLL + FLATTEN</span>
    </div>

    <!-- 加载中 -->
    <div v-if="loading" class="flex-1 flex items-center justify-center text-2xl animate-pulse text-retro-primary">
      GENERATING_TREE_STRUCTURE...
    </div>

    <!-- 虚拟树容器 -->
    <div 
      v-else
      ref="containerRef"
      class="flex-1 border-2 border-retro-primary bg-black/80 overflow-auto relative custom-scrollbar min-h-0"
      @scroll="onScroll"
    >
      <!-- 撑开高度的占位层 -->
      <div :style="{ height: totalHeight + 'px' }" class="relative w-full">
        <!-- 绝对定位的渲染层 -->
        <div 
          v-for="item in visibleNodes" 
          :key="item.data.id"
          class="absolute w-full flex items-center px-2 hover:bg-retro-primary/20 transition-colors cursor-pointer select-none"
          :style="{ 
            top: item.top + 'px', 
            height: ITEM_HEIGHT + 'px',
            paddingLeft: (item.data.level * 20 + 10) + 'px' 
          }"
          @click="toggleNode(item.data)"
        >
          <!-- 展开/收起图标 -->
          <span 
            class="mr-2 w-4 h-4 flex items-center justify-center border border-retro-primary/50 text-xs font-mono"
            :class="{ 'opacity-0': !item.data.hasChildren, 'text-retro-amber border-retro-amber': item.data.isExpanded }"
          >
            {{ item.data.isExpanded ? '-' : '+' }}
          </span>
          
          <!-- 节点内容 -->
          <span :class="{ 'text-retro-amber': item.data.isExpanded, 'text-retro-primary': !item.data.isExpanded }">
            {{ item.data.label }}
          </span>
          
          <!-- 装饰线 -->
          <div class="ml-auto h-[1px] bg-retro-primary/20 w-32"></div>
        </div>
      </div>
      
    </div>
     <!-- <div class="mt-4 p-4 border border-retro-amber text-retro-amber text-sm font-mono shrink-0">
      <p>> 通过扁平化，虚拟列表，渲染 1,000,000 个树节点</p>
    </div> -->
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 12px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #000;
  border-left: 1px solid var(--retro-primary);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--retro-primary);
  border: 1px solid #000;
}
</style>