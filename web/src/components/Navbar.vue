<script setup lang="ts">
import { ref, nextTick, onMounted } from "vue";
import { useI18n } from 'vue-i18n'
import NavbarButton from '@/components/NavbarButton.vue'
import IconInbox from '@/components/icons/IconInbox.vue'
import IconNotepad from '@/components/icons/IconNotepad.vue'

const { t } = useI18n()

const navWidth = ref(0)
const navbar = ref<HTMLElement | null>(null)

onMounted(async () => {
  const navbar = document.getElementById("navbar")!;
  
  document.documentElement.style.setProperty(
    "--tcb-bottom-navbar-height",
    `${navbar.offsetHeight}px`
  );
})

onMounted(async () => {
  await nextTick()

  const widths = [...navbar.value!.querySelectorAll('.nav-link')]
    .map(el => el.getBoundingClientRect().width)

  navWidth.value = Math.ceil(Math.max(...widths))
})
</script>

<template>
  <nav ref="navbar" class="container-fluid nav gap-2 d-flex justify-content-center" id="navbar" role="tablist">
    <NavbarButton to="/" :label="t('navbar.dump')" :style="navWidth ? { width: `${navWidth}px` } : undefined">
      <IconInbox />
    </NavbarButton>
    <NavbarButton to="/notepad" :label="t('navbar.notepad')" :style="navWidth ? { width: `${navWidth}px` } : undefined">
      <IconNotepad />
    </NavbarButton>
  </nav>
</template>

<style scoped>
.container-fluid {
  background-color: var(--adw-window-bg-color);
  padding: 0.5rem;
  z-index: 1050;
  box-shadow:
    0 -1px 1px rgb(0 0 0 / 12%),
    0 -2px 2px rgb(0 0 0 / 6%);
}
</style>