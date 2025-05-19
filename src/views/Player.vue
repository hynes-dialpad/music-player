<template>
  <div class="player">
    <div class="player-container">
      <!-- Audio player component (always visible) -->
      <AudioPlayer 
        v-if="playerStore.currentTrack"
        :audioUrl="playerStore.currentTrack.audioUrl" 
        :isPlaying="isPlaying"
        @timeupdate="updateCurrentTime"
        @durationchange="updateDuration"
        @ended="handleTrackEnded"
        @error="handleAudioError"
        @ready="handleAudioReady"
        ref="audioPlayerRef"
      />
      
      <!-- Music player card -->
      <div class="now-playing-card">
        <div class="album-art">
          <img :src="currentTrackImage" :alt="currentTrackTitle + ' album art'" />
          <div class="overlay-controls">
            <button class="control-btn previous" @click="previousTrack"><span>⏮</span></button>
            <button class="control-btn play" @click="togglePlay"><span>{{ isPlaying ? '⏸' : '▶' }}</span></button>
            <button class="control-btn next" @click="nextTrack"><span>⏭</span></button>
          </div>
        </div>
        <div class="track-info">
          <div class="song-title">{{ currentTrackTitle }}</div>
          <div class="artist">{{ currentTrackArtist }}</div>
          <div class="album">{{ currentTrackAlbum }}</div>
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
      
      <!-- Track selection form -->
      <div class="track-selection-form">
        <h3>Music Library</h3>
        <div class="form-content">
          <div class="library-filters">
            <div class="filter-group">
              <label for="filter-input">Search:</label>
              <input 
                type="text" 
                id="filter-input"
                v-model="searchQuery" 
                placeholder="Search by title or artist"
                @input="filterTracks"
              />
            </div>
            <div class="filter-group">
              <label for="sort-select">Sort by:</label>
              <select id="sort-select" v-model="sortBy" @change="sortTracks">
                <option value="title">Title</option>
                <option value="artist">Artist</option>
                <option value="album">Album</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>
          
          <div class="track-list">
            <div 
              v-for="track in filteredTracks" 
              :key="track.id"
              class="track-item"
              :class="{ 'active': playerStore.currentTrack && playerStore.currentTrack.id === track.id }"
              @click="loadTrack(track.id)"
            >
              <div class="track-image">
                <img :src="track.imageUrl" :alt="track.title" />
                <div class="play-overlay">
                  <span class="play-icon">▶</span>
                </div>
              </div>
              <div class="track-details">
                <div class="track-title">{{ track.title }}</div>
                <div class="track-artist">{{ track.artist }}</div>
                <div class="track-album">{{ track.album }}</div>
                <div class="track-duration">{{ formatTime(track.duration) }}</div>
              </div>
            </div>
          </div>
          
          <div v-if="filteredTracks.length === 0" class="no-results">
            No tracks found matching "{{ searchQuery }}"
          </div>
          
          <div v-if="audioError" class="error-message">{{ audioError }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePlayerStore } from '../stores/player'
import AudioPlayer from '../components/AudioPlayer.vue'
import audioLibrary from '../services/audioLibrary'

const playerStore = usePlayerStore()

// Player state
const isPlaying = ref(false)
const currentTime = ref(0)
const totalDuration = ref(0)
const isLoading = ref(false)
const audioError = ref('')
const audioPlayerRef = ref(null)
const availableTracks = ref([])
const filteredTracks = ref([])
const searchQuery = ref('')
const sortBy = ref('title')

// Computed properties
const progressPercentage = computed(() => {
  return (currentTime.value / totalDuration.value) * 100
})

const currentTrackTitle = computed(() => {
  if (playerStore.currentTrack) {
    return playerStore.currentTrack.title
  }
  return 'Enemy (From the series "Arcane League")' // Default title
})

const currentTrackArtist = computed(() => {
  if (playerStore.currentTrack) {
    return playerStore.currentTrack.artist
  }
  return 'Imagine Dragons, JID, & League of Legends' // Default artist
})

const currentTrackAlbum = computed(() => {
  if (playerStore.currentTrack) {
    return playerStore.currentTrack.album
  }
  return 'Arcane League of Legends' // Default album
})

const currentTrackImage = computed(() => {
  if (playerStore.currentTrack && playerStore.currentTrack.imageUrl) {
    return playerStore.currentTrack.imageUrl
  }
  return 'https://via.placeholder.com/300' // Default image
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

// Load a specific track by ID
const loadTrack = async (trackId) => {
  isLoading.value = true
  audioError.value = ''
  
  try {
    const success = await playerStore.loadLocalTrack(trackId)
    
    if (success) {
      // Update player state
      isPlaying.value = true
      currentTime.value = 0
    } else {
      audioError.value = playerStore.error || 'Failed to load track'
    }
  } catch (error) {
    console.error('Error loading track:', error)
    audioError.value = 'An error occurred while loading the track'
  } finally {
    isLoading.value = false
  }
}

// Load all available tracks
const loadAllTracks = async () => {
  isLoading.value = true
  audioError.value = ''
  
  try {
    // Get all tracks from the audio library
    availableTracks.value = audioLibrary.getAllTracks()
    filteredTracks.value = [...availableTracks.value] // Initialize filtered tracks
    sortTracks() // Apply initial sorting
    
    // Load the first track if none is currently playing
    if (!playerStore.currentTrack && filteredTracks.value.length > 0) {
      await playerStore.loadLocalTrack(filteredTracks.value[0].id)
      isPlaying.value = true
    }
  } catch (error) {
    console.error('Error loading tracks:', error)
    audioError.value = 'An error occurred while loading tracks'
  } finally {
    isLoading.value = false
  }
}

// Filter tracks based on search query
const filterTracks = () => {
  if (!searchQuery.value.trim()) {
    filteredTracks.value = [...availableTracks.value]
  } else {
    const query = searchQuery.value.toLowerCase()
    filteredTracks.value = availableTracks.value.filter(track => 
      track.title.toLowerCase().includes(query) || 
      track.artist.toLowerCase().includes(query) ||
      track.album.toLowerCase().includes(query)
    )
  }
  sortTracks() // Apply current sorting to filtered results
}

// Sort tracks based on selected sort criteria
const sortTracks = () => {
  filteredTracks.value.sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'artist':
        return a.artist.localeCompare(b.artist)
      case 'album':
        return a.album.localeCompare(b.album)
      case 'duration':
        return a.duration - b.duration
      default:
        return 0
    }
  })
}

