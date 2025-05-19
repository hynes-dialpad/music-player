import { defineStore } from 'pinia'
import spotifyService from '../services/spotify'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentTrack: null,
    queue: [],
    isPlaying: false,
    volume: 80,
    repeat: false,
    shuffle: false,
    currentPlaylist: null,
    loading: false,
    error: null
  }),
  
  getters: {
    currentTrackInfo: (state) => state.currentTrack,
    isCurrentlyPlaying: (state) => state.isPlaying,
    currentVolume: (state) => state.volume,
    hasNext: (state) => state.queue.length > 0,
    hasPrevious: (state) => state.playHistory.length > 0
  },
  
  actions: {
    async loadPlaylist(playlistId) {
      this.loading = true;
      this.error = null;
      
      try {
        const playlist = await spotifyService.getPlaylistById(playlistId);
        if (playlist) {
          this.currentPlaylist = playlist;
          this.queue = [...playlist.tracks];
          
          if (this.queue.length > 0 && !this.currentTrack) {
            this.currentTrack = this.queue.shift();
          }
        }
      } catch (err) {
        this.error = 'Failed to load playlist: ' + err.message;
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    
    async playTrack(track) {
      this.loading = true;
      
      try {
        await spotifyService.playTrack(track.id);
        this.currentTrack = track;
        this.isPlaying = true;
      } catch (err) {
        this.error = 'Failed to play track: ' + err.message;
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    
    async togglePlay() {
      if (!this.currentTrack) return;
      
      try {
        if (this.isPlaying) {
          await spotifyService.pausePlayback();
        } else {
          await spotifyService.resumePlayback();
        }
        
        this.isPlaying = !this.isPlaying;
      } catch (err) {
        this.error = 'Playback control failed: ' + err.message;
        console.error(err);
      }
    },
    
    async nextTrack() {
      if (this.queue.length === 0) return;
      
      try {
        const nextTrack = this.queue.shift();
        await this.playTrack(nextTrack);
        await spotifyService.nextTrack();
      } catch (err) {
        this.error = 'Failed to play next track: ' + err.message;
        console.error(err);
      }
    },
    
    async previousTrack() {
      try {
        await spotifyService.previousTrack();
        // In a real implementation, we would get the previous track from history
        // For now, we'll just toggle play state as a placeholder
        this.isPlaying = true;
      } catch (err) {
        this.error = 'Failed to play previous track: ' + err.message;
        console.error(err);
      }
    },
    
    async setVolume(volumeLevel) {
      try {
        await spotifyService.setVolume(volumeLevel);
        this.volume = volumeLevel;
      } catch (err) {
        this.error = 'Failed to set volume: ' + err.message;
        console.error(err);
      }
    },
    
    toggleRepeat() {
      this.repeat = !this.repeat;
    },
    
    toggleShuffle() {
      this.shuffle = !this.shuffle;
      
      if (this.shuffle && this.queue.length > 1) {
        // Simple shuffle algorithm
        for (let i = this.queue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
        }
      }
    },
    
    async search(query) {
      this.loading = true;
      this.error = null;
      
      try {
        return await spotifyService.search(query);
      } catch (err) {
        this.error = 'Search failed: ' + err.message;
        console.error(err);
        return { tracks: [], artists: [], albums: [] };
      } finally {
        this.loading = false;
      }
    }
  },
  
  persist: {
    paths: ['volume', 'repeat', 'shuffle'],
  }
});
