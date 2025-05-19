import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    crossfade: false,
    crossfadeDuration: 3,
    darkMode: true, // Default to dark mode since our UI is designed for it
    accentColor: 'pink',
    defaultService: 'spotify',
    audioQuality: 'medium'
  }),
  actions: {
    updateSettings(newSettings) {
      this.crossfade = newSettings.crossfade
      this.crossfadeDuration = newSettings.crossfadeDuration
      this.darkMode = newSettings.darkMode
      this.accentColor = newSettings.accentColor
      this.defaultService = newSettings.defaultService
    },
    resetSettings() {
      this.crossfade = false
      this.crossfadeDuration = 3
      this.darkMode = false
      this.accentColor = 'green'
      this.defaultService = 'spotify'
    }
  },
  persist: true
})
