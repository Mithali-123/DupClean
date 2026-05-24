# 🧹 DupClean Pro

## 📖 App Description
**DupClean Pro** is an intelligent, high-performance desktop application designed to help you reclaim valuable storage space. By leveraging advanced hashing algorithms and fuzzy string matching, it securely scans your local drives to identify redundant files, exact duplicates, and massive storage hogs. Featuring a sleek, modern, and highly responsive native interface, it ensures your file system remains organized and optimized without ever risking accidental data loss. 

## 💻 Tech Stack Used
* **Frontend User Interface:** React.js, Vite, HTML5, CSS3, Lucide Icons
* **Desktop Container:** Electron.js (IPC communication, Native OS integrations)
* **Backend Core:** Python 3, Flask (Local API server)
* **Algorithms & Processing:** `hashlib` (MD5 Exact Hashing), `thefuzz` (Levenshtein Distance for Fuzzy Matching), `send2trash` (Safe deletion)
* **Build & Packaging:** Electron-Builder, PyInstaller

## 🔄 Workflow

<img width="1920" height="1020" alt="1" src="https://github.com/user-attachments/assets/172b6158-7f4f-4ae6-9dea-1650abdf770a" />

<img width="1920" height="1020" alt="3" src="https://github.com/user-attachments/assets/95e8dc11-eb4d-4f99-a26b-b9519d059508" />

<img width="1920" height="1020" alt="4" src="https://github.com/user-attachments/assets/524a8d64-dd4f-4cab-a4da-4d24f7a97c84" />

<img width="1920" height="1020" alt="6" src="https://github.com/user-attachments/assets/131d239a-bbd7-4dc4-a97d-a8e737c38a8f" />


## ✨ Core Features
* **Exact Hash Match (MD5):** Scans files byte-by-byte to find 100% identical duplicates, regardless of filename changes or extensions.
* **Fuzzy Name Matching:** Intelligently groups files with similar names or minor typos (e.g., `Report_v1.pdf` and `Report_final.pdf`).
* **Magic Wand Selection:** Automate your workflow by letting the app automatically select duplicates while safely keeping the "Oldest" or "Newest" versions.
* **Safe System Deletion:** Integrated natively with the OS Recycle Bin. Files are never permanently wiped without your strict consent.

## 🚀 What's New in Version 2.0.0
We've completely overhauled DupClean Pro for maximum performance and usability. Here is what's new in the latest release:
* **🐟 Big Fish Finder:** Instantly hunt down massive storage hogs. Automatically scans core directories to locate and flag individual files taking up excessive space.
* **👀 Native Preview Mode:** Built-in rich viewer for Images, Videos, Audio, and Documents so you can verify the contents of a file directly in the app before hitting delete.
* **🗑️ Cache Reset System:** Clear your background scanning history and free up app memory instantly with the new cache management system.
* **🎛️ Advanced Toggle Buttons:** Upgraded UI controls for lightning-fast selection, theme toggling, and scan preference adjustments.
* **🐛 Critical Bug Fixes & Stability:** Resolved backend crashes caused by port-allocation conflicts, bypassed strict web security policies to allow smooth media playback, and optimized the engine to safely ignore zero-byte files during scans.

## ❤️ Support
If you found this tool helpful in freeing up gigabytes of space on your machine, consider supporting the development!
Share my app with as many users as u can to help me grow!


## 👨‍💻 Author
**Mithali** *Python & App Developer* Passionate about building highly optimized, user-centric desktop applications and automating complex workflows.  
🔗 [Connect with me on LinkedIn](https://www.linkedin.com/in/mithali-t-747336297/)* 🐙 [GitHub Profile](https://github.com/Mithali-123)

## 📄 License
This project is licensed under the **MIT License**. See the `LICENSE` file for more details.
