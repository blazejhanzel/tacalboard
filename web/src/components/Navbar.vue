<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink } from 'vue-router'

onMounted(() => {
  const navbar = document.getElementById("bottom-navbar")!;

  document.documentElement.style.setProperty(
    "--bottom-navbar-height",
    `${navbar.offsetHeight}px`
  );
})
</script>

<template>
  <div class="bg-secondary p-2" id="bottom-navbar">
    <nav class="container nav nav-pills nav-fill p-1 small" id="navbar" role="tablist" style="--bs-nav-link-color: var(--bs-emphasis); --bs-nav-pills-link-active-color: var(--bs-emphasis); --bs-nav-pills-link-active-bg: var(--bs-primary-bg-subtle);">
      <RouterLink to="/" class="nav-link rounded-5" id="stickies-tab" active-class="active">
        <i class="bi bi-stickies d-block mx-3 fs-5"></i>
        Dump
      </RouterLink>
      <button class="nav-link rounded-5 disabled" id="calendar-tab" data-bs-toggle="tab" aria-current="page" href="#">
        <i class="bi bi-calendar2 d-block mx-3 fs-5"></i>
        Calendar
      </button>
      <button class="nav-link rounded-5 disabled" id="tasks-tab" data-bs-toggle="tab" aria-current="page">
        <i class="bi bi-calendar2-check d-block mx-3 fs-5"></i>
        Tasks
      </button>
      <RouterLink to="/notes" class="nav-link rounded-5" id="notes-tab" active-class="active">
        <i class="bi bi-journal d-block mx-3 fs-5"></i>
        Notes
      </RouterLink>
    </nav>
  </div>
</template>
