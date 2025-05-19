<template>
  <div class="app">
    <header class="app-header">
      <div class="container">
        <div class="logo">Music Player</div>
        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/player">Player</router-link>
          <router-link to="/settings">Settings</router-link>
        </nav>
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
// Component logic goes here
</script>

<style lang="less">
.app {
  font-family: 'Inter', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ffffff;
  background-color: #121212;
  min-height: 100vh;
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  &-header {
    padding: 16px 0;
    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 100;
    
    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-weight: 700;
      font-size: 1.4rem;
    }
    
    nav {
      display: flex;
      gap: 24px;
      
      a {
        font-weight: 500;
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: color 0.2s ease;
        
        &:hover {
          color: rgba(255, 255, 255, 0.9);
        }
        
        &.router-link-active {
          color: #ffffff;
          position: relative;
          
          &:after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #ffffff;
            border-radius: 2px;
          }
        }
      }
    }
  }
  
  main {
    min-height: calc(100vh - 64px);
  }
}

// Import Google Fonts
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
</style>
