<script setup lang="ts">
defineProps<{
  visible: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="visible"
        class="dialog-backdrop"
        @click.self="emit('cancel')"
      >
        <div
          class="dialog"
          role="alertdialog"
          aria-modal="true"
        >
          <p class="fw-bold lead text-center p-2">{{ title }}</p>

          <p class="text-center">{{ message }}</p>

          <div class="dialog-actions d-flex justify-content-center">
            <button
              type="button"
              class="btn fw-bolder w-100 adw-btn adw-btn-raised"
              @click="emit('cancel')"
            >
              Cancel
            </button>

            <button
              type="button"
              class="btn fw-bolder w-100 adw-btn adw-btn-raised adw-btn-destructive-action"
              @click="emit('confirm')"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;

  display: flex;
  align-items: center;
  justify-content: center;

  background: var(--adw-dialog-overlay);
  padding: 1rem;
}

.dialog {
  width: min(100%, 420px);

  padding: 1.5rem;

  background: var(--adw-dialog-bg-color);
  color: var(--adw-dialog-fg-color);

  border-radius: 1rem;

  box-shadow:
    0 12px 32px rgb(0 0 0 / 20%),
    0 2px 8px rgb(0 0 0 / 15%);
}
/* 
.dialog h2 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
} */

.dialog p {
  margin: 0;
  color: var(--adw-dialog-fg-color);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 150ms ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>