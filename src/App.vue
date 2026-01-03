<script setup lang="ts">
import { useRoute } from 'vue-router'
import RetroLayout from './components/RetroLayout.vue'

const route = useRoute()
</script>

<template>
  <RetroLayout v-if="route.path !== '/data-screen'">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </RetroLayout>
  <router-view v-else />
</template>

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
