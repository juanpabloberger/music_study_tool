#!/usr/bin/env python3
"""
Audio setup script for Music Quiz Study Tool
Downloads YouTube videos as MP3s and creates 60-second excerpts
"""

import csv
import os
import subprocess
import json
import re
from pathlib import Path

class AudioProcessor:
    def __init__(self, csv_file="intro_to_music_songs - Sheet1.csv"):
        self.csv_file = csv_file
        self.audio_dir = Path("audio")
        self.temp_dir = Path("temp_audio")
        self.music_data = []
        
        # Create directories
        self.audio_dir.mkdir(exist_ok=True)
        self.temp_dir.mkdir(exist_ok=True)
    
    def check_dependencies(self):
        """Check if required tools are installed"""
        dependencies = ['yt-dlp', 'ffmpeg']
        missing = []
        
        for dep in dependencies:
            try:
                subprocess.run([dep, '--version'], capture_output=True, check=True)
                print(f"✓ {dep} found")
            except (subprocess.CalledProcessError, FileNotFoundError):
                missing.append(dep)
                print(f"✗ {dep} not found")
        
        if missing:
            print("\nMissing dependencies. Install with:")
            if 'yt-dlp' in missing:
                print("  pip install yt-dlp")
            if 'ffmpeg' in missing:
                print("  brew install ffmpeg  # macOS")
                print("  apt-get install ffmpeg  # Ubuntu/Debian")
            return False
        return True
    
    def sanitize_filename(self, text):
        """Create safe filename from text"""
        # Remove/replace problematic characters
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'[-\s]+', '_', text)
        return text.lower().strip('_')
    
    def read_csv(self):
        """Read and parse the CSV file"""
        try:
            with open(self.csv_file, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    # Clean YouTube URL
                    url = row['youtube_url'].strip()
                    if 'youtu.be/' in url:
                        # Convert short URL to full URL
                        video_id = url.split('youtu.be/')[-1].split('?')[0]
                        url = f"https://www.youtube.com/watch?v={video_id}"
                    
                    piece = {
                        'assignment': row['assignment'].strip(),
                        'composer': row['composer'].strip(),
                        'title': row['title'].strip().strip('",'),
                        'genre': row['genre'].strip(),
                        'youtube_url': url,
                        'filename': None  # Will be set after download
                    }
                    self.music_data.append(piece)
            
            print(f"Read {len(self.music_data)} pieces from CSV")
            return True
            
        except FileNotFoundError:
            print(f"Error: Could not find {self.csv_file}")
            return False
        except Exception as e:
            print(f"Error reading CSV: {e}")
            return False
    
    def download_audio(self, piece):
        """Download a single YouTube video as MP3"""
        # Create safe filename
        safe_title = self.sanitize_filename(piece['title'])
        safe_composer = self.sanitize_filename(piece['composer'])
        temp_filename = f"{piece['assignment']}_{safe_composer}_{safe_title}"
        
        # Full path for temporary file
        temp_path = self.temp_dir / f"{temp_filename}.%(ext)s"
        
        try:
            # Download with yt-dlp
            cmd = [
                'yt-dlp',
                '--extract-audio',
                '--audio-format', 'mp3',
                '--audio-quality', '192K',  # Good quality, reasonable size
                '--output', str(temp_path),
                '--no-playlist',
                piece['youtube_url']
            ]
            
            print(f"Downloading: {piece['title']} by {piece['composer']}")
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                # Find the actual downloaded file
                downloaded_file = None
                for ext in ['mp3', 'webm', 'm4a']:
                    potential_file = self.temp_dir / f"{temp_filename}.{ext}"
                    if potential_file.exists():
                        downloaded_file = potential_file
                        break
                
                if downloaded_file:
                    print(f"✓ Downloaded: {downloaded_file.name}")
                    return downloaded_file
                else:
                    print(f"✗ Download file not found for: {piece['title']}")
                    return None
            else:
                print(f"✗ Download failed: {piece['title']}")
                print(f"Error: {result.stderr}")
                return None
                
        except Exception as e:
            print(f"✗ Exception downloading {piece['title']}: {e}")
            return None
    
    def create_excerpt(self, input_file, piece):
        """Create 60-second excerpt from audio file"""
        safe_title = self.sanitize_filename(piece['title'])
        safe_composer = self.sanitize_filename(piece['composer'])
        output_filename = f"{piece['assignment']}_{safe_composer}_{safe_title}.mp3"
        output_path = self.audio_dir / output_filename
        
        try:
            # Use ffmpeg to create 60-second excerpt starting from 30 seconds
            # (skips intro, gets main content)
            cmd = [
                'ffmpeg',
                '-i', str(input_file),
                '-ss', '30',  # Start at 30 seconds
                '-t', '60',   # Duration of 60 seconds
                '-acodec', 'libmp3lame',
                '-ab', '128k',  # Compress to 128k for web
                '-y',  # Overwrite existing files
                str(output_path)
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"✓ Created excerpt: {output_filename}")
                piece['filename'] = output_filename
                return True
            else:
                print(f"✗ Failed to create excerpt for: {piece['title']}")
                print(f"Error: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"✗ Exception creating excerpt for {piece['title']}: {e}")
            return False
    
    def process_all(self):
        """Download and process all audio files"""
        if not self.check_dependencies():
            return False
        
        if not self.read_csv():
            return False
        
        successful = 0
        failed = 0
        
        for i, piece in enumerate(self.music_data, 1):
            print(f"\n[{i}/{len(self.music_data)}] Processing: {piece['title']}")
            
            # Check if excerpt already exists
            safe_title = self.sanitize_filename(piece['title'])
            safe_composer = self.sanitize_filename(piece['composer'])
            output_filename = f"{piece['assignment']}_{safe_composer}_{safe_title}.mp3"
            output_path = self.audio_dir / output_filename
            
            if output_path.exists():
                print(f"✓ Excerpt already exists: {output_filename}")
                piece['filename'] = output_filename
                successful += 1
                continue
            
            # Download the full audio
            temp_file = self.download_audio(piece)
            if temp_file is None:
                failed += 1
                continue
            
            # Create 60-second excerpt
            if self.create_excerpt(temp_file, piece):
                successful += 1
            else:
                failed += 1
            
            # Clean up temp file
            if temp_file.exists():
                temp_file.unlink()
        
        # Clean up temp directory
        try:
            self.temp_dir.rmdir()
        except:
            pass
        
        print(f"\n=== Processing Complete ===")
        print(f"Successful: {successful}")
        print(f"Failed: {failed}")
        
        # Generate JSON database
        if successful > 0:
            self.generate_json_database()
        
        return successful > 0
    
    def generate_json_database(self):
        """Generate JSON database for the web app"""
        # Filter out failed pieces (those without filenames)
        valid_pieces = [piece for piece in self.music_data if piece.get('filename')]
        
        # Create optimized structure for web app
        database = {
            'pieces': [],
            'assignments': list(set(piece['assignment'] for piece in valid_pieces))
        }
        
        for piece in valid_pieces:
            database['pieces'].append({
                'assignment': piece['assignment'],
                'composer': piece['composer'],
                'title': piece['title'],
                'genre': piece['genre'],
                'audioFile': f"audio/{piece['filename']}"
            })
        
        # Sort by assignment, then by composer
        database['pieces'].sort(key=lambda x: (x['assignment'], x['composer'], x['title']))
        database['assignments'].sort()
        
        # Write JSON file
        json_path = Path('music_database.json')
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(database, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Generated database: {json_path}")
        print(f"  - {len(database['pieces'])} pieces")
        print(f"  - {len(database['assignments'])} assignments")
        
        # Update the JavaScript file to use the JSON database
        self.update_javascript()
    
    def update_javascript(self):
        """Update the JavaScript file to load from JSON"""
        js_path = Path('app.js')
        if not js_path.exists():
            return
        
        # Read current JavaScript
        with open(js_path, 'r', encoding='utf-8') as f:
            js_content = f.read()
        
        # Replace the loadMusicData method
        new_load_method = '''    async loadMusicData() {
        try {
            const response = await fetch('music_database.json');
            if (!response.ok) throw new Error('Failed to load music database');
            
            const database = await response.json();
            this.pieces = database.pieces;
            console.log(`Loaded ${this.pieces.length} pieces from database`);
        } catch (error) {
            console.error('Failed to load music database:', error);
            // Fallback to empty array
            this.pieces = [];
        }
    }'''
        
        # Use regex to replace the existing loadMusicData method
        pattern = r'async loadMusicData\(\) \{[^}]*\}(?:\s*\}\s*\{[^}]*)*\}'
        if 'music_database.json' not in js_content:
            js_content = re.sub(pattern, new_load_method, js_content, flags=re.DOTALL)
            
            with open(js_path, 'w', encoding='utf-8') as f:
                f.write(js_content)
            
            print("✓ Updated JavaScript to use JSON database")

def main():
    processor = AudioProcessor()
    
    print("=== Music Quiz Audio Setup ===")
    print("This script will:")
    print("1. Download YouTube videos as MP3 files")
    print("2. Create 60-second excerpts optimized for web")
    print("3. Generate JSON database for the web app")
    print()
    
    if input("Continue? (y/N): ").lower().strip() == 'y':
        processor.process_all()
    else:
        print("Setup cancelled.")

if __name__ == "__main__":
    main()