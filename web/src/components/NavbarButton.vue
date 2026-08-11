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
    class="nav-link d-flex align-items-center justify-content-center"
    active-class="tcb-active"
  >
    <slot />
    <span class="fw-bolder">{{ label }}</span>
  </RouterLink>
</template>

<style scoped>
.nav-link {
  font-size: 0.85rem !important;
  border-radius: var(--adw-border-radius-sm);
  padding: 6px 16px;
  gap: 8px;
}

.nav-link:hover {
  background-color: var(--tcb-overlay-hover);
}

.nav-link i {
  color: var(--adw-headerbar-fg-color);
}

.nav-link :deep(svg *) {
  color: var(--adw-headerbar-fg-color);
  fill: var(--adw-headerbar-fg-color);
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