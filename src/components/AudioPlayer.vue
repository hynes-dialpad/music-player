<template>
  <div class="audio-player">
    <audio 
      ref="audioPlayer"
      :src="audioSrc"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onMetadataLoaded"
      @ended="onEnded"
      @error="onError"
      @canplay="onCanPlay"
    ></audio>
    
    <div v-if="error" class="error-message">
      {{ error }}
      <a v-if="youtubeUrl" :href="youtubeUrl" target="_blank" rel="noopener noreferrer">Open on YouTube</a>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, defineProps, defineEmits } from 'vue';

const props = defineProps({
  // Either videoId or audioTrack should be provided
  videoId: {
    type: String,
    default: null
  },
  audioUrl: {
    type: String,
    default: null
  },
  isPlaying: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['timeupdate', 'durationchange', 'ended', 'error', 'ready']);

const audioPlayer = ref(null);
const audioSrc = ref('');
const error = ref('');
const youtubeUrl = ref('');

// For demonstration purposes, we'll use a mock audio file
// In a real implementation, you would use a service to extract audio from YouTube
const getMockAudioUrl = (videoId) => {
  // This is a mock implementation
  // In a real app, you would use a backend service to extract audio from YouTube
  const mockAudioFiles = {
    'dQw4w9WgXcQ': '/audio/never-gonna-give-you-up.mp3', // Rick Astley
    'fJ9rUzIMcZQ': '/audio/bohemian-rhapsody.mp3', // Queen
    'JGwWNGJdvx8': '/audio/shape-of-you.mp3', // Ed Sheeran
    'kJQP7kiw5Fk': '/audio/despacito.mp3', // Luis Fonsi
    'hT_nvWreIhg': '/audio/counting-stars.mp3', // OneRepublic
  };
  
  // For demo purposes, we'll use a sample audio file
  // In a real implementation, you would use a service to extract audio from YouTube
  return mockAudioFiles[videoId] || '/audio/sample-audio.mp3';
};

const onTimeUpdate = () => {
  if (audioPlayer.value) {
    emit('timeupdate', audioPlayer.value.currentTime);
  }
};

const onMetadataLoaded = () => {
  if (audioPlayer.value) {
    emit('durationchange', audioPlayer.value.duration);
  }
};

const onEnded = () => {
  emit('ended');
};

const onError = () => {
  error.value = 'Unable to play this audio. YouTube embedding may be restricted.';
  emit('error', error.value);
};

const onCanPlay = () => {
  error.value = '';
  emit('ready');
};

const play = () => {
  if (audioPlayer.value) {
    audioPlayer.value.play().catch(err => {
      console.error('Error playing audio:', err);
      error.value = 'Unable to play audio automatically. Please click play.';
    });
  }
};

const pause = () => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
  }
};

// Watch for changes in isPlaying prop
watch(() => props.isPlaying, (newValue) => {
  if (newValue) {
    play();
  } else {
    pause();
  }
});

// Watch for changes in source (either videoId or audioUrl)
watch([() => props.videoId, () => props.audioUrl], ([newVideoId, newAudioUrl]) => {
  if (newVideoId) {
    // YouTube mode
    audioSrc.value = getMockAudioUrl(newVideoId);
    youtubeUrl.value = `https://www.youtube.com/watch?v=${newVideoId}`;
  } else if (newAudioUrl) {
    // Direct audio URL mode
    audioSrc.value = newAudioUrl;
    youtubeUrl.value = '';
  }
  
  // If isPlaying is true, start playing the new audio
  if (props.isPlaying) {
    setTimeout(() => {
      play();
    }, 100);
  }
}, { immediate: true });

onMounted(() => {
  if (props.videoId) {
    audioSrc.value = getMockAudioUrl(props.videoId);
    youtubeUrl.value = `https://www.youtube.com/watch?v=${props.videoId}`;
  } else if (props.audioUrl) {
    audioSrc.value = props.audioUrl;
  }
  
  if (props.isPlaying) {
    play();
  }
});

onUnmounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
  }
});

// Expose methods to parent component
defineExpose({
  play,
  pause
});
</script>

<style lang="less" scoped>
.audio-player {
  width: 100%;
  
  .error-message {
    background-color: rgba(255, 77, 77, 0.2);
    color: #ff4d4d;
    padding: 10px;
    border-radius: 6px;
    margin-top: 10px;
    font-size: 0.9rem;
    
    a {
      color: white;
      margin-left: 10px;
      text-decoration: underline;
    }
  }
}
</style>
