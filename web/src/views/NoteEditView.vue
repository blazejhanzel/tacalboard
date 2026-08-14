<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from "vue"
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { db } from '@/db/database'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const noteText = ref('')
const textarea = ref<HTMLTextAreaElement | null>(null)

let saveTimeout: ReturnType<typeof setTimeout> | null = null
let unchangedText = ''
let latelySavedText = ''

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
  const text = noteText.value.trim()

  if (!text || text === latelySavedText) return

  await db.notes.update(id, {
    text,
    modifiedAt: new Date()
  })

  latelySavedText = text
}

onMounted(async () => {
  const id = route.params.id as string

  const note = await db.notes.get(id)

  if (!note) {
    await router.replace('/')
    return
  }

  noteText.value = note.text
  unchangedText = note.text
  latelySavedText = note.text

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
    v-model="noteText"
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