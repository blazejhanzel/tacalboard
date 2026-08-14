<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import IconDockLeft from '@/components/icons/IconDockLeft.vue';
import IconSunOutline from '@/components/icons/IconSunOutline.vue';
import IconMoonOutline from '@/components/icons/IconMoonOutline.vue';
import IconPerson from '@/components/icons/IconPerson.vue';
import IconGoPrevious from '@/components/icons/IconGoPrevious.vue';

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const settings = useSettingsStore()

const props = defineProps<{
  isScrolled: boolean
}>()

const title = computed(() =>
  route.meta.title ? t(route.meta.title as string) : 'Tacalboard'
)

const hasSidebar = computed(() =>
  route.meta.sidebar ? route.meta.sidebar : false
)

const showBackButton = computed(() =>
  route.meta.back ? route.meta.back : false
)

function goBack() {
  router.back()
}

function toggleTheme() {
  settings.theme = settings.theme === 'light' ? 'dark' : 'light'

  document.documentElement.setAttribute('data-bs-theme', settings.theme)
  document.documentElement.setAttribute('data-custom-theme', settings.theme)
}
</script>

<template>
  <header class="navbar navbar-expand-lg p-2" :class="{ 'is-scrolled': isScrolled }" id="header">
    <div class="container-fluid p-0">
      <div class="row w-100 m-0 align-items-center">
        <div class="col-4 p-0 d-flex gap-2">
          <button v-if="hasSidebar" class="btn">
            <IconDockLeft />
          </button>
          <button v-if="showBackButton" class="btn" @click="goBack">
            <IconGoPrevious />
          </button>
        </div>
        <div class="col-4 p-0 text-center">
          <a class="navbar-brand me-auto">{{ title }}</a>
        </div>
        <div class="col-4 p-0 d-flex gap-2 justify-content-end">
          <button class="btn" @click="toggleTheme">
            <IconSunOutline v-if="settings.theme == 'light'" />
            <IconMoonOutline v-else />
          </button>
          <button class="btn">
            <IconPerson />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: var(--adw-window-bg-color);
  z-index: 1050;
}

header.is-scrolled {
  box-shadow:
    0 1px 2px rgb(0 0 0 / 12%),
    0 2px 4px rgb(0 0 0 / 6%);
}

.navbar-brand {
  color: var(--adw-headerbar-fg-color);
}
</style>
