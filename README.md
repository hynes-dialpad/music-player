# Music Player

A modern Vue.js music player application built with Vite.

## Features

- Vue.js 3 with Composition API
- Vite for fast development and building
- Pinia for state management with persistence
- Vue Router for navigation
- Less CSS preprocessor for styling
- Responsive design
- GitHub Actions for CI/CD
- GitHub Pages deployment with branch previews for PRs
- Mock music service integration (expandable to Spotify, Apple Music, and YouTube Music)

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```text
music-player/
├── .github/            # GitHub Actions workflows
├── public/             # Static assets
├── src/
│   ├── assets/         # Project assets (images, styles)
│   ├── components/     # Vue components
│   ├── router/         # Vue Router configuration
│   ├── stores/         # Pinia stores
│   ├── views/          # Page components
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch. Pull requests will generate preview deployments for easy testing and review.
