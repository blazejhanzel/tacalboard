<script setup lang="ts">
import { useToast, type ToastIcon } from '@/composables/useToast'
import IconCrossLarge from './icons/IconCrossLarge.vue'
import IconCheckRoundOutline from '@/components/icons/IconCheckRoundOutline.vue'
import IconErrorOutline from '@/components/icons/IconErrorOutline.vue'
import IconExclamationMark from '@/components/icons/IconExclamationMark.vue'
import IconInfoOutline from '@/components/icons/IconInfoOutline.vue'

const { toasts, dismissToast } = useToast()

function getIcon(icon: ToastIcon) {
  switch (icon) {
    case 'info':
      return IconInfoOutline
    case 'success':
      return IconCheckRoundOutline
    case 'warning':
      return IconExclamationMark
    case 'error':
      return IconErrorOutline
  }
}
</script>

<template>
  <div class="toast-container start-50 translate-middle-x">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast show"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      :style="{ opacity: toast.opacity }"
    >
      <div class="toast-content">
        <component v-if="toast.icon" :is="getIcon(toast.icon)" />
        <strong class="ms-2 me-auto">{{ toast.message }}</strong>
        <button v-if="toast.callback" type="button" class="btn" @click="toast.callback?.func()">
          {{ toast.callback.label }}
        </button>
        <button type="button" class="btn-close" @click="dismissToast(toast.id)" aria-label="Close">
          <IconCrossLarge />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed !important;
  bottom: var(--tcb-bottom-navbar-height);
}

.toast {
  --bs-toast-bg: var(--adw-toast-bg-color);
  --bs-toast-border-width: 0px;
  color: var(--adw-toast-fg-color);
  border-radius: 2rem;
  margin-bottom: 1rem;
}

.toast-content {
  display: flex;
  vertical-align: center;
  align-items: center;
  padding-left: 1.25rem;
  padding-right: 0.25rem;
  font-size: 1rem;
  min-height: 64px;

  .btn {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.75rem;
    font-weight: bold;
    font-size: 1rem;
    color: var(--adw-toast-fg-color);
    background-color: var(--adw-toast-btn-color);
  }

  .btn-close {
    --bs-btn-close-bg: none;
    --bs-btn-close-opacity: 1;
    padding: 1rem;
    filter: none;
  }

  .btn-close:active,
  .btn-close:focus,
  .btn-close:focus-visible {
    box-shadow: none !important;
  }
}

.btn-close :deep(svg path) {
  fill: var(--adw-toast-fg-color);
}
</style>
