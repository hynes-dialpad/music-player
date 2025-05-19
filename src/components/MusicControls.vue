<template>
  <div class="music-controls">
    <div class="volume-control">
      <span class="volume-icon">🔊</span>
      <input 
        type="range" 
        min="0" 
        max="100" 
        v-model="volume" 
        @input="updateVolume"
        class="volume-slider"
      />
    </div>
    <div class="playback-controls">
      <button @click="previous" class="control-btn">
        <span>⏮️</span>
      </button>
      <button @click="togglePlay" class="control-btn play">
        <span>{{ isPlaying ? '⏸️' : '▶️' }}</span>
      </button>
      <button @click="next" class="control-btn">
        <span>⏭️</span>
      </button>
    </div>
    <div class="playback-options">
      <button @click="toggleRepeat" class="option-btn" :class="{ active: repeat }">
        <span>🔁</span>
      </button>
      <button @click="toggleShuffle" class="option-btn" :class="{ active: shuffle }">
        <span>🔀</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isPlaying = ref(false)
const volume = ref(80)
const repeat = ref(false)
const shuffle = ref(false)

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  // Emit event to parent component
  emit('playback-change', isPlaying.value)
}

const previous = () => {
  // Emit event to parent component
  emit('previous')
}

const next = () => {
  // Emit event to parent component
  emit('next')
}

const updateVolume = () => {
  // Emit event to parent component
  emit('volume-change', volume.value)
}

const toggleRepeat = () => {
  repeat.value = !repeat.value
  // Emit event to parent component
  emit('repeat-change', repeat.value)
}

const toggleShuffle = () => {
  shuffle.value = !shuffle.value
  // Emit event to parent component
  emit('shuffle-change', shuffle.value)
}

// Define emits
const emit = defineEmits([
  'playback-change', 
  'previous', 
  'next', 
  'volume-change', 
  'repeat-change', 
  'shuffle-change'
])
</script>

<style lang="less" scoped>
.music-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f5f5f5;
  
  .volume-control {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 10px;
    
    .volume-icon {
      font-size: 1.2rem;
    }
    
    .volume-slider {
      flex: 1;
      height: 5px;
      -webkit-appearance: none;
      background: #ddd;
      border-radius: 2px;
      outline: none;
      
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #42b983;
        cursor: pointer;
      }
    }
  }
  
  .playback-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    
    .control-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      transition: transform 0.2s ease;
      
      &:hover {
        transform: scale(1.1);
      }
      
      &.play {
        font-size: 2rem;
      }
    }
  }
  
  .playback-options {
    display: flex;
    gap: 15px;
    
    .option-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.2s ease;
      
      &:hover {
        opacity: 0.8;
      }
      
      &.active {
        opacity: 1;
        color: #42b983;
      }
    }
  }
}
</style>
