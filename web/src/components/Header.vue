<script setup lang="ts">
import { computed, ref } from "vue"

const props = defineProps<{
  isScrolled: boolean
}>()

const bsTheme = ref("light")
const mdTheme = ref("light")

const themeIcon = computed(() =>
  bsTheme.value === "light"
    ? "bi bi-moon-stars-fill m-0"
    : "bi bi-sun-fill m-0"
)

function toggleTheme() {
  bsTheme.value = bsTheme.value === "light" ? "dark" : "light"
  mdTheme.value = mdTheme.value === "light" ? "dark" : "light"

  document.documentElement.setAttribute('data-bs-theme', bsTheme.value)
  document.documentElement.setAttribute('data-md-theme', mdTheme.value)
}
</script>

<template>
  <header class="navbar navbar-expand-lg p-2" :class="{ 'is-scrolled': isScrolled }" id="header">
    <div class="container-fluid gap-2">
      <a class="navbar-brand me-auto">Tacalboard</a>
      <button class="btn rounded-5 tcb-icon-button" @click="toggleTheme">
        <i :class="themeIcon"></i>
      </button>
      <a href="#" class="d-block link-body-emphasis text-decoration-none" aria-expanded="false">
        <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" class="rounded-circle">
      </a>
    </div>
  </header>
</template>

<style scope>
header {
  background-color: var(--md-sys-color-surface);
}

header.is-scrolled {
  background-color: var(--md-sys-color-surface-container) !important;
}

.navbar-brand {
  color: var(--md-sys-color-on-surface);
}

.tcb-icon-button i {
  color: var(--md-sys-color-on-surface);
  font-size: 24px;
}
</style>
