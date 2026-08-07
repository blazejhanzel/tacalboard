<script setup lang="ts">
import MarkdownIt from "markdown-it"
import taskLists from "markdown-it-task-lists"
import { computed } from "vue"

const md = new MarkdownIt({
    breaks: true
  }).use(taskLists)

const props = defineProps<{
  text: string
}>()

const html = computed(() => md.render(props.text))
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-body" v-html="html"></div>
  </div>
</template>

<style scoped>
.card-body :deep(h1) {
  font-size: 1.6rem;
  margin-bottom: .75rem;
}

.card-body :deep(h2) {
  font-size: 1.4rem;
}

.card-body :deep(h3) {
  font-size: 1.2rem;
}

.card-body :deep(p:last-child) {
  margin-bottom: 0;
}

.card-body :deep(pre) {
  border-radius: .5rem;
  padding: 1rem;
  background: var(--bs-secondary-bg);
}

.card-body :deep(code) {
  font-size: .9em;
}

.card-body :deep(blockquote) {
  border-left: 4px solid var(--bs-secondary);
  padding-left: 1rem;
  color: var(--bs-secondary-color);
}
</style>