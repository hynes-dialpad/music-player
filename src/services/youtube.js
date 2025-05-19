// YouTube Service
// This is a mock service for handling YouTube URLs and extracting metadata

// Helper function to extract video ID from YouTube URL
const extractVideoId = (url) => {
  // Handle different YouTube URL formats
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

// Mock function to simulate fetching video metadata
const fetchVideoMetadata = async (videoId) => {
  // In a real implementation, this would call the YouTube API
  // For now, we'll simulate a delay and return mock data
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock database of video information
  const videoDatabase = {
    'dQw4w9WgXcQ': {
      title: 'Never Gonna Give You Up',
      artist: 'Rick Astley',
      album: 'Whenever You Need Somebody',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: 213 // 3:33
    },
    'fJ9rUzIMcZQ': {
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      thumbnailUrl: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
      duration: 367 // 6:07
    },
    'JGwWNGJdvx8': {
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      thumbnailUrl: 'https://img.youtube.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
      duration: 234 // 3:54
    },
    'kJQP7kiw5Fk': {
      title: 'Despacito',
      artist: 'Luis Fonsi ft. Daddy Yankee',
      album: 'Vida',
      thumbnailUrl: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      duration: 282 // 4:42
    },
    'hT_nvWreIhg': {
      title: 'Counting Stars',
      artist: 'OneRepublic',
      album: 'Native',
      thumbnailUrl: 'https://img.youtube.com/vi/hT_nvWreIhg/maxresdefault.jpg',
      duration: 257 // 4:17
    }
  };
  
  // Return metadata if found, otherwise generate generic metadata
  if (videoDatabase[videoId]) {
    return {
      ...videoDatabase[videoId],
      videoId
    };
  } else {
    // Generate generic metadata for unknown videos
    return {
      title: 'YouTube Video',
      artist: 'Unknown Artist',
      album: 'YouTube',
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: 180, // 3:00 default duration
      videoId
    };
  }
};

export default {
  // Process a YouTube URL and return metadata
  async processYouTubeUrl(url) {
    try {
      const videoId = extractVideoId(url);
      
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }
      
      const metadata = await fetchVideoMetadata(videoId);
      return {
        success: true,
        data: metadata
      };
    } catch (error) {
      console.error('Error processing YouTube URL:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },
  
  // Get embed URL for a video ID
  getEmbedUrl(videoId) {
    // Parameters explanation:
    // - autoplay=1: Automatically start playing
    // - controls=1: Show video controls
    // - enablejsapi=1: Enable JavaScript API
    // - origin: Security parameter
    // - mute=0: Ensure audio is not muted (important for autoplay to work with sound)
    // - playsinline=1: Play inline on mobile devices
    // - fs=1: Allow fullscreen
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}&mute=0&playsinline=1&fs=1`;
  },
  
  // Check if a URL is a valid YouTube URL
  isValidYouTubeUrl(url) {
    const videoId = extractVideoId(url);
    return videoId !== null;
  }
};
