<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import NoteCard from "@/components/NoteCard.vue"

const notes = ref([
  { // Notatka kupienia mleka - stara notatka
    id: 1,
    text: "Kupić mleko.",
    createdAt: new Date("2023-10-01T08:00:00Z"),
    modifiedAt: new Date("2023-10-01T08:00:00Z") 
  },
  { // Notatka z listy zadań na weekend - notatka stworzona dawno temu
    id: 2,
    text: `## Weekend

- Posprzątać mieszkanie
- Zrobić pranie
- Odebrać paczkę z paczkomatu

Na koniec wieczorem obejrzeć film.`,
    createdAt: new Date("2023-11-15T14:30:00Z"),
    modifiedAt: new Date("2023-11-15T14:30:00Z") 
  },
  { // Pomysł na aplikację - notatka stworzona ostatnio, zmieniona dziś rano
    id: 3,
    text: `# Pomysł

Chciałbym, żeby aplikacja działała trochę jak **Google Keep**, ale z możliwością późniejszego przekształcenia każdej notatki w zadanie lub wydarzenie w kalendarzu.

Najważniejsze cechy:

- szybkie dodawanie,
- pełne wsparcie dla Markdown,
- synchronizacja pomiędzy urządzeniami,
- działanie offline jako PWA.`,
    createdAt: new Date("2024-05-28T09:00:00Z"),
    modifiedAt: new Date("2024-05-29T10:30:00Z") // Zaktualizowane dziś!
  },
  { // Cytat - notatka stworzona w innym dniu
    id: 4,
    text: `> "The best productivity system is the one you actually use."

Może warto wyświetlać losowy cytat na ekranie głównym?`,
    createdAt: new Date("2023-12-25T18:00:00Z"),
    modifiedAt: new Date("2023-12-25T18:00:00Z") 
  },
  { // Brain dump - notatka aktywnie zarządzana
    id: 5,
    text: `### Brain dump

Dzisiaj wpadło mi kilka pomysłów:

- [ ] Dodać wyszukiwarkę notatek
- [ ] Zaimplementować tagi
- [x] Stworzyć komponent karty
- [ ] Zapisać dane w IndexedDB

Na razie wszystko trzymane jest tylko w pamięci aplikacji.`,
    createdAt: new Date("2024-05-27T16:00:00Z"),
    modifiedAt: new Date("2024-05-28T15:30:00Z") // Ostatnia edycja była rano.
  },
  {
    id: 6,
    createdAt: new Date("2024-05-27T15:00:00Z"),
    modifiedAt: new Date("2024-05-28T15:20:00Z"),
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

Po spotkaniu przygotować krótkie podsumowanie.`,
    createdAt: new Date(), // Bieżąca data utworzenia
    modifiedAt: new Date()
  }
])

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

  notes.value.unshift({
    id: Date.now(),
    createdAt: new Date(),
    modifiedAt: new Date(),
    text
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
        <button class="btn adw-btn-circular adw-suggested-action" @mousedown="isClickingSendButton = true" @click="addNote">
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
      calc(var(--tcb-bottom-navbar-height) 
      + env(safe-area-inset-bottom)
      + 4px);
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
