<script setup lang="ts">
import { ref, nextTick, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotes } from '@/composables/useNotes'
import NoteCard from '@/components/NoteCard.vue'
import IconPaperPlane from '@/components/icons/IconPaperPlane.vue'
import Separator from '@/components/Separator.vue'

const { t } = useI18n()
const { notes, createNote } = useNotes()

const newNote = ref('')
const isWritingDumpNote = ref(false)
const isClickingSendButton = ref(false)
const dumpTextarea = ref<HTMLTextAreaElement | null>(null)
const pinnedSection = ref<InstanceType<typeof Separator> | null>(null)
const showTrashed = ref(false)
const activeNotes = computed(() =>
  notes.value
    .filter((note) => note.trashedAt == null)
    .sort((a, b) => {
      if (a.pinnedAt != null && b.pinnedAt == null) return -1
      if (a.pinnedAt == null && b.pinnedAt != null) return 1

      const dateA = a.pinnedAt ?? a.modifiedAt
      const dateB = b.pinnedAt ?? b.modifiedAt

      return dateB.getTime() - dateA.getTime()
    }),
)
const trashedNotes = computed(() =>
  notes.value
    .filter((note) => note.trashedAt != null)
    .sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime()),
)

// TODO: Spiąc cztery tablice do max dwóch trashed i domyślna: posortowana według daty przypięcia a jeśli jest null to według daty modyfikacji

async function addNote() {
  const content = newNote.value.trim()

  if (!content) return

  createNote(content)

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

async function handleNotePinned() {
  await nextTick()
  pinnedSection.value?.scrollIntoView()
}

onMounted(() => {
  autoResize()
})
</script>

<template>
  <div class="container" :class="{ 'h-100': notes.length === 0 }">
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
          :placeholder="t('dump.composerPlaceholder')"
        >
        </textarea>
        <div class="flex-shrink-1 align-self-center p-3">
          <button
            class="btn adw-btn-circular adw-btn-suggested-action"
            @mousedown="isClickingSendButton = true"
            @click="addNote"
          >
            <IconPaperPlane />
          </button>
        </div>
      </div>
    </div>
    <div v-if="notes.length > 0" class="d-grid gap-3 pt-3 pb-3">
      <div></div>
      <Separator
        v-show="activeNotes.some((note) => note.pinnedAt != null)"
        ref="pinnedSection"
        :text="t('dump.pinnedNotesSeparator')"
      />
      <template v-for="(note, index) in activeNotes" :key="note.id">
        <Separator
          v-if="note.pinnedAt == null && (index === 0 || activeNotes[index - 1]?.pinnedAt != null)"
          :text="t('dump.recentNotesSeparator')"
        />
        <NoteCard :noteId="note.id" @pinned="handleNotePinned" />
      </template>
      <template v-if="trashedNotes.length > 0">
        <Separator :text="t('dump.recentlyDeletedSeparator')" />
        <ul v-if="!showTrashed" class="list-group m-0">
          <button class="list-group-item" type="button" @click="() => (showTrashed = !showTrashed)">
            {{ t('dump.recentlyDeletedLink') }}
          </button>
        </ul>
        <NoteCard
          v-if="showTrashed"
          v-for="note in trashedNotes"
          :key="note.id"
          :noteId="note.id"
        />
      </template>
    </div>
    <div
      v-else
      id="empty-placeholder"
      class="d-flex align-items-center gap-3 pt-3 pb-3 text-center"
    >
      <div class="m-auto">
        {{ t('dump.emptyPlaceholder') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
#dump-composer {
  position: sticky;
  top: 16px;
  z-index: 1030;
  box-shadow: 0 0.25rem 0.5rem var(--adw-card-shade-color);

  &.editing {
    position: fixed;
    bottom: calc(var(--tcb-bottom-navbar-height) + 1rem);
    left: 0;
    right: 0;
    top: auto;
  }

  @media (min-width: 768px) {
    &.editing {
      position: sticky;
      top: 16px;
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

#empty-placeholder {
  height: calc(100% - var(--tcb-bottom-navbar-height) - 16px);
}
</style>
