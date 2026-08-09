<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Navbar from "@/components/Navbar.vue"
</script>

<template>
  <div class="app">
    <Header />
  
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