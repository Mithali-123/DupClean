import os
import sys
import send2trash
from flask import Flask, render_template, jsonify, request
import webbrowser
from threading import Timer

def get_resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

app = Flask(__name__, 
            template_folder=get_resource_path('templates'),
            static_folder=get_resource_path('static'))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scan', methods=['POST'])
def scan():
    data = request.json
    folder_path = data.get('path')
    
    if not folder_path or not os.path.exists(folder_path):
        return jsonify({"status": "error", "message": "Invalid folder path!"}), 400

    # Logic to find duplicates (example based on file size/name)
    files_found = []
    for root, dirs, files in os.walk(folder_path):
        for name in files:
            files_found.append(os.path.join(root, name))
            
    return jsonify({
        "status": "success", 
        "message": f"Scan complete! Found {len(files_found)} files.",
        "files": files_found[:10] # Sending first 10 for display
    })

@app.route('/delete', methods=['POST'])
def delete_file():
    data = request.json
    file_path = data.get('path')
    try:
        send2trash.send2trash(file_path) # Safely moves to Recycle Bin
        return jsonify({"status": "success", "message": "File moved to Recycle Bin"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

if __name__ == '__main__':
    Timer(1.5, open_browser).start()
    app.run(host='127.0.0.1', port=5000, debug=False)