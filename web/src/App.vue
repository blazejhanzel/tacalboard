<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Navbar from "@/components/Navbar.vue"

const scrollContainer = ref<HTMLElement | null>(null)
const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = (scrollContainer.value?.scrollTop ?? 0) > 0
}

onMounted(() => {
  scrollContainer.value?.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  scrollContainer.value?.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="app">
    <Header :is-scrolled="isScrolled" />
  
    <main ref="scrollContainer" class="container-fluid" id="app-body">
      <div class="container pt-3 pb-3">
        <RouterView />
      </div>
    </main>
    <Navbar />
  </div>
</template>

<style>
.app {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

#app-body {
  background-color: var(--adw-window-bg-color);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
</style>