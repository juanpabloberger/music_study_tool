# Medieval & Renaissance Music Quiz Study Tool

A high-performance web-based study tool for listening quiz preparation.

## Quick Start

### 1. Install Dependencies
```bash
# Install yt-dlp for YouTube downloads
pip install yt-dlp

# Install ffmpeg for audio processing
# macOS:
brew install ffmpeg

# Ubuntu/Debian:
sudo apt-get install ffmpeg
```

### 2. Download and Process Audio
```bash
python3 setup_audio.py
```

This will:
- Download all YouTube videos as MP3 files
- Create 60-second excerpts optimized for web playback
- Generate a JSON database for the web app

### 3. Serve the Web App
```bash
# Simple HTTP server (Python)
python3 -m http.server 8000

# Or use any web server
# Then open: http://localhost:8000
```

## Features

### 🎵 Study Mode
- Browse all pieces by assignment
- Instant audio playback with auto-repeat (plays twice)
- Clean, fast-loading interface

### 📝 Quiz Mode
- Random selection of 5, 10, or 15 pieces
- Filter by assignment or use all pieces
- Smart scoring with partial credit
- Immediate feedback after each question

### 📊 Progress Tracking
- Quiz history and statistics
- Local storage (no external dependencies)
- Average scores and best performance

### 📱 Mobile-Friendly
- Responsive design optimized for performance
- Touch-friendly controls
- Works offline after initial load

## Performance Optimizations

- **Audio**: 128kbps MP3 excerpts (60 seconds each)
- **Loading**: Minimal JavaScript, no external frameworks
- **Storage**: Local storage only, no API calls
- **Caching**: Browser caches audio files automatically
- **Size**: Compressed audio files for faster loading

## File Structure
```
├── index.html          # Main web app
├── styles.css          # Minimal, performant styling
├── app.js              # Core functionality
├── setup_audio.py      # Audio processing script
├── music_database.json # Generated piece database
└── audio/              # 60-second MP3 excerpts
    ├── 1a_anonymous_agnus_dei.mp3
    ├── 1a_anonymous_haec_dies.mp3
    └── ...
```

## Audio Processing Details

The setup script:
1. Downloads YouTube videos using `yt-dlp`
2. Extracts 60-second excerpts starting at 30 seconds (skips intros)
3. Compresses to 128kbps MP3 for web optimization
4. Creates safe filenames for web serving
5. Generates JSON database with piece metadata

## Browser Support

Works on all modern browsers:
- Chrome/Edge (recommended for best performance)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Audio won't play
- Ensure you're serving over HTTP (not file://)
- Check browser console for errors
- Verify audio files exist in `audio/` directory

### Download fails
- Check internet connection
- Verify YouTube URLs are accessible
- Some videos may have restrictions

### Performance issues
- Clear browser cache and reload
- Check if audio files are too large
- Ensure you're using a local server, not file://