# DupClean 🚀
**An Automated Duplicate File Finder & Cleanup Utility**

DupClean is a Flask-based desktop application designed to scan directories, identify duplicate files, and perform safe cleanups using `Send2Trash`.

## ✨ Features
* **Smart Scanning:** Rapidly identifies duplicates in any user-defined path.
* **Modern UI:** Clean, purple-themed interface for easy navigation.
* **Safe Deletion:** Uses Recycle Bin integration instead of permanent deletion.
* **CI/CD Integrated:** Automated build pipeline using Jenkins for Windows EXE generation.

## 🛠️ Tech Stack
* **Language:** Python 3.12
* **Framework:** Flask
* **Automation:** Jenkins (CI/CD)
* **Packaging:** PyInstaller

## 🚀 How to Run
1. Download the latest `app.exe` from the [Releases](#) section.
2. Run the executable—no Python installation required!
3. Access the UI at `http://localhost:5000`.

## 🤖 Pipeline Details
The project includes a `Jenkinsfile` that automates:
1. Environment setup and dependency installation.
2. Building a standalone Windows `.exe`.
3. Post-build verification.
