<script setup lang="ts">
import { onMounted } from "vue";
import { computed, ref } from "vue"

const theme = ref("light")

const themeIcon = computed(() =>
  theme.value === "light"
    ? "bi bi-moon-stars-fill mx-3"
    : "bi bi-sun-fill mx-3"
)

function toggleTheme() {
  theme.value =
    theme.value === "light"
      ? "dark"
      : "light"

  document.documentElement.setAttribute('data-bs-theme', theme.value)
}
</script>

<template>
  <nav class="navbar bg-body-tertiary navbar-expand-lg p-2" id="header">
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
      <button class="nav-link fs-5" @click="toggleTheme">
        <i :class="themeIcon"></i>
      </button>
      <a href="#" class="d-block link-body-emphasis text-decoration-none" aria-expanded="false">
        <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" class="rounded-circle">
      </a>
    </div>
  </nav>
</template>
