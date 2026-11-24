<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { tasklist } from '@mdit/plugin-tasklist'
import AlertDialog from '@/components/AlertDialog.vue'
import IconMoreSmall from '@/components/icons/IconMoreSmall.vue'
import { locale } from '@/composables/useAppStates'
import { useNotes } from '@/composables/useNotes'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const { updateNote, readNote, deleteNote, pinNote, unpinNote, trashNote, untrashNote } = useNotes()
const { showToast, dismissToast } = useToast()

const props = defineProps<{
  noteId: string
}>()

const emit = defineEmits<{
  pinned: []
}>()

const showRemoveDialog = ref(false)
const note = readNote(props.noteId)
const isPinned = computed(() => note.value.pinnedAt != null)
const isTrashed = computed(() => note.value.trashedAt != null)

const dateFormats: Record<
  'today' | 'recent' | 'currentYear' | 'older',
  Intl.DateTimeFormatOptions
> = {
  today: {
    hour: '2-digit',
    minute: '2-digit',
  },
  recent: {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  },
  currentYear: {
    day: 'numeric',
    month: 'long',
  },
  older: {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
}

const dateFormatted = (() => {
  const now = new Date()

  const isToday =
    note.value.modifiedAt.getFullYear() === now.getFullYear() &&
    note.value.modifiedAt.getMonth() === now.getMonth() &&
    note.value.modifiedAt.getDate() === now.getDate()

  if (isToday) {
    const time = new Intl.DateTimeFormat(locale.state.value, dateFormats.today).format(
      note.value.modifiedAt,
    )

    return `${t('dates.today')}, ${time}`
  } else {
    const isYesterday =
      note.value.modifiedAt.getFullYear() === now.getFullYear() &&
      note.value.modifiedAt.getMonth() === now.getMonth() &&
      note.value.modifiedAt.getDate() === now.getDate() - 1

    if (isYesterday) {
      const time = new Intl.DateTimeFormat(locale.state.value, dateFormats.today).format(
        note.value.modifiedAt,
      )

      return `${t('dates.yesterday')}, ${time}`
    }
  }

  const diff = now.getTime() - note.value.modifiedAt.getTime()
  const sevenDays = 7 * 24 * 60 * 60 * 1000

  let format: Intl.DateTimeFormatOptions

  if (diff >= 0 && diff < sevenDays) {
    format = dateFormats.recent
  } else if (note.value.modifiedAt.getFullYear() === now.getFullYear()) {
    format = dateFormats.currentYear
  } else {
    format = dateFormats.older
  }

  return new Intl.DateTimeFormat(locale.state.value, format).format(note.value.modifiedAt)
})()

const md = new MarkdownIt({ breaks: true }).use(tasklist as any, { disabled: false })
const html = computed(() => md.render(note.value.content))

let lastToastId: string | null = null

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
  const lines = note.value.content.split('\n')

  let currentIndex = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (!line || !/^\s*[-*+]\s+\[[ xX]\]/.test(line)) continue

    if (currentIndex === taskIndex) {
      lines[i] = line.replace(/^(\s*[-*+]\s+)\[[ xX]\]/, `$1[${checked ? 'x' : ' '}]`)

      break
    }

    currentIndex++
  }

  const content = lines.join('\n')

  await updateNote(note.value.id, { content })
}

function askRemove() {
  showRemoveDialog.value = true
}

async function handlePinEvent() {
  if (isPinned.value) {
    await unpinNote(note.value.id)
  } else {
    await pinNote(note.value.id)
    emit('pinned')
  }
}

async function handleTrashEvent() {
  if (lastToastId) {
    dismissToast(lastToastId)
  }

  if (isTrashed.value) {
    await untrashNote(note.value.id)
    lastToastId = showToast(t('common.untrashed'), null, {
      func: async () => await trashNote(note.value.id),
      label: t('common.undo'),
    })
  } else {
    await trashNote(note.value.id)
    lastToastId = showToast(t('common.trashed'), null, {
      func: async () => await untrashNote(note.value.id),
      label: t('common.undo'),
    })
  }
}

async function removeNote() {
  await deleteNote(note.value.id)
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
          <button
            type="button"
            class="btn adw-btn-circular"
            data-bs-toggle="dropdown"
            data-bs-display="static"
            aria-expanded="false"
          >
            <IconMoreSmall />
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <template v-if="!isTrashed">
              <li class="dropdown-item" type="button" @click="handlePinEvent">
                {{ isPinned ? t('common.unpin') : t('common.pin') }}
              </li>
              <li>
                <RouterLink
                  class="dropdown-item"
                  :to="{
                    name: 'note-edit',
                    params: { id: note!.id },
                  }"
                >
                  {{ t('common.edit') }}
                </RouterLink>
              </li>
            </template>
            <li v-if="isTrashed" class="dropdown-item" type="button" @click="handleTrashEvent">
              {{ t('common.restore') }}
            </li>
            <li
              v-else
              class="dropdown-item adw-destructive-action"
              type="button"
              @click="handleTrashEvent"
            >
              {{ t('common.delete') }}
            </li>
            <li
              v-if="isTrashed"
              class="dropdown-item adw-destructive-action"
              type="button"
              @click="askRemove"
            >
              {{ t('common.deletePermanent') }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="card-body pt-0" v-html="html" @change="handleTaskChange"></div>
  </div>
  <AlertDialog
    v-if="isTrashed"
    :visible="showRemoveDialog"
    :title="t('dump.deleteTitle')"
    :message="t('dump.deleteMessage')"
    @confirm="removeNote"
    @cancel="showRemoveDialog = false"
  />
</template>

<style scoped>
.card-body :deep(h1) {
  font-size: 1.6rem;
  margin-bottom: 0.75rem;
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
  font-size: 0.9em;
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
