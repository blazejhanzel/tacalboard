import { ref, readonly, type Ref } from 'vue'
import { db } from '@/database'

const states = new Map<string, Ref>()

async function createAppState<T extends string | number>(key: string, defaultValue: T) {
  const savedState = await db.appStates.get(key)
  const initialValue = savedState ? (savedState.value as T) : defaultValue
  const state = ref(initialValue)

  if (!savedState) {
    await db.appStates.add({
      key,
      value: defaultValue,
    })
  }

  async function set(value: T) {
    await db.appStates.put({ key, value })
    state.value = value
  }

  return {
    state: readonly(state),
    set,
  }
}

export const [locale, theme] = await Promise.all([
  createAppState<'pl-PL' | 'en-GB'>('locale', 'pl-PL'), // TODO: Change to en-GB
  createAppState<'system' | 'light' | 'dark'>('theme', 'system'),
])
