<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from "vue"
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { readNote, updateNote } from "@/database/notes"

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const noteContent = ref('')
const textarea = ref<HTMLTextAreaElement | null>(null)

let saveTimeout: ReturnType<typeof setTimeout> | null = null
let latelySavedContent = ''

function scheduleSave() {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }

  saveTimeout = setTimeout(() => {
    saveNote()
  }, 1000)
}

function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    saveNote()
  }
}

async function saveNote() {
  const id = route.params.id as string
  const content = noteContent.value.trim()

  if (!content || content === latelySavedContent) return

  await updateNote(id, content)

  latelySavedContent = content
}

onMounted(async () => {
  const id = route.params.id as string

  const note = await readNote(id)

  if (!note) {
    await router.replace('/')
    return
  }

  noteContent.value = note.content
  latelySavedContent = note.content

  await nextTick()

  textarea.value?.focus()

  if (textarea.value) {
    const length = textarea.value.value.length
    textarea.value.setSelectionRange(length, length)
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeRouteLeave(async () => {
  if (saveTimeout) {
    clearTimeout(saveTimeout)
  }

  await saveNote()
})
</script>

<template>
  <textarea
    v-model="noteContent"
    ref="textarea"
    class="form-control p-3 border-0 shadow-none w-100 align-self-center"
    @input="scheduleSave"
    :placeholder="t('notes.composerPlaceholder')">
  </textarea>
</template>

<style scoped>
textarea {
  resize: none;
  overflow-y: hidden;
  min-height: var(--tcb-app-body-height);
  field-sizing: content;
}
</style>