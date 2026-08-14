<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from 'vue-i18n'
import MarkdownIt from "markdown-it"
import taskLists from "markdown-it-task-lists"
import { useSettingsStore } from '@/stores/settings'
import { db } from '@/db/database'
import AlertDialog from '@/components/AlertDialog.vue'

const { t } = useI18n()
const settings = useSettingsStore()

const props = defineProps<{
  id: string,
  date: Date,
  text: string
}>()

const showRemoveDialog = ref(false)

const dateFormats: Record<
  'today' | 'recent' | 'currentYear' | 'older',
  Intl.DateTimeFormatOptions
> = {
   today: {
    hour: '2-digit',
    minute: '2-digit'
  },
  recent: {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  },
  currentYear: {
    day: 'numeric',
    month: 'long'
  },
  older: {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
}

const dateFormatted = (() => {
  const now = new Date()

  const isToday =
    props.date.getFullYear() === now.getFullYear() &&
    props.date.getMonth() === now.getMonth() &&
    props.date.getDate() === now.getDate()

  if (isToday) {
    const time = new Intl.DateTimeFormat(
      settings.locale,
      dateFormats.today
    ).format(props.date)

    return `${t('dates.today')}, ${time}`
  }

  const diff = now.getTime() - props.date.getTime()
  const sevenDays = 7 * 24 * 60 * 60 * 1000

  let format: Intl.DateTimeFormatOptions

  if (diff >= 0 && diff < sevenDays) {
    format = dateFormats.recent
  } else if (props.date.getFullYear() === now.getFullYear()) {
    format = dateFormats.currentYear
  } else {
    format = dateFormats.older
  }

  return new Intl.DateTimeFormat(
    settings.locale,
    format
  ).format(props.date)
})()
  
const md = new MarkdownIt({
    breaks: true
  }).use(taskLists)

const html = computed(() => md.render(props.text))

function askRemove() {
  showRemoveDialog.value = true
}

async function removeNote() {
  await db.notes.delete(props.id)
  showRemoveDialog.value = false
}
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header p-1 ps-3 d-flex border-0">
      <div class="w-100 align-self-center text-body-secondary">
        {{ dateFormatted }}
      </div>
      <div class="flex-shrink-1">
        <div class="dropdown-center">
          <button type="button" class="btn adw-btn-circular" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 16 16" width="16px">
              <path d="m 4 6.734375 c -0.699219 0 -1.265625 0.566406 -1.265625 1.265625 s 0.566406 1.265625 1.265625 1.265625 s 1.265625 -0.566406 1.265625 -1.265625 s -0.566406 -1.265625 -1.265625 -1.265625 z m 4 0 c -0.699219 0 -1.265625 0.566406 -1.265625 1.265625 s 0.566406 1.265625 1.265625 1.265625 s 1.265625 -0.566406 1.265625 -1.265625 s -0.566406 -1.265625 -1.265625 -1.265625 z m 4 0 c -0.699219 0 -1.265625 0.566406 -1.265625 1.265625 s 0.566406 1.265625 1.265625 1.265625 s 1.265625 -0.566406 1.265625 -1.265625 s -0.566406 -1.265625 -1.265625 -1.265625 z m 0 0" fill="#222222"/>
            </svg>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><button class="dropdown-item" type="button">{{ t('common.edit') }}</button></li>
            <li><button class="dropdown-item adw-destructive-action" type="button" @click="askRemove">{{ t('common.delete') }}</button></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="card-body pt-0" v-html="html"></div>
  </div>
  <AlertDialog
    :visible="showRemoveDialog"
    :title="t('notes.deleteTitle')"
    :message="t('notes.deleteMessage')"
    @confirm="removeNote"
    @cancel="showRemoveDialog = false"
  />
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