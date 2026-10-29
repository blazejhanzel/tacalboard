<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import IconCloudDisabled from '@/components/icons/IconCloudDisabled.vue'
import IconCloudFilled from '@/components/icons/IconCloudFilled.vue'
import IconUpdate from '@/components/icons/IconUpdate.vue'
import IconDockLeft from '@/components/icons/IconDockLeft.vue'
import IconGoPrevious from '@/components/icons/IconGoPrevious.vue'
import IconOpenMenu from '@/components/icons/IconOpenMenu.vue'
import { useSync } from '@/composables/useSync'

const appVersion = __APP_VERSION__
const developmentRun = true //TODO: import.meta.env.DEV
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const sync = useSync()

const props = defineProps<{
  isScrolled: boolean
}>()

const title = computed(() => route.meta.title ? t(route.meta.title as string) : 'Tacalboard')
const hasSidebar = computed(() => route.meta.sidebar ?? false)
const showBackButton = computed(() => route.meta.navigationBack ?? false)
const showAppMenu = computed(() => route.meta.showAppMenu ?? true)

function goBack() {
  router.back()
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
          <button class="btn" :disabled="!developmentRun" @click="sync.sync">
            <IconCloudFilled v-if="sync.syncStatus.value === 'synced'" />
            <IconUpdate v-else-if="sync.syncStatus.value === 'syncing'"/>
            <IconCloudDisabled v-else-if="sync.syncStatus.value === 'not-synced'"/>
          </button>
          <div v-if="showAppMenu" class="dropdown-center">
            <button
              class="btn"
              data-bs-toggle="dropdown"
              data-bs-display="static"
              aria-expanded="false"
            >
              <IconOpenMenu />
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <RouterLink :to="'/settings'" class="dropdown-item w-100" type="button" aria-expanded="false">
                  <span>{{ t('app.settings') }}</span>
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider m-1"></li>
              <li>
                <button class="dropdown-item d-flex gap-2 align-items-center w-100" type="button" disabled>
                  <span>Wersja: {{ appVersion }}</span>
                </button>
              </li>
            </ul>
          </div>
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
