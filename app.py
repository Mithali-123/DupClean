import os
import sys
from flask import Flask, render_template, jsonify
import webbrowser
from threading import Timer

# --- THE FIX: PATH HANDLING ---
def get_resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)

# Initialize Flask with the correct template/static paths
app = Flask(__name__, 
            template_folder=get_resource_path('templates'),
            static_folder=get_resource_path('static'))

@app.route('/')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        return f"Error: {str(e)}", 500

@app.route('/scan')
def scan_duplicates():
    # Your duplicate finding logic goes here
    return jsonify({"status": "success", "message": "Scan complete"})

def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

if __name__ == '__main__':
    # Start the browser 1.5 seconds after the server starts
    Timer(1.5, open_browser).start()
    app.run(host='127.0.0.1', port=5000, debug=False)