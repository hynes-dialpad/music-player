<template>
  <div class="player">
    <div class="player-container">
      <div class="now-playing-card">
        <div class="album-art">
          <img src="https://via.placeholder.com/300" alt="Album Art" />
          <div class="overlay-controls">
            <button class="control-btn previous"><span>⏮</span></button>
            <button class="control-btn play"><span>{{ isPlaying ? '⏸' : '▶' }}</span></button>
            <button class="control-btn next"><span>⏭</span></button>
          </div>
        </div>
        <div class="track-info">
          <div class="song-title">Enemy (From the series "Arcane League")</div>
          <div class="artist">Imagine Dragons, JID, & League of Legends</div>
          <div class="progress">
            <div class="progress-bar">
              <div class="progress-current" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            <div class="time">
              <span class="current-time">{{ formatTime(currentTime) }}</span>
              <span class="total-time">{{ formatTime(totalDuration) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePlayerStore } from '../stores/player'

const playerStore = usePlayerStore()

// Player state
const isPlaying = ref(false)
const currentTime = ref(61) // 1:01 in seconds
const totalDuration = ref(369) // 6:09 in seconds

// Computed properties
const progressPercentage = computed(() => {
  return (currentTime.value / totalDuration.value) * 100
})

// Methods
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  playerStore.togglePlay()
}

const previousTrack = () => {
  playerStore.previousTrack()
}

const nextTrack = () => {
  playerStore.nextTrack()
}

// Simulate playback progress
let interval
onMounted(() => {
  // For demo purposes only
  document.querySelector('.control-btn.play').addEventListener('click', togglePlay)
  document.querySelector('.control-btn.previous').addEventListener('click', previousTrack)
  document.querySelector('.control-btn.next').addEventListener('click', nextTrack)
})
</script>

<style lang="less" scoped>
.player {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
  background-color: #121212;
  padding: 20px;
  
  &-container {
    width: 100%;
    max-width: 720px;
    margin: auto;
  }
  
  .now-playing-card {
    display: flex;
    flex-direction: row;
    background: linear-gradient(to right, #680520, #1a0a0d);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    height: 180px;
    
    .album-art {
      position: relative;
      width: 180px;
      height: 180px;
      flex-shrink: 0;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .overlay-controls {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        
        .control-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.8rem;
          margin: 0 12px;
          cursor: pointer;
          transition: transform 0.2s ease;
          
          &:hover {
            transform: scale(1.2);
          }
          
          &.play {
            font-size: 2.5rem;
          }
        }
      }
      
      &:hover .overlay-controls {
        opacity: 1;
      }
    }
    
    .track-info {
      flex: 1;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: white;
      
      .song-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .artist {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .progress {
        width: 100%;
        margin-top: auto;
        
        &-bar {
          width: 100%;
          height: 4px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          margin-bottom: 8px;
          overflow: hidden;
          
          .progress-current {
            height: 100%;
            background-color: white;
            border-radius: 2px;
          }
        }
        
        .time {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
}
</style>
