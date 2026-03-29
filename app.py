import os
import sys
import webbrowser
from threading import Timer
from flask import Flask, render_template, jsonify, request
from plyer import filechooser # This opens the REAL Windows dialog
import send2trash

def get_resource_path(relative_path):
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)

app = Flask(__name__, 
            template_folder=get_resource_path('templates'))

selected_path = ""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/open_dialog', methods=['POST'])
def open_dialog():
    global selected_path
    # This pops up the actual Windows folder picker
    path = filechooser.choose_dir(title="Select Folder to Clean")
    if path:
        selected_path = path[0]
        return jsonify({"status": "success", "path": selected_path})
    return jsonify({"status": "error", "message": "No folder selected"})

@app.route('/scan', methods=['GET'])
def scan():
    if not selected_path:
        return jsonify({"status": "error", "message": "Pick a folder first!"})
    
    # Simple logic: finds files with "copy" in name or same size
    files = [f for f in os.listdir(selected_path) if os.path.isfile(os.path.join(selected_path, f))]
    return jsonify({"status": "success", "files": files, "folder": selected_path})

def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

if __name__ == '__main__':
    Timer(1.5, open_browser).start()
    app.run(host='127.0.0.1', port=5000, debug=False)