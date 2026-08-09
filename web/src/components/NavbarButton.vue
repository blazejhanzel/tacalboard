<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps({
  to: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})
</script>

<template>
  <RouterLink
    :to="to"
    class="nav-link gap-2 d-flex rounded-4 align-items-center justify-content-center"
    active-class="tcb-active"
  >
    <slot />
    <span class="fw-bolder">{{ label }}</span>
  </RouterLink>
</template>

<style scoped>
.nav-link:hover {
  background-color: var(--tcb-overlay-hover);
}

.nav-link i {
  color: var(--adw-headerbar-fg-color);
}

.nav-link :deep(svg) {
  color: var(--adw-headerbar-fg-color);
  width: 20px;
  height: 20px;
}

.nav-link span {
  color: var(--adw-headerbar-fg-color);
}

.tcb-active {
  background-color: var(--tcb-overlay-active) !important;
}
</style>