<script setup lang="ts">
import { ref, nextTick } from 'vue'
import NoteCard from "@/components/NoteCard.vue"

const notes = ref([
  {
    id: 1,
    text: "Kupić mleko."
  },
  {
    id: 2,
    text: `## Weekend

- Posprzątać mieszkanie
- Zrobić pranie
- Odebrać paczkę z paczkomatu

Na koniec wieczorem obejrzeć film.`
  },
  {
    id: 3,
    text: `# Pomysł

Chciałbym, żeby aplikacja działała trochę jak **Google Keep**, ale z możliwością późniejszego przekształcenia każdej notatki w zadanie lub wydarzenie w kalendarzu.

Najważniejsze cechy:

- szybkie dodawanie,
- pełne wsparcie dla Markdown,
- synchronizacja pomiędzy urządzeniami,
- działanie offline jako PWA.`
  },
  {
    id: 4,
    text: `> "The best productivity system is the one you actually use."

Może warto wyświetlać losowy cytat na ekranie głównym?`
  },
  {
    id: 5,
    text: `### Brain dump

Dzisiaj wpadło mi kilka pomysłów:

- [ ] Dodać wyszukiwarkę notatek
- [ ] Zaimplementować tagi
- [x] Stworzyć komponent karty
- [ ] Zapisać dane w IndexedDB

Na razie wszystko trzymane jest tylko w pamięci aplikacji.`
  },
  {
    id: 6,
    text: `Przykład kodu:

\`\`\`ts
const note = {
  id: Date.now(),
  text: "Hello!"
}
\`\`\`

Po kliknięciu **Save** notatka powinna pojawić się na początku listy.`
  },
  {
    id: 7,
    text: `### Spotkanie

| Godzina | Temat |
|---------:|-------|
| 09:00 | Daily |
| 11:30 | Projekt organizera |
| 15:00 | Przegląd zadań |

Po spotkaniu przygotować krótkie podsumowanie.`
  }
])

const dumpTextarea = ref<HTMLTextAreaElement | null>(null)

const newNote = ref('')
const isWritingDumpNote = ref(false)
const isClickingSendButton = ref(false)

function autoResize() {
  if (!dumpTextarea.value) return

  dumpTextarea.value.style.height = "0px";
  dumpTextarea.value.style.height = dumpTextarea.value.scrollHeight + "px";
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

  notes.value.unshift({
    id: Date.now(),
    text
  })

  newNote.value = ''
  isWritingDumpNote.value = false
  
  await nextTick()
  autoResize()
}
</script>

<template>
  <div class="card shadow mt-3 mb-3" :class="{ editing: isWritingDumpNote }" id="dump-composer">
    <div class="card-body p-0 d-flex">
      <textarea
        v-model="newNote"
        class="form-control p-3 border-0 shadow-none"
        id="dump-textarea"
        ref="dumpTextarea"
        rows="1"
        @input="autoResize"
        @keydown.ctrl.enter.prevent="addNote"
        @focus="isWritingDumpNote = true"
        @blur="handleBlur"
        placeholder="Note anything you need to remember...">
      </textarea>
      <button class="btn rounded-2 p-3" @mousedown="isClickingSendButton = true" @click="addNote"><i class="bi bi-send-fill text-body-emphasis"></i></button>
    </div>
  </div>
  <div class="d-grid gap-3">
    <NoteCard
      v-for="note in notes"
      :key="note.id"
      :text="note.text"
    />
  </div>
</template>

<style>
#dump-textarea {
  resize: none;
  overflow: hidden;
}

#dump-composer {
  position: sticky;
  top: 0;
  z-index: 1030;
}

#dump-composer.editing {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: auto;
  z-index: 1030;
}

@media (min-width: 768px) {
  #dump-composer.editing {
    position: sticky;
    top: 0;
  }
}
</style>
