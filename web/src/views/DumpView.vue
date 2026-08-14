<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { liveQuery } from 'dexie'
import { db, type Note } from '@/db/database'
import NoteCard from "@/components/NoteCard.vue"
import IconPaperPlane from '@/components/icons/IconPaperPlane.vue'

const { t } = useI18n()

const notes = ref<Note[]>([])
const newNote = ref('')
const isWritingDumpNote = ref(false)
const isClickingSendButton = ref(false)

const dumpTextarea = ref<HTMLTextAreaElement | null>(null)

const notesSubscription = liveQuery(() =>
  db.notes
    .orderBy('modifiedAt')
    .reverse()
    .toArray()
).subscribe({
  next: value => {
    notes.value = value
  },
  error: error => {
    console.error('Error when pulling notes from database:', error)
  }
})

async function addNote() {
  const text = newNote.value.trim()

  if (!text) return

  const now = new Date()

  await db.notes.add({
    id: (() => {
      try {
        return crypto.randomUUID()
      } catch {
        return `${Date.now()}-${Math.random().toString(36).slice(2)}`
      }
    })(),
    text,
    createdAt: now,
    modifiedAt: now
  })

  newNote.value = ''
  isWritingDumpNote.value = false
  isClickingSendButton.value = false

  await nextTick()
  autoResize()
}

function autoResize() {
  const el = dumpTextarea.value
  if (!el) return

  const maxHeight = window.innerHeight * 0.4
  el.style.height = 'auto' // Reset to proper scrollHeight calculation
  el.style.height = `${el.scrollHeight}px`
  el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
}

function handleBlur() {
  if (isClickingSendButton.value) {
    isClickingSendButton.value = false
    return
  }

  isWritingDumpNote.value = false
}

onMounted(() => {
  autoResize();
})

onUnmounted(() => {
  notesSubscription.unsubscribe()
})
</script>

<template>
  <div class="card" :class="{ editing: isWritingDumpNote }" id="dump-composer">
    <div class="card-body p-0 d-flex">
      <textarea
        v-model="newNote"
        class="form-control p-3 border-0 shadow-none w-100 align-self-center"
        id="dump-textarea"
        ref="dumpTextarea"
        rows="1"
        @input="autoResize"
        @keydown.ctrl.enter.prevent="addNote"
        @focus="isWritingDumpNote = true"
        @blur="handleBlur"
        :placeholder="t('notes.composerPlaceholder')">
      </textarea>
      <div class="flex-shrink-1 align-self-center p-3">
        <button class="btn adw-btn-circular adw-btn-suggested-action" @mousedown="isClickingSendButton = true" @click="addNote">
          <IconPaperPlane />
        </button>
      </div>
    </div>
  </div>
  <div class="d-grid gap-3 mt-3">
    <NoteCard
      v-for="note in notes.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())"
      :key="note.id"
      :id="note.id"
      :date="note.modifiedAt"
      :text="note.text"
    />
  </div>
</template>

<style scoped>
#dump-composer {
  position: sticky;
  top: 16px;
  z-index: 1030;
  box-shadow:
    0 0.25rem 0.5rem var(--adw-card-shade-color);
  
  &.editing {
    position: fixed;
    inset: auto 0 calc(var(--tcb-bottom-navbar-height) + 4px);
    left: 0;
    right: 0;
    top: auto;
  }

  @media (min-width: 768px) {
    &.editing {
      position: sticky;
      top: 16px;
      inset: auto;
    }
  }
}

#dump-textarea {
  resize: none;
  overflow-y: auto;
  max-height: 40vh;
  background-color: transparent;
  border-radius: var(--adw-border-radius);
}
</style>
