<template>
  <div class="home">
    <div class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>Your music, <span class="highlight">reimagined</span></h1>
          <p>A sleek, modern music player built with Vue.js and Vite</p>
          <div class="actions">
            <button @click="navigateToPlayer" class="btn primary">Start Listening</button>
            <button @click="navigateToSettings" class="btn secondary">Customize</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="featured-section">
      <div class="container">
        <h2>Featured Playlists</h2>
        <div class="playlist-grid">
          <div 
            v-for="playlist in featuredPlaylists" 
            :key="playlist.id" 
            class="playlist-card"
            @click="selectPlaylist(playlist.id)"
          >
            <div class="playlist-image">
              <img :src="playlist.imageUrl" :alt="playlist.name" />
              <div class="play-overlay">
                <span class="play-icon">▶</span>
              </div>
            </div>
            <div class="playlist-info">
              <h3>{{ playlist.name }}</h3>
              <p>{{ playlist.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import spotifyService from '../services/spotify'
import { usePlayerStore } from '../stores/player'

const router = useRouter()
const playerStore = usePlayerStore()

const featuredPlaylists = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    // Load playlists from mock Spotify service
    featuredPlaylists.value = await spotifyService.getPlaylists()
  } catch (error) {
    console.error('Failed to load playlists:', error)
  } finally {
    isLoading.value = false
  }
})

const navigateToPlayer = () => {
  router.push('/player')
}

const navigateToSettings = () => {
  router.push('/settings')
}

const selectPlaylist = async (playlistId) => {
  await playerStore.loadPlaylist(playlistId)
  router.push('/player')
}
</script>

<style lang="less" scoped>
.home {
  .hero {
    padding: 80px 0;
    background: linear-gradient(135deg, #1a0a0d 0%, #680520 100%);
    text-align: center;
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      
      h1 {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        line-height: 1.2;
        
        .highlight {
          background: linear-gradient(90deg, #ff8a00, #e52e71);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
      
      p {
        font-size: 1.5rem;
        margin-bottom: 2.5rem;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 300;
      }
    }
    
    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      
      .btn {
        padding: 14px 32px;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &.primary {
          background: linear-gradient(90deg, #ff8a00, #e52e71);
          color: white;
          border: none;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 7px 14px rgba(0, 0, 0, 0.2);
          }
        }
        
        &.secondary {
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.5);
          
          &:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: white;
          }
        }
      }
    }
  }
  
  .featured-section {
    padding: 60px 0;
    
    h2 {
      font-size: 1.8rem;
      margin-bottom: 30px;
      font-weight: 600;
    }
    
    .playlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 24px;
      
      .playlist-card {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
        
        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          
          .play-overlay {
            opacity: 1;
          }
        }
        
        .playlist-image {
          position: relative;
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
        
        .playlist-info {
          padding: 16px;
          
          h3 {
            font-size: 1.1rem;
            margin-bottom: 8px;
            font-weight: 600;
          }
          
          p {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.7);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }
  }
  
  // Responsive adjustments
  @media (max-width: 768px) {
    .hero {
      padding: 60px 0;
      
      .hero-content {
        h1 {
          font-size: 2.5rem;
        }
        
        p {
          font-size: 1.2rem;
        }
      }
    }
    
    .featured-section {
      .playlist-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      }
    }
  }
}
</style>
