import os
import imagehash
from PIL import Image
import hashlib
from flask import Flask, jsonify, request
from flask_cors import CORS
from send2trash import send2trash
from thefuzz import fuzz
from pathlib import Path

app = Flask(__name__)
# CORS is required for React and Python to talk smoothly
CORS(app, resources={r"/api/*": {"origins": "*"}})

CATEGORIES = {
    'Images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.heic'],
    'Videos': ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v'],
    'Documents': ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.ppt', '.pptx', '.csv', '.rtf'],
    'Audios': ['.mp3', '.wav', '.aac', '.flac', '.ogg', '.m4a', '.wma'], 
    'Others': ['.rar', '.zip', '.7z', '.tar', '.gz', '.war', '.apk', '.iso', '.exe', '.msi', '.bin']
}

scan_results = {
    "Images": [], "Videos": [], "Documents": [], "Audios": [], "Others": [],
    "trash": []
}

@app.route('/api/count-categories', methods=['POST', 'OPTIONS'])
def count_categories():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    try:    
        data = request.json or {}
        path = data.get('path', '')
        
        if not path or not os.path.exists(path):
            return jsonify({"error": "Invalid path"}), 404

        counts = {'Images': 0, 'Videos': 0, 'Documents': 0, 'Audios': 0, 'Others': 0}
        
        for root, _, files in os.walk(path):
            for file in files:
                try:
                    ext = os.path.splitext(file)[1].lower()
                    for cat, exts in CATEGORIES.items():
                        if ext in exts:
                            counts[cat] += 1
                            break
                except: continue
                        
        return jsonify(counts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_file_hash(path):
    try:
        if os.path.getsize(path) == 0:
            return "zero_byte_empty_file"
        hasher = hashlib.md5()
        with open(path, 'rb') as f:
            buf = f.read(1024 * 1024) 
            hasher.update(buf)
        return hasher.hexdigest()
    except: return None

def get_file_mtime(path):
    try:
        return os.path.getmtime(path)
    except: return 0

def get_full_hash(path):
    try:
        if os.path.getsize(path) == 0:
            return "zero_byte_empty_file"
        hasher = hashlib.md5()
        with open(path, 'rb') as f:
            for chunk in iter(lambda: f.read(4096 * 1024), b""): 
                hasher.update(chunk)
        return hasher.hexdigest()
    except: return None

@app.route('/api/scan-category', methods=['POST', 'OPTIONS'])
def scan_category():
    if request.method == 'OPTIONS': 
        return jsonify({}), 200
    try:    
        data = request.json or {}
        path = data.get('path', '')
        cat = data.get('category', '')
        
        if not path or not os.path.exists(path):
            return jsonify({"count": 0, "files": []})

        target_exts = CATEGORIES.get(cat, [])
        fast_hashes = {} 
        
        for root, _, files in os.walk(path):
            for f in files:
                try:
                    if any(f.lower().endswith(ext) for ext in target_exts):
                        full_path = os.path.join(root, f)
                        f_size_bytes = os.path.getsize(full_path)
                        f_hash = get_file_hash(full_path) 
                        
                        if not f_hash: continue
                        
                        if f_hash not in fast_hashes:
                            fast_hashes[f_hash] = []
                            
                        fast_hashes[f_hash].append({
                            "name": f, "path": full_path, 
                            "size": round(f_size_bytes / (1024 * 1024), 2),
                            "isDuplicate": False,
                            "modified_timestamp": get_file_mtime(full_path)
                        })
                except: continue
                    
        found_files = []
        for f_hash, file_list in fast_hashes.items():
            if len(file_list) == 1:
                found_files.extend(file_list)
            else:
                verified_full_hashes = {}
                for file_item in file_list:
                    try:
                        full_hash = get_full_hash(file_item['path'])
                        if not full_hash: continue
                        
                        if full_hash in verified_full_hashes:
                            file_item['isDuplicate'] = True
                            file_item['hash'] = full_hash 
                        else:
                            verified_full_hashes[full_hash] = True
                            file_item['isDuplicate'] = False
                            file_item['hash'] = full_hash
                            
                        found_files.append(file_item)
                    except: continue
        
        scan_results[cat] = found_files
        return jsonify({"count": len(found_files), "files": found_files})
    except Exception as e:
        return jsonify({"count": 0, "files": [], "error": str(e)}), 500

@app.route('/api/delete', methods=['POST'])
def delete_files():
    try:
        data = request.json or {}
        paths = data.get('files', [])
        perm = data.get('permanent', False)
        
        for p in paths:
            try:
                if perm: os.remove(p)
                else: send2trash(p)
            except: continue
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/scan-fuzzy-names', methods=['POST'])
def scan_fuzzy_names():
    try:
        data = request.json or {}
        folder_path = data.get('path')
        cat = data.get('category', '')
        
        if not folder_path or not os.path.exists(folder_path):
            return jsonify({'files': [], 'count': 0})

        target_exts = CATEGORIES.get(cat, [])
        all_files = []
        
        for root, _, files in os.walk(folder_path):
            for file in files:
                try:
                    if not target_exts or any(file.lower().endswith(ext) for ext in target_exts):
                        full_path = os.path.join(root, file)
                        all_files.append({
                            "path": full_path, 
                            "name": file, 
                            "size": round(os.path.getsize(full_path) / (1024 * 1024), 2),
                            "modified_timestamp": get_file_mtime(full_path)
                        })
                except: continue

        results = []
        seen = set()
        
        for i, f1 in enumerate(all_files):
            if i in seen: continue
            
            similars = [f1]
            name1_no_ext = os.path.splitext(f1["name"])[0].lower() 
            
            for j in range(i + 1, len(all_files)):
                if j in seen: continue
                
                f2 = all_files[j]
                name2_no_ext = os.path.splitext(f2["name"])[0].lower()
                
                if fuzz.ratio(name1_no_ext, name2_no_ext) > 90: 
                    similars.append(f2)
                    seen.add(j)
                    
            if len(similars) == 1:
                similars[0]["isDuplicate"] = False
                results.append(similars[0])
            else:
                results.append(similars[0]) # Keep original marked false
                for sim in similars[1:]: 
                    sim["isDuplicate"] = True
                    results.append(sim)

        return jsonify({'files': results, 'count': len(results)})
    except Exception as e:
        return jsonify({'files': [], 'count': 0, 'error': str(e)}), 500

@app.route('/api/scan-image-similarity', methods=['POST'])
def scan_image_similarity():
    try:
        data = request.json or {}
        folder_path = data.get('path')
        
        if not folder_path or not os.path.exists(folder_path):
            return jsonify({'files': [], 'count': 0})

        target_exts = CATEGORIES.get('Images', []) 
        all_images = []
        
        for root, _, files in os.walk(folder_path):
            for file in files:
                try:
                    if any(file.lower().endswith(ext) for ext in target_exts):
                        full_path = os.path.join(root, file)
                        all_images.append({
                            "path": full_path, 
                            "name": file, 
                            "size": round(os.path.getsize(full_path) / (1024 * 1024), 2)
                        })
                except: continue

        results = []
        seen = set()
        
        for img in all_images:
            try:
                img['phash'] = imagehash.average_hash(Image.open(img['path']))
            except:
                img['phash'] = None

        for i, img1 in enumerate(all_images):
            if i in seen or not img1['phash']: continue
            
            similars = [img1]
            for j in range(i + 1, len(all_images)):
                if j in seen: continue
                img2 = all_images[j]
                if not img2['phash']: continue
                
                if img1['phash'] - img2['phash'] < 5: 
                    similars.append(img2)
                    seen.add(j)
                    
            if len(similars) > 1:
                for sim in similars[1:]:
                    clean_sim = sim.copy()
                    clean_sim.pop('phash', None)
                    clean_sim["isDuplicate"] = True
                    results.append(clean_sim)

        return jsonify({'files': results, 'count': len(results)})
    except Exception as e:
        return jsonify({'files': [], 'count': 0, 'error': str(e)}), 500

def get_file_category(filename):
    ext = filename.split('.')[-1].lower() if '.' in filename else ''
    if ext in ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']: return 'Image'
    if ext in ['mp4', 'mkv', 'avi', 'mov', 'wmv']: return 'Video'
    if ext in ['pdf', 'docx', 'doc', 'txt', 'xlsx', 'xls', 'ppt', 'pptx']: return 'Document'
    if ext in ['exe', 'msi', 'apk', 'bat']: return 'Executable'
    if ext in ['zip', 'rar', '7z', 'tar', 'gz']: return 'Archive'
    if ext in ['mp3', 'wav', 'ogg', 'flac']: return 'Audio'
    return 'Other'

@app.route('/api/big-fish', methods=['POST'])
def big_fish():
    try:
        user_home = Path.home()
        target_folders = [
            user_home / "Downloads",
            user_home / "Desktop",
            user_home / "Documents",
            user_home / "Videos",
            user_home / "Pictures"
        ]
        
        all_files = []
        for folder in target_folders:
            if not folder.exists(): continue
            for root, _, files in os.walk(str(folder)):
                for file in files:
                    full_path = os.path.join(root, file)
                    try:
                        size_mb = os.path.getsize(full_path) / (1024 * 1024)
                        if size_mb > 15: 
                            all_files.append({
                                "name": file, 
                                "path": full_path, 
                                "size": round(size_mb, 2),
                                "category": get_file_category(file),
                                "isDuplicate": True 
                            })
                    except: continue
                    
        top_files = sorted(all_files, key=lambda x: x['size'], reverse=True)[:50]
        return jsonify({"files": top_files})
    except Exception as e:
        return jsonify({"files": [], "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5015, debug=False, use_reloader=False)