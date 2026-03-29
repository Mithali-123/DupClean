from flask import Flask, render_template, jsonify, request
import os, hashlib, send2trash, webbrowser, threading, sys
import tkinter as tk
from tkinter import filedialog

app = Flask(__name__)

# --- Logic to find files when turned into an EXE ---
def get_resource_path(relative_path):
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)

app.template_folder = get_resource_path('templates')

session_data = { 'images': [], 'videos': [], 'audio': [], 'documents': [] }
trash_list = [] 

EXTS = {
    'images': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    'videos': ['.mp4', '.mov', '.avi', '.mkv'],
    'audio': ['.mp3', '.wav', '.m4a'],
    'documents': ['.pdf', '.docx', '.txt', '.xlsx']
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/scan', methods=['POST'])
def scan_local_folder():
    root = tk.Tk()
    root.withdraw()
    root.attributes('-topmost', True)
    folder_path = filedialog.askdirectory()
    root.destroy()
    if not folder_path: return jsonify({"status": "cancelled"})

    for k in session_data: session_data[k] = []
    hashes = {}
    
    for root_dir, _, files in os.walk(folder_path):
        for f in files:
            full_path = os.path.abspath(os.path.join(root_dir, f))
            ext = os.path.splitext(f)[1].lower()
            cat = next((c for c, e in EXTS.items() if ext in e), None)
            if cat:
                try:
                    with open(full_path, 'rb') as f_obj:
                        f_hash = hashlib.md5(f_obj.read()).hexdigest()
                    is_dupe = f_hash in hashes
                    file_info = {"name": f, "path": full_path, "size": f"{os.path.getsize(full_path)/1024:.1f} KB", "is_duplicate": is_dupe}
                    if not is_dupe: hashes[f_hash] = full_path
                    session_data[cat].append(file_info)
                except: continue

    counts = {k: len([f for f in v if f['is_duplicate']]) for k, v in session_data.items()}
    return jsonify({"status": "success", "counts": counts})

@app.route('/api/get_category/<name>')
def get_category(name):
    return jsonify(session_data.get(name, []))

@app.route('/api/delete', methods=['POST'])
def delete_real_files():
    global trash_list
    paths = request.json.get('paths', [])
    success_count = 0
    for p in paths:
        try:
            if os.path.exists(p):
                send2trash.send2trash(p)
                trash_list.append(p)
                success_count += 1
        except: continue
    return jsonify({"status": "success", "deleted": success_count, "total_trash": len(trash_list)})

@app.route('/api/empty_trash', methods=['POST'])
def empty():
    global trash_list
    trash_list = []
    return jsonify({"status": "success"})

# --- The Auto-Open Magic ---
def open_browser():
    # Wait 1.5 seconds for server to boot then open browser
    import time
    time.sleep(1.5)
    webbrowser.open('http://127.0.0.1:5001')

if __name__ == '__main__':
    # Start browser thread
    threading.Thread(target=open_browser).start()
    # Run Flask
    app.run(port=5001, debug=False)