<template>
  <div class="settings">
    <div class="container">
      <div class="page-header">
        <h1>Settings</h1>
        <p>Customize your music player experience</p>
      </div>
      
      <div class="settings-container">
        <div class="setting-group">
          <h2>Playback</h2>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-title">Crossfade between songs</span>
              <span class="setting-description">Smoothly transition between tracks</span>
            </div>
            <div class="setting-control">
              <label class="toggle" for="crossfade-toggle">
                <input type="checkbox" id="crossfade-toggle" v-model="settings.crossfade" />
                <span class="toggle-slider"></span>
                <span class="sr-only">Enable crossfade between songs</span>
              </label>
            </div>
          </div>
          
          <div class="setting-item" :class="{ 'disabled': !settings.crossfade }">
            <div class="setting-label">
              <span class="setting-title">Crossfade duration</span>
              <span class="setting-description">How long the transition should take</span>
            </div>
            <div class="setting-control">
              <select v-model="settings.crossfadeDuration" :disabled="!settings.crossfade" class="select-control">
                <option value="1">1 second</option>
                <option value="3">3 seconds</option>
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
              </select>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-title">Audio quality</span>
              <span class="setting-description">Higher quality uses more data</span>
            </div>
            <div class="setting-control">
              <select v-model="settings.audioQuality" class="select-control">
                <option value="low">Normal (128kbps)</option>
                <option value="medium">High (256kbps)</option>
                <option value="high">Very High (320kbps)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="setting-group">
          <h2>Theme</h2>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-title">Dark Mode</span>
              <span class="setting-description">Always use dark theme</span>
            </div>
            <div class="setting-control">
              <label class="toggle" for="dark-mode-toggle">
                <input type="checkbox" id="dark-mode-toggle" v-model="settings.darkMode" />
                <span class="toggle-slider"></span>
                <span class="sr-only">Enable dark mode</span>
              </label>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-title">Accent Color</span>
              <span class="setting-description">Choose your preferred highlight color</span>
            </div>
            <div class="setting-control">
              <div class="color-options">
                <label 
                  v-for="color in accentColors" 
                  :key="color.value"
                  class="color-option"
                  :class="{ 'active': settings.accentColor === color.value }"
                >
                  <input 
                    type="radio" 
                    :value="color.value" 
                    v-model="settings.accentColor"
                    class="sr-only"
                  />
                  <span 
                    class="color-swatch" 
                    :style="{ backgroundColor: color.hex }"
                    :title="color.label"
                  ></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div class="setting-group">
          <h2>Services</h2>
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-title">Default Music Service</span>
              <span class="setting-description">Choose your preferred streaming service</span>
            </div>
            <div class="setting-control">
              <select v-model="settings.defaultService" class="select-control">
                <option value="spotify">Spotify</option>
                <option value="apple">Apple Music</option>
                <option value="youtube">YouTube Music</option>
              </select>
            </div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">
              <span class="setting-title">Connect Account</span>
              <span class="setting-description">Link your streaming service account</span>
            </div>
            <div class="setting-control">
              <button class="btn secondary">Connect</button>
            </div>
          </div>
        </div>
        
        <div class="actions">
          <button @click="saveSettings" class="btn primary">Save Settings</button>
          <button @click="resetSettings" class="btn secondary">Reset to Default</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()

const accentColors = [
  { value: 'purple', label: 'Purple', hex: '#9c27b0' },
  { value: 'pink', label: 'Pink', hex: '#e91e63' },
  { value: 'red', label: 'Red', hex: '#f44336' },
  { value: 'orange', label: 'Orange', hex: '#ff9800' },
  { value: 'green', label: 'Green', hex: '#4caf50' },
  { value: 'blue', label: 'Blue', hex: '#2196f3' },
]

const settings = ref({
  crossfade: settingsStore.crossfade,
  crossfadeDuration: settingsStore.crossfadeDuration,
  darkMode: settingsStore.darkMode,
  accentColor: settingsStore.accentColor,
  defaultService: settingsStore.defaultService,
  audioQuality: settingsStore.audioQuality || 'medium'
})

const saveSettings = () => {
  settingsStore.updateSettings(settings.value)
  // Use a more modern notification instead of alert
  const notification = document.createElement('div')
  notification.className = 'save-notification'
  notification.textContent = 'Settings saved successfully!'
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.classList.add('show')
    
    setTimeout(() => {
      notification.classList.remove('show')
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 2000)
  }, 10)
}

const resetSettings = () => {
  settingsStore.resetSettings()
  settings.value = {
    crossfade: settingsStore.crossfade,
    crossfadeDuration: settingsStore.crossfadeDuration,
    darkMode: settingsStore.darkMode,
    accentColor: settingsStore.accentColor,
    defaultService: settingsStore.defaultService,
    audioQuality: settingsStore.audioQuality || 'medium'
  }
}
</script>

<style lang="less" scoped>
.settings {
  padding: 40px 0;
  
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .page-header {
    margin-bottom: 40px;
    
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 10px;
    }
    
    p {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.7);
    }
  }
  
  &-container {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 30px;
  }
  
  .setting-group {
    margin-bottom: 40px;
    
    h2 {
      font-size: 1.4rem;
      font-weight: 600;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    
    &:last-child {
      border-bottom: none;
    }
    
    &.disabled {
      opacity: 0.5;
    }
    
    .setting-label {
      flex: 1;
      
      .setting-title {
        display: block;
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 4px;
      }
      
      .setting-description {
        display: block;
        font-size: 0.85rem;
        color: rgba(255, 255, 255, 0.5);
      }
    }
    
    .setting-control {
      margin-left: 20px;
      
      .select-control {
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 10px 16px;
        border-radius: 6px;
        min-width: 180px;
        appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 16px;
        
        &:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        option {
          background-color: #1a1a1a;
        }
      }
      
      // Toggle switch styling
      .toggle {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 26px;
        
        input {
          opacity: 0;
          width: 0;
          height: 0;
          
          &:checked + .toggle-slider {
            background: linear-gradient(90deg, #ff8a00, #e52e71);
          }
          
          &:checked + .toggle-slider:before {
            transform: translateX(24px);
          }
        }
        
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.2);
          transition: .3s;
          border-radius: 34px;
          
          &:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .3s;
            border-radius: 50%;
          }
        }
      }
      
      // Color options
      .color-options {
        display: flex;
        gap: 10px;
        
        .color-option {
          cursor: pointer;
          
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
          
          .color-swatch {
            display: block;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            border: 2px solid transparent;
          }
          
          &.active .color-swatch {
            transform: scale(1.1);
            border-color: white;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
          }
        }
      }
    }
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 30px;
    
    .btn {
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &.primary {
        background: linear-gradient(90deg, #ff8a00, #e52e71);
        color: white;
        border: none;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(229, 46, 113, 0.3);
        }
      }
      
      &.secondary {
        background: transparent;
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.3);
        
        &:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
}

// Notification styling
:global(.save-notification) {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  z-index: 1000;
  
  &.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}
</style>
