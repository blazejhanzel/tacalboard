<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: false,
  },
})

const separator = ref<HTMLElement | null>(null)

defineExpose({
  scrollIntoView: () => {
    separator.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  },
})
</script>

<template>
  <div ref="separator" class="separator">
    <hr class="w-100" />
    <span v-if="props.text" class="ms-3 me-3">{{ props.text }}</span>
    <hr v-if="props.text" class="w-100" />
  </div>
</template>

<style scoped>
.separator {
  display: flex;
  align-items: center;
  scroll-margin-top: 100px; /* TODO: Magic value */

  span {
    font-size: 0.85rem;
    color: var(--adw-light-5);
    white-space: nowrap;
  }

  hr {
    margin-top: 1rem;
    border: none;
    border-top: 1px solid var(--adw-light-5);
  }
}
</style>
