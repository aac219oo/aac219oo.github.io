import os
from PIL import Image
from pathlib import Path

# Configuration
TARGET_DIR = r"c:\Users\user\Desktop\Projects\resume\assets\images"
EXTENSIONS = {'.jpg', '.jpeg', '.png'}
# Images to skip (e.g., OG images need to be JPG for social media, or small icons)
SKIP_FILES = {'myselfL.jpg', 'ps.ico'} 

def convert_to_webp(directory):
    total_saved = 0
    converted_count = 0
    
    print(f"Scanning directory: {directory}")

    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = Path(root) / file
            
            # Skip excluded files
            if file in SKIP_FILES:
                continue
                
            # Check extension
            if file_path.suffix.lower() in EXTENSIONS:
                webp_path = file_path.with_suffix('.webp')
                
                # Check if WebP already exists (and is newer?)
                # For now, just overwrite or create if not exists
                
                try:
                    with Image.open(file_path) as img:
                        # Calculate sizes
                        original_size = file_path.stat().st_size
                        
                        # Convert and save
                        # quality=80 is a good trade-off
                        img.save(webp_path, 'webp', quality=80)
                        
                        new_size = webp_path.stat().st_size
                        saved = original_size - new_size
                        
                        if saved > 0:
                            print(f"[OK] {file} -> {webp_path.name} | Saved: {saved/1024:.2f} KB ({(saved/original_size)*100:.1f}%)")
                            total_saved += saved
                            converted_count += 1
                        else:
                            print(f"[SKIP] {file} (WebP was larger, keeping original?) - actually created anyway for consistency")
                            
                except Exception as e:
                    print(f"[ERROR] Failed to convert {file}: {e}")

    print("-" * 30)
    print(f"Conversion Complete!")
    print(f"Total files converted: {converted_count}")
    print(f"Total space saved: {total_saved / 1024 / 1024:.2f} MB")

if __name__ == "__main__":
    convert_to_webp(TARGET_DIR)
