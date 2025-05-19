// Audio Library Service
// This service manages the local audio tracks available in the application

// Collection of available audio tracks
const audioTracks = [
  {
    id: 'track1',
    title: 'Acoustic Guitar',
    artist: 'SoundHelix',
    album: 'Sample Tracks',
    duration: 238, // 3:58
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    audioUrl: '/audio/sample-audio.mp3'
  },
  {
    id: 'track2',
    title: 'Electronic Beat',
    artist: 'SoundHelix',
    album: 'Electronic Collection',
    duration: 247, // 4:07
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    audioUrl: '/audio/electronic-beat.mp3'
  },
  {
    id: 'track3',
    title: 'Ambient Melody',
    artist: 'SoundHelix',
    album: 'Ambient Collection',
    duration: 285, // 4:45
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    audioUrl: '/audio/ambient-melody.mp3'
  },
  {
    id: 'track4',
    title: 'Dance Track',
    artist: 'SoundHelix',
    album: 'Dance Collection',
    duration: 226, // 3:46
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    audioUrl: '/audio/dance-track.mp3'
  },
  {
    id: 'track5',
    title: 'Jazz Loop',
    artist: 'SoundHelix',
    album: 'Jazz Collection',
    duration: 250, // 4:10
    imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    audioUrl: '/audio/jazz-loop.mp3'
  },
  {
    id: 'track6',
    title: 'Piano Melody',
    artist: 'SoundHelix',
    album: 'Piano Collection',
    duration: 198, // 3:18
    imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    audioUrl: '/audio/piano-melody.mp3'
  },
  {
    id: 'track7',
    title: 'Techno Beat',
    artist: 'SoundHelix',
    album: 'Techno Collection',
    duration: 274, // 4:34
    imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    audioUrl: '/audio/techno-beat.mp3'
  },
  {
    id: 'track8',
    title: 'Rock Rhythm',
    artist: 'SoundHelix',
    album: 'Rock Collection',
    duration: 230, // 3:50
    imageUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    audioUrl: '/audio/rock-rhythm.mp3'
  },
  {
    id: 'track9',
    title: 'Chill Vibes',
    artist: 'SoundHelix',
    album: 'Chill Collection',
    duration: 265, // 4:25
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    audioUrl: '/audio/chill-vibes.mp3'
  },
  {
    id: 'track10',
    title: 'Acoustic Sunset',
    artist: 'SoundHelix',
    album: 'Acoustic Collection',
    duration: 240, // 4:00
    imageUrl: 'https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    audioUrl: '/audio/sample-audio.mp3'
  },
  {
    id: 'track11',
    title: 'Electronic Dreams',
    artist: 'SoundHelix',
    album: 'Electronic Collection Vol. 2',
    duration: 310, // 5:10
    imageUrl: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    audioUrl: '/audio/electronic-beat.mp3'
  }
];

export default {
  // Get all available audio tracks
  getAllTracks() {
    return audioTracks;
  },
  
  // Get a specific track by ID
  getTrackById(id) {
    return audioTracks.find(track => track.id === id) || null;
  },
  
  // Search tracks by title or artist
  searchTracks(query) {
    if (!query) return [];
    
    const lowerQuery = query.toLowerCase();
    return audioTracks.filter(track => 
      track.title.toLowerCase().includes(lowerQuery) || 
      track.artist.toLowerCase().includes(lowerQuery)
    );
  }
};
