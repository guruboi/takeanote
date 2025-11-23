# NotebookOS PWA

A fully functional Progressive Web App (PWA) for mind mapping and note-taking with AI integration.

## Features

- **Offline Support**: Works without internet connection using service worker caching
- **Installable**: Can be installed on mobile and desktop devices like a native app
- **Responsive Design**: Works on all device sizes
- **AI Integration**: Connects to Gemini API for AI-powered brainstorming
- **Data Persistence**: Saves your work locally and in service worker cache
- **Touch Support**: Full touch and gesture support for mobile devices

## PWA Capabilities

- **Manifest File**: Properly configured manifest.json for app installation
- **Service Worker**: Caches assets and data for offline functionality
- **Multiple Icon Sizes**: Various icon sizes for different devices
- **Theme Color**: Consistent theming across platforms
- **Mobile Optimized**: Touch-friendly interface with mobile header

## Installation

1. Open the app in a modern browser (Chrome, Firefox, Safari, Edge)
2. Look for the "Install" button in the address bar or browser menu
3. Click "Install" to add to your home screen or applications

## Offline Usage

The app will work offline with previously saved data. AI features will show a message when offline but the core functionality remains available.

## Files Structure

- `notebookos.html` - Main application file
- `manifest.json` - PWA manifest configuration
- `sw.js` - Service worker for offline functionality
- `icons/` - Multiple icon sizes for PWA installation