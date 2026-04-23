import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { storage } from '@/utils/storage'

const STORAGE_KEY = 'settings'

export type ThemeType = 'light' | 'eye' | 'dark'

interface Settings {
  theme: ThemeType
  soundEnabled: boolean
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  soundEnabled: true
}

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref<ThemeType>('light')
  const soundEnabled = ref(true)

  function loadFromStorage() {
    const saved = storage.get<Settings>(STORAGE_KEY)
    if (saved) {
      theme.value = saved.theme || 'light'
      soundEnabled.value = saved.soundEnabled !== undefined ? saved.soundEnabled : true
    }
  }

  function saveToStorage() {
    storage.set(STORAGE_KEY, {
      theme: theme.value,
      soundEnabled: soundEnabled.value
    })
  }

  function setTheme(newTheme: ThemeType) {
    theme.value = newTheme
    applyTheme(newTheme)
    saveToStorage()
  }

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value
    saveToStorage()
  }

  function setSound(enabled: boolean) {
    soundEnabled.value = enabled
    saveToStorage()
  }

  function applyTheme(themeType: ThemeType) {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('theme-light', 'theme-eye', 'theme-dark')
      document.documentElement.classList.add(`theme-${themeType}`)
    }
  }

  function init() {
    loadFromStorage()
    applyTheme(theme.value)
  }

  return {
    theme,
    soundEnabled,
    setTheme,
    toggleSound,
    setSound,
    init
  }
})
