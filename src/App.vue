<template>
  <component :is="layout">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import GuestLayout from '@/layouts/GuestLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const route = useRoute()

const layout = computed(() => {
  const layoutName = route.meta.layout
  if (layoutName === 'dashboard') {
    return DashboardLayout
  }
  return GuestLayout
})
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(10px);
  filter: blur(4px);
}
</style>
