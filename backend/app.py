import os
import hashlib
from flask import Flask, jsonify, request
from flask_cors import CORS
from send2trash import send2trash

app = Flask(__name__)
# CORS is required for React and Python to talk smoothly
CORS(app, resources={r"/api/*": {"origins": "*"}})

scan_results = {
    "Images": [], "Videos": [], "Documents": [], "Audios": [],
    "trash": []
}

def get_file_hash(path):
    try:
        hasher = hashlib.md5()
        with open(path, 'rb') as f:
            buf = f.read(1024 * 1024) # Fast scan: check first 1MB
            hasher.update(buf)
        return hasher.hexdigest()
    except: return None

# THE EXACT ROUTE REACT IS LOOKING FOR:
@app.route('/api/scan-category', methods=['POST', 'OPTIONS'])
def scan_category():
    if request.method == 'OPTIONS': # Handle cross-origin preflight
        return jsonify({}), 200
        
    print("\n" + "="*50)
    print(">>> SUCCESS: React knocked on Python's door!")
    
    data = request.json
    path = data.get('path', '')
    cat = data.get('category', '')
    
    print(f">>> Scanning Target: {path}")
    print(f">>> Category: {cat}")
    
    if not path or not os.path.exists(path):
        print(">>> ERROR: Invalid folder path!")
        return jsonify({"count": 0, "files": []})

    ext_map = {
        'Images': ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
        'Videos': ['.mp4', '.mkv', '.mov', '.avi'],
        'Documents': ['.pdf', '.docx', '.txt', '.xlsx'],
        'Audios': ['.mp3', '.wav', '.flac', '.m4a']
    }
    
    target_exts = ext_map.get(cat, [])
    found_files = []
    hashes = {}
    
    for root, _, files in os.walk(path):
        for f in files:
            if any(f.lower().endswith(ext) for ext in target_exts):
                full_path = os.path.join(root, f)
                f_hash = get_file_hash(full_path)
                if not f_hash: continue
                
                is_dupe = f_hash in hashes
                if not is_dupe: hashes[f_hash] = True
                
                found_files.append({
                    "name": f, "path": full_path, 
                    "isDuplicate": is_dupe, 
                    "size": round(os.path.getsize(full_path)/(1024*1024), 2)
                })
    
    scan_results[cat] = found_files
    
    dupe_count = sum(1 for f in found_files if f['isDuplicate'])
    print(f">>> Found {len(found_files)} total files ({dupe_count} duplicates)")
    print("="*50 + "\n")
    
    return jsonify({"count": len(found_files), "files": found_files})

@app.route('/api/delete', methods=['POST'])
def delete_files():
    data = request.json
    paths = data.get('files', [])
    perm = data.get('permanent', False)
    
    for p in paths:
        try:
            if perm: os.remove(p)
            else: send2trash(p)
        except: continue
    return jsonify({"status": "success"})

if __name__ == '__main__':
    # Changed from 5005 to 5015 to bypass the ghost server
    app.run(host='127.0.0.1', port=5015, debug=True)