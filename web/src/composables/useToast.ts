import { ref } from 'vue'

export type ToastIcon = 'success' | 'error' | 'info' | 'warning' | null

export interface Toast {
  id: string
  message: string
  icon: ToastIcon
}

const toasts = ref<Toast[]>([])
const timers = new Map<string, ReturnType<typeof setTimeout>>()

function showToast(message: string, icon: ToastIcon = null, duration = 5000) {
  const id = crypto.randomUUID()

  toasts.value.push({
    id,
    message,
    icon,
  })

  if (duration > 0) {
    timers.set(
      id,
      setTimeout(() => dismissToast(id), duration),
    )
  }
}

function dismissToast(id: string) {
  const index = toasts.value.findIndex((toast) => toast.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
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
