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
    <div class="card-header p-1 ps-3 d-flex border-0">
      <div class="w-100 align-self-center text-body-secondary">
        Featured
      </div>
      <div class="flex-shrink-1">
        <div class="dropdown-center">
          <button type="button" class="btn adw-btn-circular" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 16 16" width="16px">
              <path d="m 4 6.734375 c -0.699219 0 -1.265625 0.566406 -1.265625 1.265625 s 0.566406 1.265625 1.265625 1.265625 s 1.265625 -0.566406 1.265625 -1.265625 s -0.566406 -1.265625 -1.265625 -1.265625 z m 4 0 c -0.699219 0 -1.265625 0.566406 -1.265625 1.265625 s 0.566406 1.265625 1.265625 1.265625 s 1.265625 -0.566406 1.265625 -1.265625 s -0.566406 -1.265625 -1.265625 -1.265625 z m 4 0 c -0.699219 0 -1.265625 0.566406 -1.265625 1.265625 s 0.566406 1.265625 1.265625 1.265625 s 1.265625 -0.566406 1.265625 -1.265625 s -0.566406 -1.265625 -1.265625 -1.265625 z m 0 0" fill="#222222"/>
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
  border-radius: var(--adw-border-radius);
  padding: 1rem;
  background: var(--adw-window-bg-color);
}

.card-body :deep(code) {
  font-size: .9em;
}

.card-body :deep(blockquote) {
  border-left: 4px solid var(--adw-accent-slate);
  padding-left: 1rem;
  color: var(--adw-accent-slate-standalone);
}
</style>