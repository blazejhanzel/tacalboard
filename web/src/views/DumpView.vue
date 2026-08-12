<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { liveQuery } from 'dexie'
import { db, type Note } from '@/db/database'
import NoteCard from "@/components/NoteCard.vue"

/* Notes database management */

const notes = ref<Note[]>([])

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
    console.error('Błąd podczas pobierania notatek:', error)
  }
})

onUnmounted(() => {
  notesSubscription.unsubscribe()
})

/* Vue management */

const dumpTextarea = ref<HTMLTextAreaElement | null>(null)
const newNote = ref('')
const isWritingDumpNote = ref(false)
const isClickingSendButton = ref(false)

function autoResize() {
  const el = dumpTextarea.value

  if (!el) return

  const maxHeight = window.innerHeight * 0.4

  // Reset wysokości, aby poprawnie obliczyć nowy scrollHeight.
  el.style.height = 'auto'

  // Dopasuj wysokość do aktualnej zawartości.
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

onMounted(() => {
  autoResize();
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
        placeholder="Capture a thought... ">
      </textarea>
      <div class="flex-shrink-1 align-self-center p-3">
        <button class="btn adw-btn-circular adw-btn-suggested-action" @mousedown="isClickingSendButton = true" @click="addNote">
          <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 16 16" width="16px">
            <path d="m 15 7.992188 l -14 -7 v 6 l 8 1 l -8 1 v 6 z m 0 0" fill="#222222"/>
          </svg>
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
    bottom:
      calc(var(--tcb-bottom-navbar-height) + 4px);
    left: 0;
    right: 0;
    top: auto;
  }
}

@media (min-width: 768px) {
  #dump-composer.editing {
    position: sticky;
    top: 16px;
  }
}

#dump-textarea {
  resize: none;
  overflow-y: auto;
  max-height: 40vh; /* lub np. 250px */
  background-color: transparent;
  border-radius: var(--adw-border-radius);
}
</style>
