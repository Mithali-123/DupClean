# DupClean Pro ✨
**A modern, aesthetic, and completely offline duplicate file optimizer.**

<p align="center">
  <img src="./icon.png" width="150px"/>
</p>

## Description 🚀
**DupClean Pro** is a professional-grade workspace optimization assistant designed to help you reclaim valuable disk space safely. Built with speed and privacy in mind, it uses a local hashing algorithm to identify exact duplicates (byte-by-byte) rather than just relying on names. 

It organizes results into intuitive categories—Images, Videos, Documents, and Audio—and allows you to stage files in a "Permanent Delete Bin" before final removal. **The entire application runs 100% offline.** Your file data and structure never leave your computer.

---

## 📸 How It Works (Workflow)

### 1. Scan Your Drive
Select a target folder and let the app quickly categorize your files.
<p align="center">
  <img src="./dashboard.png" alt="DupClean Dashboard" width="800px"/>
</p>

### 2. Analyze & Stage
Review exact duplicates, select the redundancies you don't need, and safely move them to the staging bin.
<p align="center">
  <img src="./analysis.png" alt="DupClean Analysis View" width="800px"/>
</p>

### 3. Permanently Delete
Head to the Settings menu to empty your staging bin and permanently reclaim your hard drive space!
<p align="center">
  <img src="./settings.png" alt="DupClean Settings and Trash Bin" width="800px"/>
</p>

---

## Core Features 🛠️

- **Fast, Local Scanning:** Uses high-speed MD5 hashing to find exact duplicate files, even with different names.
- **Categorized Results:** Instantly view redundancy breakdowns for common file types (Images, Videos, Docs, Audio).
- **Visual Analysis:** Modern, gradient-infused progress bars show you exactly how much optimization you can achieve.
- **Detailed Duplicate List:** Review exact duplicate file names, sizes, and full system paths to know what is taking up space.
- **Staged Deletion Workflow:** Select files with checkboxes and move them to a staged "Trash Bin" area. This visual confirmation step prevents accidental deletions.
- **Permanent Empty Bin:** Ready to optimize? Go to Settings -> "Empty Bin" to permanently obliterate the staged duplicates from your storage.
- **Privacy-First (100% Offline):** No internet connection is required. No telemetry, no accounts, no server tracking. Just a pure local utility.

---

## Tech Stack 💻
- **Frontend:** React, Lucide React (Icons)
- **Desktop Wrapper:** Electron
- **Backend (Scanning/Deletion):** Python/Flask, Send2Trash
- **Build Tool:** Vite, PyInstaller, Electron Builder

---

## How to Download and Run (for Users) 📦

### Method 1 (Recommended): Use the Setup Wizard
This is the easiest way to use DupClean Pro on Windows. No dependencies or Python required.

1.  Navigate to the [GitHub Releases](../../releases) page for this repository.
2.  Download the **`DupClean Pro Setup 1.0.0.exe`** file.
3.  Double-click the setup file and follow the professional installer instructions.
4.  Once installed, you can launch DupClean Pro from your Start Menu or Desktop shortcut!

### Method 2 (For Developers): Run from Source
If you want to contribute, you must have Node.js and Python installed.

1.  Clone this repository.
2.  In one terminal (Backend): Navigate to `backend/` and run `pip install -r requirements.txt`, then `python app.py`.
3.  In another terminal (Frontend): Navigate to `frontend/` and run `npm install`, then `npm run dev`.
4.  In a third terminal (Root): Run `npm install`, then `npm start` to open the Electron bridge.

---

## 💖 Support the Project

![Sponsors](https://img.shields.io/badge/sponsors-0-ea4aaa?style=flat-square)

DupClean Pro is a passion project built to keep your digital life private and organized. If these tools have made your life easier, there are three ways you can support the project:

1. ⭐ **Star this Repo:** It helps other developers find the project and tells me you like my work!
2. 📣 **Share it:** Tell a friend or colleague about DupClean Pro. Word-of-mouth is the best way to grow.
3. ☕ **Support the Dev:** If you’ve found massive value in DupClean Pro, check out our [Support Page](#) for ways to contribute.

> [!IMPORTANT]
> **Donations are entirely optional.** DupClean Pro is free software and will remain free for everyone. Your support, in any form (even just a star!), is deeply appreciated!

---

## 👤 Author

**Moses Kenny** *Cloud & DevOps Enthusiast | Python Developer* [GitHub](https://github.com/Moseskenny) | [LinkedIn](#)

---

## License 📜
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
