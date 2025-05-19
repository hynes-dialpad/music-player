import { defineStore } from 'pinia'
import spotifyService from '../services/spotify'
import youtubeService from '../services/youtube'
import audioLibrary from '../services/audioLibrary'

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
    error: null,
    source: 'local', // 'spotify', 'youtube', or 'local'
    youtubeVideoId: null
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
      this.source = 'spotify';
      this.youtubeVideoId = null;
      
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
    
    // Load a local audio track
    loadLocalTrack(trackId) {
      this.loading = true;
      this.error = null;
      
      try {
        const track = audioLibrary.getTrackById(trackId);
        
        if (!track) {
          throw new Error('Track not found');
        }
        
        this.currentTrack = track;
        this.source = 'local';
        this.youtubeVideoId = null;
        this.isPlaying = true;
        
        // Clear the queue since we're playing a single track
        this.queue = [];
        this.currentPlaylist = null;
        
        return true;
      } catch (err) {
        this.error = 'Failed to load track: ' + err.message;
        console.error(err);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // Load all local tracks
    loadLocalTracks() {
      this.loading = true;
      this.error = null;
      
      try {
        const tracks = audioLibrary.getAllTracks();
        
        if (tracks.length === 0) {
          throw new Error('No tracks found');
        }
        
        this.currentPlaylist = {
          id: 'local-tracks',
          name: 'Local Tracks',
          description: 'All available local audio tracks',
          tracks: [...tracks]
        };
        
        this.queue = [...tracks.slice(1)]; // All tracks except the first one
        this.currentTrack = tracks[0]; // Set the first track as current
        this.source = 'local';
        this.youtubeVideoId = null;
        
        return true;
      } catch (err) {
        this.error = 'Failed to load tracks: ' + err.message;
        console.error(err);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async loadYoutubeVideo(url) {
      this.loading = true;
      this.error = null;
      
      try {
        const result = await youtubeService.processYouTubeUrl(url);
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to process YouTube URL');
        }
        
        const videoData = result.data;
        
        // Create a track object from YouTube data
        const track = {
          id: 'yt-' + videoData.videoId,
          title: videoData.title,
          artist: videoData.artist,
          album: videoData.album,
          duration: videoData.duration,
          imageUrl: videoData.thumbnailUrl
        };
        
        this.currentTrack = track;
        this.source = 'youtube';
        this.youtubeVideoId = videoData.videoId;
        this.isPlaying = true;
        
        // Clear the queue since we're playing a single YouTube video
        this.queue = [];
        this.currentPlaylist = null;
        
        return true;
      } catch (err) {
        this.error = 'Failed to load YouTube video: ' + err.message;
        console.error(err);
        return false;
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
