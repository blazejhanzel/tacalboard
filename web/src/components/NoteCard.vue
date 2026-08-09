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
  <div class="card">
    <div class="card-header p-1 ps-3 d-flex border-0">
      <div class="w-100 align-self-center text-body-secondary">
        Featured
      </div>
      <div class="flex-shrink-1">
        <div class="btn-group">
          <button type="button" class="btn tcb-icon-button tcb-icon-button-s" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
            </svg>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><button class="dropdown-item" type="button">Action</button></li>
            <li><button class="dropdown-item" type="button">Another action</button></li>
            <li><button class="dropdown-item" type="button">Something else here</button></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="card-body pt-0" v-html="html"></div>
  </div>
</template>

<style scoped>
.card, .card-header {
  background-color: var(--md-sys-color-surface);
}

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