// Audio player event handlers
const updateCurrentTime = (time) => {
  currentTime.value = time
}

const updateDuration = (duration) => {
  totalDuration.value = duration
}

const handleTrackEnded = () => {
  isPlaying.value = false
  playerStore.isPlaying = false
  currentTime.value = 0
  // Auto-play next track if available
  if (playerStore.hasNext) {
    nextTrack()
  }
}

const handleAudioError = (error) => {
  audioError.value = error
  console.error('Audio player error:', error)
}

const handleAudioReady = () => {
  audioError.value = ''
}

// Watch for changes in the player store
watch(() => playerStore.currentTrack, (newTrack) => {
  if (newTrack) {
    totalDuration.value = newTrack.duration || 0
    currentTime.value = 0
    isPlaying.value = playerStore.isPlaying
  }
})

watch(() => playerStore.isPlaying, (newValue) => {
  isPlaying.value = newValue
})

// Initialize the player when the component is mounted
onMounted(async () => {
  // Load all available tracks
  await loadAllTracks()
  
  // The AudioPlayer component will handle the actual audio playback
  // and emit events for time updates and duration changes
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
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  

  
  // Music player card
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
        margin-bottom: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .album {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.5);
        margin-bottom: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-style: italic;
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
  
  // Track selection form
  .track-selection-form {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 20px;
    width: 100%;
    margin-top: 30px;
    
    h3 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 16px;
      color: white;
      display: flex;
      align-items: center;
      
      &:before {
        content: '\1F3B5'; // Music note emoji
        margin-right: 8px;
        font-size: 1.4rem;
      }
    }
    
    .library-filters {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      
      .filter-group {
        display: flex;
        align-items: center;
        gap: 10px;
        
        label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          white-space: nowrap;
        }
        
        input, select {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          min-width: 200px;
          
          &:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.5);
          }
          
          &::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
        }
        
        select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 16px;
          padding-right: 30px;
          cursor: pointer;
        }
      }
    }
    
    .form-content {
      .track-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
        
        .track-item {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          
          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            
            .play-overlay {
              opacity: 1;
            }
          }
          
          &.active {
            border: 2px solid #ff8a00;
            box-shadow: 0 0 15px rgba(255, 138, 0, 0.5);
          }
          
          .track-image {
            position: relative;
            width: 100%;
            aspect-ratio: 1;
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            
            .play-overlay {
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
              
              .play-icon {
                font-size: 3rem;
                color: white;
              }
            }
          }
          
          .track-details {
            padding: 15px;
            
            .track-title {
              font-weight: 600;
              font-size: 1rem;
              margin-bottom: 5px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .track-artist {
              font-size: 0.85rem;
              color: rgba(255, 255, 255, 0.7);
              margin-bottom: 3px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            
            .track-album {
              font-size: 0.75rem;
              color: rgba(255, 255, 255, 0.5);
              margin-bottom: 3px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              font-style: italic;
            }
            
            .track-duration {
              font-size: 0.75rem;
              color: rgba(255, 255, 255, 0.5);
            }
          }
        }
      }
      
      .no-results {
        text-align: center;
        padding: 20px;
        color: rgba(255, 255, 255, 0.7);
        font-style: italic;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 6px;
        margin-bottom: 10px;
      }
      
      .error-message {
        color: #ff4d4d;
        font-size: 0.85rem;
        margin-bottom: 10px;
        padding: 10px;
        background-color: rgba(255, 77, 77, 0.1);
        border-radius: 6px;
      }
    }
  }
  
  // Responsive styles
  @media (max-width: 768px) {
    .now-playing-card {
      flex-direction: column;
      height: auto;
      
      .album-art {
        width: 100%;
        height: auto;
        aspect-ratio: 1;
      }
      
      .track-info {
        padding: 16px;
        
        .artist {
          margin-bottom: 16px;
        }
      }
    }
    
    .youtube-form {
      .library-filters {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
      
      .filter-group {
        display: flex;
        align-items: center;
        gap: 10px;
        
        label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          white-space: nowrap;
        }
        
        input, select {
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          min-width: 200px;
          
          &:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.5);
          }
          
          &::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
        }
        
        select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 16px;
          padding-right: 30px;
          cursor: pointer;
        }
      }
    }
    
    .form-content {
        .input-group {
          flex-direction: column;
          
          .submit-btn {
            width: 100%;
          }
        }
      }
    }
  }
}

// Utility class for screen reader only content
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
</style>
