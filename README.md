# DupClean Pro ✨
**A modern, aesthetic, and completely offline duplicate file optimizer.**

## Description 🚀
**DupClean Pro** is a professional-grade workspace optimization assistant designed to help you reclaim valuable disk space safely. Built with speed and privacy in mind, it uses high-speed local hashing to identify exact duplicates (byte-by-byte), alongside advanced Fuzzy Name matching to catch similarly named files.

It organizes results into intuitive categories—Images, Videos, Documents, Audio, and Others—and allows you to stage files in a "Permanent Delete Bin" before final removal. **The entire application runs 100% offline.** Your file data and structure never leave your computer.

---

## 🎥 Workflow Demo

See DupClean Pro in action and learn how to quickly identify and remove duplicate files from your system.

## Dashboard
<img width="1920" height="1020" alt="dashboard" src="https://github.com/user-attachments/assets/45f98491-d153-4ead-b2d2-a7c9b5c50fbf" />

## Analysis
<img width="1920" height="1020" alt="exact hash" src="https://github.com/user-attachments/assets/e8ffd697-3c91-4365-98a1-6b84d0f2f8f9" />
<img width="1920" height="1020" alt="fuzzy name" src="https://github.com/user-attachments/assets/2b84c348-117a-4466-860a-2afd55416aaa" />

## Delete and Success
<img width="1920" height="1020" alt="delete" src="https://github.com/user-attachments/assets/4f635fdd-cac4-4e56-a22e-b523b506cefe" />
<img width="1920" height="1020" alt="success" src="https://github.com/user-attachments/assets/1bcd3207-32b6-486e-b2ef-b1dd078a7b91" />


> 💡 Tip: The demo walks through scanning, reviewing duplicates, staging deletions, and permanently clearing space.

---

## Core Features 🛠️

- **Dual-Mode Scanning:** Choose between high-speed MD5 Exact Hashing (byte-by-byte) or Fuzzy Name Matching to find files with typos or versioned names.
- **Categorized Results:** Instantly view redundancy breakdowns for common file types (Images, Videos, Docs, Audio, and Others).
- **Smart Storage Tracking:** Dynamically calculates the exact MB/GB of selected files and keeps a lifetime tracker of "Total Freed Up" space on your dashboard.
- **Visual Analysis:** Modern, gradient-infused progress bars show you exactly how much optimization you can achieve.
- **Detailed Duplicate List:** Review exact duplicate file names, sizes, and full system paths to know what is taking up space.
- **Staged Deletion Workflow:** Select files with checkboxes and move them to a staged "Trash Bin" area. This visual confirmation step prevents accidental deletions.
- **Privacy-First (100% Offline):** No internet connection is required. No telemetry, no accounts, no server tracking. Just a pure local utility.

---

## Tech Stack 💻
- **Frontend:** React, Lucide React (Icons)
- **Desktop Wrapper:** Electron
- **Backend (Scanning/Deletion):** Python/Flask, Send2Trash, TheFuzz
- **Build Tool:** Vite, PyInstaller, Electron Builder

---

## 🚨 New Update Available!

🔥 **Version 1.1.0 is now live!**

### ✨ What's New
- 🔍 **Fuzzy Name Matching:** Added a new scan mode to detect files with highly similar names, even if their contents differ slightly.
- 📁 **'Others' Category:** Expanded scanning capabilities to catch redundant archives (.zip, .rar) and executables (.exe, .apk).
- 📈 **Lifetime Savings Tracker:** Added a 100% offline local storage tracker to show you the total MB/GB you've saved over the lifetime of using the app.
- 🧮 **Dynamic Size Calculator:** Selecting files now instantly shows the exact combined storage size you are preparing to delete.
- 🎨 **Premium UI Enhancements:** Replaced native Windows dialog popups with custom, frosted-glass React modals for a seamless, unified workflow.

👉 Make sure to pull the latest changes or download the newest release.

---

## How to Download and Run (for Users) 📦

This is the easiest way to use DupClean Pro on Windows. No dependencies or Python required.

1.  Navigate to the [GitHub Releases](../../releases) page for this repository.
2.  Download the **`DupClean Pro Setup 1.1.0.exe`** file.
3.  Double-click the setup file and follow the professional installer instructions.
4.  Once installed, you can launch DupClean Pro from your Start Menu or Desktop shortcut!

---

## 💖 Support the Project

DupClean Pro is a passion project built to keep your digital life private and organized. If these tools have made your life easier, there are three ways you can support the project:

1. ⭐ **Star this Repo:** It helps other developers find the project and tells me you like my work!
2. 📣 **Share it:** Tell a friend or colleague about DupClean Pro. Word-of-mouth is the best way to grow.

---

## 👤 Author

**Mithali** *Cloud Enthusiast | Python Developer* [GitHub](https://github.com/Mithali-123) | [LinkedIn](https://www.linkedin.com/in/mithali-t)

---

## License 📜
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
