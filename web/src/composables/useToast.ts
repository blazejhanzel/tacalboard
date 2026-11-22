import { ref } from 'vue'

export type ToastIcon = 'success' | 'error' | 'info' | 'warning' | null

export interface ToastCallback {
  func: () => void
  label: string
}

export interface Toast {
  id: string
  message: string
  icon: ToastIcon
  callback: ToastCallback | null
  opacity: number
}

const toasts = ref<Toast[]>([])

const timers = new Map<string, ReturnType<typeof setTimeout>>()
const opacityModifier = 0.2

function showToast(
  message: string,
  icon: ToastIcon = null,
  callback: ToastCallback | null = null,
  duration = 5000,
): string {
  const id = crypto.randomUUID()
  const callbackWithDismiss = {
    func: () => {
      callback?.func()
      dismissToast(id)
    },
    label: callback?.label ?? '',
  }

  for (const toast of toasts.value) {
    toast.opacity = Math.max(toast.opacity - opacityModifier, opacityModifier * 3.0)
  }

  toasts.value.push({
    id,
    message,
    icon,
    callback: callback ? callbackWithDismiss : null,
    opacity: 1.0,
  })

  if (duration > 0) {
    timers.set(
      id,
      setTimeout(() => dismissToast(id), duration),
    )
  }

  return id
}

function dismissToast(id: string) {
  const index = toasts.value.findIndex((toast) => toast.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
    for (const toast of toasts.value) {
      toast.opacity = Math.min(toast.opacity + opacityModifier, 1.0)
    }
  }
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

export function useToast() {
  return {
    toasts,
    showToast,
    dismissToast,
  }
}
