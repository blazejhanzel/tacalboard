<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Navbar from "@/components/Navbar.vue"

const route = useRoute()

const isScrolled = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)
  
const bottomBarComponents = {
  navbar: Navbar,
}

const showBottomBar = computed(() => route.meta.bottomBar ?? true)

const bottomBarComponent = computed(() => {
  const type = route.meta.bottomBar

  return type === 'navbar' // || type === 'toolbar'
    ? bottomBarComponents[type]
    : null
})

function handleScroll() {
  isScrolled.value = (scrollContainer.value?.scrollTop ?? 0) > 0
}

onMounted(() => {
  scrollContainer.value?.addEventListener('scroll', handleScroll)
})

onMounted(async () => {
  const appBody = document.getElementById("app-body")!;
  
  document.documentElement.style.setProperty(
    "--tcb-app-body-height",
    `${appBody.offsetHeight}px`
  )

  const isIOSApp = navigator.standalone === true

  document.documentElement.classList.toggle(
    'ios-app',
    isIOSApp
  )
})

onUnmounted(() => {
  scrollContainer.value?.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="app">
    <Header :is-scrolled="isScrolled" />
  
    <main ref="scrollContainer" class="container-fluid" id="app-body">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <component :is="bottomBarComponent" v-if="showBottomBar" />
  </div>
</template>

<style>
.app {
  height: 100dvh;
  padding-bottom: calc(env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
}

html.ios-app .app {
  height: 100vh !important;
  padding-top: calc(1em + env(safe-area-inset-top, 0px));
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)) !important;
}

#app-body {
  background-color: var(--adw-window-bg-color);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
</style>