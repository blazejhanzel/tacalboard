<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBackup } from '@/composables/useBackup'
import IconCheckRoundOutline from '@/components/icons/IconCheckRoundOutline.vue'
import IconWarningOutline from '@/components/icons/IconWarningOutline.vue'

const { t } = useI18n()
const database = useBackup()

const importStatus = ref<'success' | 'error' | null>(null)

async function importDatabaseFile() {
  importStatus.value = null

  const status = await database.upload()

  importStatus.value = status ? 'success' : 'error'
}
</script>

<template>
  <div class="container">
    <div
      v-if="importStatus === 'error'"
      class="alert alert-warning alert-dismissible d-flex align-items-center"
      role="alert"
    >
      <IconWarningOutline />
      <span class="ms-2">An error occured durring import</span>
    </div>
    <div
      v-else-if="importStatus === 'success'"
      class="alert alert-success alert-dismissible d-flex align-items-center"
      role="alert"
    >
      <IconCheckRoundOutline />
      <span class="ms-2">Imported succesfully completed</span>
    </div>

    <h6>{{ t('backupAndRestore.backupHeader') }}</h6>
    <p class="text-body-secondary">{{ t('backupAndRestore.backupHint') }}</p>
    <ul class="list-group">
      <button class="list-group-item" @click="database.download">
        {{ t('backupAndRestore.backupButton') }}
      </button>
    </ul>
    <h6>{{ t('backupAndRestore.restoreHeader') }}</h6>
    <p class="text-body-secondary">{{ t('backupAndRestore.restoreHint') }}</p>
    <ul class="list-group">
      <label class="list-group-item form-check-label" for="radioTypeReplace">
        <span class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="radioType"
            id="radioTypeReplace"
            value="replace"
            v-model="database.importMode.value"
          />
          <span>{{ t('backupAndRestore.importTypes.replace') }}</span>
        </span>
      </label>
      <label class="list-group-item form-check-label" for="radioTypeAppend">
        <span class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="radioType"
            id="radioTypeAppend"
            value="append"
            v-model="database.importMode.value"
          />
          <label class="form-check-label" for="radioTypeAppend">
            {{ t('backupAndRestore.importTypes.append') }}
          </label>
        </span>
      </label>
    </ul>
    <p class="text-body-secondary">{{ t('backupAndRestore.importHint') }}</p>
    <ul class="list-group">
      <li class="list-group-item">
        <label for="importedFile" class="w-100">
          {{ database.importFile.value?.name ?? t('common.selectFile') }}
        </label>
        <input
          type="file"
          id="importedFile"
          accept=".json,application/json"
          class="visually-hidden"
          @change="
            database.importFile.value = ($event.target as HTMLInputElement).files?.[0] ?? null
          "
        />
      </li>
    </ul>
    <ul class="list-group">
      <button
        class="list-group-item"
        type="button"
        id="importFileButton"
        :disabled="!database.importFile.value || !database.importMode.value"
        @click="importDatabaseFile"
      >
        {{ t('common.import') }}
      </button>
    </ul>
  </div>
</template>

<style scoped>
h6 {
  margin-top: 1rem;
  margin-bottom: 0.35rem;
}

button {
  align-items: center;
  justify-content: center;
}
</style>
