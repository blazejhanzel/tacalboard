<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Navbar from "@/components/Navbar.vue"
import FloatingButton from "@/components/FloatingButton.vue"
</script>

<template>
  <div class="app">
    <Header />
  
    <main class="container pt-2 pb-2" id="content">
      <RouterView />
    </main>

    <Navbar />
  </div>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

.app {
  height: 100dvh;
  display: flex;
  flex-direction: column;
}

#content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
</style>