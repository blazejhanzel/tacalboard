<script setup lang="ts">
import { type Component, type PropType } from 'vue'
import IconCheckRoundOutline from '@/components/icons/IconCheckRoundOutline.vue'
import IconErrorOutline from '@/components/icons/IconErrorOutline.vue'
import IconExclamationMark from '@/components/icons/IconExclamationMark.vue'
import IconInfoOutline from '@/components/icons/IconInfoOutline.vue'

export type AlertType = 'info' | 'success' | 'warning' | 'error'

const props = defineProps({
  alertType: {
    type: String as PropType<AlertType>,
    required: false,
    default: 'info',
  },
  content: {
    type: String,
    required: true,
  },
  dismissible: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const properties = (() => {
  const classes: string[] = []
  let icon: Component | null = null

  switch (props.alertType) {
    case 'info':
      classes.push('alert-info')
      icon = IconInfoOutline
      break
    case 'success':
      classes.push('alert-success')
      icon = IconCheckRoundOutline
      break
    case 'warning':
      classes.push('alert-warning')
      icon = IconExclamationMark
      break
    case 'error':
      classes.push('alert-danger')
      icon = IconErrorOutline
      break
  }

  if (props.dismissible) {
    classes.push('alert-dismissible')
  }

  return {
    class: classes.join(' '),
    icon,
  }
})()
</script>

<template>
  <div class="alert d-flex align-items-center" :class="properties.class" role="alert">
    <component v-if="properties.icon" :is="properties.icon" />
    <span class="ms-2">{{ props.content }}</span>
    <button v-if="props.dismissible" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
</template>
