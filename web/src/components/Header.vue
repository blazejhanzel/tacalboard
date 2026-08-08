<script setup lang="ts">
import { computed, ref } from "vue"

const theme = ref("light")
const customTheme = ref("latte")

const themeIcon = computed(() =>
  theme.value === "light"
    ? "bi bi-moon-stars-fill m-0"
    : "bi bi-sun-fill m-0"
)

function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light"
  customTheme.value = customTheme.value === "latte" ? "frappe" : "latte"

  document.documentElement.setAttribute('data-bs-theme', theme.value)
  document.documentElement.setAttribute('data-custom-theme', customTheme.value)
}
</script>

<template>
  <header class="navbar bg-tertiary navbar-expand-lg p-2" id="header">
    <div class="container-fluid gap-2">
      <a class="navbar-brand me-auto">Tacalboard</a>
      <!-- <ul class="nav col-12 col-lg-auto my-2 justify-content-center my-md-0">
        <li>
          <a href="#" class="nav-link link-body-emphasis">
            <i class="bi bi-calendar2-check d-block mx-3"></i>
            <span class="text-sm">Zadania</span>
          </a>
        </li>
      </ul> -->
      <button class="btn rounded-5 icon-button" @click="toggleTheme">
        <i class="text-body-emphasis" :class="themeIcon"></i>
      </button>
      <a href="#" class="d-block link-body-emphasis text-decoration-none" aria-expanded="false">
        <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" class="rounded-circle">
      </a>
    </div>
  </header>
</template>
