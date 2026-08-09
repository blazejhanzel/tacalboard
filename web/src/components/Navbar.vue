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
  <div class="p-2" id="bottom-navbar">
    <nav class="container nav nav-pills nav-fill p-1 small" id="navbar" role="tablist" style="--bs-nav-link-color: var(--bs-emphasis); --bs-nav-pills-link-active-color: var(--bs-emphasis); --bs-nav-pills-link-active-bg: var(--bs-primary-bg-subtle);">
      <RouterLink to="/" class="nav-link rounded-5" id="stickies-tab" active-class="tcb-active">
        <i class="bi bi-stickies d-block mx-auto"></i>
        <span>Dump</span>
      </RouterLink>
      <!-- <button class="nav-link rounded-5 disabled" id="calendar-tab" data-bs-toggle="tab" aria-current="page" href="#">
        <i class="bi bi-calendar2 d-block mx-auto"></i>
        <span>Calendar</span>
      </button>
      <button class="nav-link rounded-5 disabled" id="tasks-tab" data-bs-toggle="tab" aria-current="page">
        <i class="bi bi-calendar2-check d-block mx-auto"></i>
        <span>Tasks</span>
      </button> -->
      <RouterLink to="/notes" class="nav-link rounded-5" id="notes-tab" active-class="tcb-active">
        <i class="bi bi-journal d-block mx-auto"></i>
        <span>Notes</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scope>
#bottom-navbar {
  background-color: var(--md-sys-color-surface-container);
}

.nav-link i {
  color: var(--md-sys-color-on-surface-variant);
  max-width: 80px;
  font-size: 24px;
}

.nav-link span {
  color: var(--md-sys-color-on-surface-variant);
}

.tcb-active i {
  background-color: var(--md-sys-color-secondary-container);
  border-radius: 999px;
}

.tcb-active i {
  color: var(--md-sys-color-on-secondary-container);
}

.tcb-active span {
  color: var(--md-sys-color-secondary);
}

</style>
