// Mock Spotify Service
// This is a placeholder for real Spotify API integration

// Mock data for demonstration
const mockPlaylists = [
  {
    id: 'playlist1',
    name: 'Top Hits',
    description: 'The hottest tracks right now',
    imageUrl: 'https://via.placeholder.com/300?text=Top+Hits',
    tracks: [
      { id: 'track1', title: 'Summer Vibes', artist: 'DJ Sunshine', album: 'Summer Collection', duration: 215, imageUrl: 'https://via.placeholder.com/300?text=Summer+Vibes' },
      { id: 'track2', title: 'Midnight Dreams', artist: 'Luna', album: 'Nocturnal', duration: 187, imageUrl: 'https://via.placeholder.com/300?text=Midnight+Dreams' },
      { id: 'track3', title: 'Mountain High', artist: 'The Climbers', album: 'Elevation', duration: 243, imageUrl: 'https://via.placeholder.com/300?text=Mountain+High' },
    ]
  },
  {
    id: 'playlist2',
    name: 'Chill Lounge',
    description: 'Relaxing beats to unwind',
    imageUrl: 'https://via.placeholder.com/300?text=Chill+Lounge',
    tracks: [
      { id: 'track4', title: 'Ocean Waves', artist: 'Aqua', album: 'Deep Blue', duration: 302, imageUrl: 'https://via.placeholder.com/300?text=Ocean+Waves' },
      { id: 'track5', title: 'Forest Whispers', artist: 'Nature Sounds', album: 'Wilderness', duration: 264, imageUrl: 'https://via.placeholder.com/300?text=Forest+Whispers' },
      { id: 'track6', title: 'Rainy Day', artist: 'Cloud Nine', album: 'Weather Patterns', duration: 198, imageUrl: 'https://via.placeholder.com/300?text=Rainy+Day' },
    ]
  }
];

// Mock user library
const mockUserLibrary = {
  recentlyPlayed: [
    { id: 'track7', title: 'City Lights', artist: 'Urban Beats', album: 'Metropolis', duration: 221, imageUrl: 'https://via.placeholder.com/300?text=City+Lights' },
    { id: 'track8', title: 'Desert Wind', artist: 'Nomad', album: 'Journeys', duration: 275, imageUrl: 'https://via.placeholder.com/300?text=Desert+Wind' },
  ],
  savedTracks: [
    { id: 'track9', title: 'Starlight', artist: 'Cosmic', album: 'Galaxy', duration: 234, imageUrl: 'https://via.placeholder.com/300?text=Starlight' },
    { id: 'track10', title: 'Mountain Stream', artist: 'Nature Sounds', album: 'Wilderness', duration: 312, imageUrl: 'https://via.placeholder.com/300?text=Mountain+Stream' },
  ]
};

// Simulated delay to mimic API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Service methods
export default {
  // Authentication (mock)
  async login() {
    await delay(800);
    return { success: true, message: 'Mock authentication successful' };
  },
  
  async logout() {
    await delay(500);
    return { success: true, message: 'Mock logout successful' };
  },
  
  // Playlists
  async getPlaylists() {
    await delay(1000);
    return mockPlaylists;
  },
  
  async getPlaylistById(id) {
    await delay(800);
    return mockPlaylists.find(playlist => playlist.id === id) || null;
  },
  
  // Tracks
  async getRecentlyPlayed() {
    await delay(700);
    return mockUserLibrary.recentlyPlayed;
  },
  
  async getSavedTracks() {
    await delay(900);
    return mockUserLibrary.savedTracks;
  },
  
  // Playback controls (mock implementations)
  async playTrack(trackId) {
    await delay(300);
    console.log(`Playing track: ${trackId}`);
    return { success: true };
  },
  
  async pausePlayback() {
    await delay(200);
    console.log('Pausing playback');
    return { success: true };
  },
  
  async resumePlayback() {
    await delay(200);
    console.log('Resuming playback');
    return { success: true };
  },
  
  async nextTrack() {
    await delay(300);
    console.log('Skipping to next track');
    return { success: true };
  },
  
  async previousTrack() {
    await delay(300);
    console.log('Going back to previous track');
    return { success: true };
  },
  
  async setVolume(volumePercent) {
    await delay(100);
    console.log(`Setting volume to ${volumePercent}%`);
    return { success: true };
  },
  
  // Search (mock)
  async search(query, types = ['track', 'artist', 'album']) {
    await delay(1200);
    // Simple mock search that returns tracks with matching title or artist
    const results = {
      tracks: [],
      artists: [],
      albums: []
    };
    
    const allTracks = [
      ...mockPlaylists.flatMap(playlist => playlist.tracks),
      ...mockUserLibrary.recentlyPlayed,
      ...mockUserLibrary.savedTracks
    ];
    
    // Deduplicate tracks by ID
    const uniqueTracks = Array.from(new Map(allTracks.map(track => [track.id, track])).values());
    
    if (types.includes('track')) {
      results.tracks = uniqueTracks.filter(track => 
        track.title.toLowerCase().includes(query.toLowerCase()) || 
        track.artist.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (types.includes('artist')) {
      // Extract unique artists
      const artists = [...new Set(uniqueTracks.map(track => track.artist))];
      results.artists = artists
        .filter(artist => artist.toLowerCase().includes(query.toLowerCase()))
        .map(artist => ({ name: artist, id: artist.replace(/\s+/g, '').toLowerCase() }));
    }
    
    if (types.includes('album')) {
      // Extract unique albums
      const albums = [...new Set(uniqueTracks.map(track => track.album))];
      results.albums = albums
        .filter(album => album.toLowerCase().includes(query.toLowerCase()))
        .map(album => ({ name: album, id: album.replace(/\s+/g, '').toLowerCase() }));
    }
    
    return results;
  }
};
