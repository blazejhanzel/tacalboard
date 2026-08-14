<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  visible: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const cancelButton = ref<HTMLButtonElement | null>(null)

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('cancel')
  }
}

watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      document.addEventListener('keydown', handleKeydown)

      await nextTick()
      cancelButton.value?.focus()
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="props.visible"
        class="dialog-backdrop d-flex align-items-center justify-content-center p-3"
        @click.self="emit('cancel')"
      >
        <div class="dialog p-4" role="alertdialog" aria-modal="true">
          <h2 class="lead text-center mt-2 mb-3">{{ props.title }}</h2>
          <p class="text-center m-0">{{ props.message }}</p>
          <div class="d-flex justify-content-center gap-3 mt-4">
            <button
              ref="cancelButton"
              class="btn adw-btn adw-btn-raised adw-btn-dialog w-100"
              type="button"
              @click="emit('cancel')"
            >
              {{ t('common.cancel') }}
            </button>

            <button
              type="button"
              class="btn adw-btn adw-btn-raised adw-btn-dialog adw-btn-destructive-action w-100"
              @click="emit('confirm')"
            >
              {{ t('common.delete') }}
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
  background: var(--adw-dialog-overlay);
}

.dialog {
  width: min(100%, 380px);

  background: var(--adw-dialog-bg-color);
  color: var(--adw-dialog-fg-color);

  border-radius: 1rem;

  box-shadow:
    0 12px 32px rgb(0 0 0 / 20%),
    0 2px 8px rgb(0 0 0 / 15%);
}

.dialog h2 {
  font-weight: 900 !important;
}

.dialog p {
  color: var(--adw-dialog-fg-color);
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