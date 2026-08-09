<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
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
        <button class="btn tcb-icon-button" @mousedown="isClickingSendButton = true" @click="addNote"><i class="bi bi-send-fill"></i></button>
      </div>
    </div>
  </div>
  <div class="d-grid gap-3 mt-3">
    <NoteCard
      v-for="note in notes"
      :key="note.id"
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
    0 1px 2px rgb(0 0 0 / 10%),
    0 1px 3px rgb(0 0 0 / 8%);
}

#dump-composer.editing {
  position: fixed;
  bottom: calc(var(--bottom-navbar-height) + env(safe-area-inset-bottom));
  left: 0;
  right: 0;
  top: auto;
  z-index: 1030;
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
}

#dump-composer, #dump-textarea {
  background-color: var(--md-sys-color-surface-container-low);
}

.tcb-icon-button i {
  color: var(--md-sys-color-primary);
  font-size: 24px;
}
</style>
