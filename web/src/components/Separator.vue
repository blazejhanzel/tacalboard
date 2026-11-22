<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: false,
  },
})
</script>

<template>
  <div class="separator">
    <hr class="w-100" />
    <span v-if="props.text" class="ms-3 me-3">{{ props.text }}</span>
    <hr v-if="props.text" class="w-100" />
  </div>
</template>

<style scoped>
.separator {
  display: flex;
  align-items: center;

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
