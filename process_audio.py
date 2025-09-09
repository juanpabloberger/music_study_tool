#!/usr/bin/env python3
"""
Auto-process audio files for Music Quiz Study Tool
"""

import csv
import os
import subprocess
import json
import re
from pathlib import Path

def sanitize_filename(text):
    """Create safe filename from text"""
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '_', text)
    return text.lower().strip('_')

def process_audio():
    csv_file = "intro_to_music_songs - Sheet1.csv"
    audio_dir = Path("audio")
    temp_dir = Path("temp_audio")
    
    # Create directories
    audio_dir.mkdir(exist_ok=True)
    temp_dir.mkdir(exist_ok=True)
    
    print("=== Processing Audio Files ===")
    
    # Read CSV
    music_data = []
    try:
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                url = row['youtube_url'].strip()
                if 'youtu.be/' in url:
                    video_id = url.split('youtu.be/')[-1].split('?')[0]
                    url = f"https://www.youtube.com/watch?v={video_id}"
                
                piece = {
                    'assignment': row['assignment'].strip(),
                    'composer': row['composer'].strip(),
                    'title': row['title'].strip().strip('",'),
                    'genre': row['genre'].strip(),
                    'youtube_url': url,
                    'filename': None
                }
                music_data.append(piece)
        
        print(f"Found {len(music_data)} pieces to process")
        
    except FileNotFoundError:
        print(f"Error: Could not find {csv_file}")
        return False
    
    # Process each piece
    successful = 0
    failed = 0
    
    for i, piece in enumerate(music_data, 1):
        print(f"\n[{i}/{len(music_data)}] Processing: {piece['title']} by {piece['composer']}")
        
        # Create safe filename
        safe_title = sanitize_filename(piece['title'])
        safe_composer = sanitize_filename(piece['composer'])
        output_filename = f"{piece['assignment']}_{safe_composer}_{safe_title}.mp3"
        output_path = audio_dir / output_filename
        
        # Check if already exists
        if output_path.exists():
            print(f"✓ Already exists: {output_filename}")
            piece['filename'] = output_filename
            successful += 1
            continue
        
        # Download and process
        temp_filename = f"{piece['assignment']}_{safe_composer}_{safe_title}"
        temp_path = temp_dir / f"{temp_filename}.%(ext)s"
        
        try:
            # Download
            print(f"  Downloading...")
            download_cmd = [
                'yt-dlp',
                '--extract-audio',
                '--audio-format', 'mp3',
                '--audio-quality', '192K',
                '--output', str(temp_path),
                '--no-playlist',
                piece['youtube_url']
            ]
            
            result = subprocess.run(download_cmd, capture_output=True, text=True, timeout=120)
            
            if result.returncode == 0:
                # Find downloaded file
                downloaded_file = None
                for ext in ['mp3', 'webm', 'm4a']:
                    potential_file = temp_dir / f"{temp_filename}.{ext}"
                    if potential_file.exists():
                        downloaded_file = potential_file
                        break
                
                if downloaded_file:
                    print(f"  Creating 60-second excerpt...")
                    
                    # Create excerpt with ffmpeg
                    excerpt_cmd = [
                        'ffmpeg',
                        '-i', str(downloaded_file),
                        '-ss', '30',  # Start at 30 seconds
                        '-t', '60',   # Duration of 60 seconds
                        '-acodec', 'libmp3lame',
                        '-ab', '128k',  # Compress for web
                        '-y',  # Overwrite
                        str(output_path)
                    ]
                    
                    excerpt_result = subprocess.run(excerpt_cmd, capture_output=True, text=True, timeout=60)
                    
                    if excerpt_result.returncode == 0:
                        print(f"✓ Created: {output_filename}")
                        piece['filename'] = output_filename
                        successful += 1
                    else:
                        print(f"✗ Failed to create excerpt")
                        failed += 1
                    
                    # Clean up temp file
                    downloaded_file.unlink()
                else:
                    print(f"✗ Downloaded file not found")
                    failed += 1
            else:
                print(f"✗ Download failed: {result.stderr}")
                failed += 1
                
        except subprocess.TimeoutExpired:
            print(f"✗ Timeout processing {piece['title']}")
            failed += 1
        except Exception as e:
            print(f"✗ Error: {e}")
            failed += 1
    
    # Clean up temp directory
    try:
        temp_dir.rmdir()
    except:
        pass
    
    print(f"\n=== Processing Complete ===")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    
    # Generate JSON database
    if successful > 0:
        valid_pieces = [piece for piece in music_data if piece.get('filename')]
        
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
        
        database['pieces'].sort(key=lambda x: (x['assignment'], x['composer'], x['title']))
        database['assignments'].sort()
        
        # Write JSON
        with open('music_database.json', 'w', encoding='utf-8') as f:
            json.dump(database, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Generated music_database.json with {len(database['pieces'])} pieces")
        
        # Update JavaScript to reflect audio availability
        update_javascript()
        
        return True
    
    return False

def update_javascript():
    """Update JavaScript to show audio as available"""
    js_path = Path('app.js')
    if not js_path.exists():
        return
    
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()
    
    # Update checkAudioAvailable to return true
    updated_content = js_content.replace(
        'return false; // Will be updated after audio processing',
        'return true; // Updated after audio processing'
    )
    
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print("✓ Updated JavaScript to reflect audio availability")

if __name__ == "__main__":
    print("Starting automatic audio processing...")
    process_audio()