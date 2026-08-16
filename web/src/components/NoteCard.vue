<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import MarkdownIt from "markdown-it"
import { tasklist } from '@mdit/plugin-tasklist'
import { db } from '@/database/database'
import AlertDialog from '@/components/AlertDialog.vue'
import IconMoreSmall from "@/components/icons/IconMoreSmall.vue"

const { t } = useI18n()
const router = useRouter()
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
  }).use(tasklist as any, {
    disabled: false
  })

const html = computed(() => md.render(props.text))

function handleTaskChange(event: Event) {
  const target = event.target

  if (!(target instanceof HTMLInputElement)) return
  if (target.type !== 'checkbox') return
  if (!target.id.startsWith('task-item-')) return

  const taskIndex = Number(target.id.replace('task-item-', ''))

  if (Number.isNaN(taskIndex)) return

  toggleTask(taskIndex, target.checked)
}

async function toggleTask(taskIndex: number, checked: boolean) {
  const lines = props.text.split('\n')

  let currentIndex = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (!line || !/^\s*[-*+]\s+\[[ xX]\]/.test(line)) continue

    if (currentIndex === taskIndex) {
      lines[i] = line.replace(
        /^(\s*[-*+]\s+)\[[ xX]\]/,
        `$1[${checked ? 'x' : ' '}]`
      )

      break
    }

    currentIndex++
  }

  const text = lines.join('\n')

  await db.notes.update(props.id, { text })
}

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
            <IconMoreSmall />
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <RouterLink
                class="dropdown-item"
                :to="{
                  name: 'note-edit',
                  params: { id: props.id }
                }"
              >
                {{ t('common.edit') }}
              </RouterLink>
            </li>
            <li><button class="dropdown-item adw-destructive-action" type="button" @click="askRemove">{{ t('common.delete') }}</button></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="card-body pt-0" v-html="html" @change="handleTaskChange"></div>
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

:deep(ul.task-list-container) {
  list-style: none;
  padding-left: 1rem;
}

:deep(ul.task-list-container:last-child) {
  margin-bottom: 0;
}

:deep(li.task-list-item) {
  .task-list-item-checkbox {
    margin-right: 0.5rem;
  }
}
</style>