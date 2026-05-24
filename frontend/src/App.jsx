<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Trash2, CheckSquare,
  Search, Image as ImageIcon, Film, FileText, Music, Loader2,
  LayoutDashboard, HardDrive, X, Square, Minus, Archive, FileSearch, Maximize2, AlertTriangle,
  Sun, Moon, Zap, Clock, Fish
=======
import React, { useState } from 'react';
import { 
  ChevronLeft, Trash2, CheckSquare,
  Search, Image as ImageIcon, Film, FileText, Music, Loader2,
  LayoutDashboard, HardDrive, X, Square, Minus
<<<<<<< HEAD
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
>>>>>>> 658b929 (Version 1.0)
} from 'lucide-react';
import { renderAsync } from 'docx-preview';
import './App.css';
let activeScanToken = 0;

const formatDynamicSize = (sizeInMB) => {
  const numSize = parseFloat(sizeInMB);
  if (isNaN(numSize)) return "0.00 MB";
  if (numSize >= 1024) {
    return (numSize / 1024).toFixed(2) + " GB";
  }
  return numSize.toFixed(2) + " MB";
};

function App() {
<<<<<<< HEAD
  const [counts, setCounts] = useState({ Images: 0, Videos: 0, Documents: 0, Audios: 0, Others: 0 });
  const [view, setView] = useState('dashboard');
  const [scanMode, setScanMode] = useState('exact'); 
=======
  const [counts, setCounts] = useState({ Images: 0, Videos: 0, Documents: 0, Audios: 0 });
  const [view, setView] = useState('dashboard'); 
<<<<<<< HEAD
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
>>>>>>> 658b929 (Version 1.0)
  const [scannedFiles, setScannedFiles] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [stagedForDeletion, setStagedForDeletion] = useState([]);
<<<<<<< HEAD
<<<<<<< HEAD
  const [previewImage, setPreviewImage] = useState(null);
  
  const docxContainerRef = useRef(null);

  const [modalConfig, setModalConfig] = useState({ 
    isOpen: false, type: 'info', title: '', message: '', onConfirm: null 
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('dupclean_theme');
    return saved ? saved === 'dark' : true;
  });

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('dupclean_theme', newMode ? 'dark' : 'light');
  };

  const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

  const [totalSavedMB, setTotalSavedMB] = useState(() => {
    const saved = localStorage.getItem('dupclean_lifetime_saved');
    const parsed = saved ? parseFloat(saved) : 0;
    return (parsed && !isNaN(parsed)) ? parsed : 0;
  });

=======

  // Window Controls
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======

  // Window Controls
>>>>>>> 658b929 (Version 1.0)
  const handleWindow = (action) => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send(`window-${action}`);
    }
  };
<<<<<<< HEAD
<<<<<<< HEAD

  // Safe document rendering hook
  useEffect(() => {
    if (previewImage && previewImage.isDocx && docxContainerRef.current) {
      try {
        if (window.require) {
          const fs = window.require('fs');
          const fileBuffer = fs.readFileSync(previewImage.path);
          docxContainerRef.current.innerHTML = ""; 
          renderAsync(fileBuffer, docxContainerRef.current).catch(err => {
            if(docxContainerRef.current) {
              docxContainerRef.current.innerHTML = `<p style="color:#ef4444;text-align:center;padding:20px;">Unable to render file layout natively.</p>`;
            }
          });
        }
      } catch (e) {
        console.error("Local file system rendering failure:", e);
      }
    }
  }, [previewImage]);

  useEffect(() => {
    if (!selectedFolder) return;

    const runQuietScan = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5015/api/scan-category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: selectedFolder, category: 'Images' })
        });
        
        if (!response.ok) return;
        const data = await response.json();
        const duplicates = (data.files || []).filter(f => f.isDuplicate);

        if (duplicates.length > 0) {
          const foundMB = duplicates.reduce((sum, f) => sum + f.size, 0).toFixed(2);
          try {
            const notif = new window.Notification("DupClean Pro Optimizer", {
              body: `Quiet Scan found ${foundMB} MB of new redundancies. Click to optimize now.`,
              requireInteraction: true
            });

            notif.onclick = () => {
              if (window.require) {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.send('window-focus');
              }
              setCurrentCategory('Background Identified');
              setScanMode('exact');
              setScannedFiles(data.files);
              setSelectedFiles(new Set(duplicates.map(f => f.path))); 
              setView('analysis');
            };
          } catch (e) { console.log("Notification unavailable:", e); }
        }
      } catch (e) { console.log("Quiet scan waiting..."); }
    };

    const intervalTimer = setInterval(runQuietScan, 12 * 60 * 60 * 1000);
    return () => clearInterval(intervalTimer);
  }, [selectedFolder]);
=======
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
>>>>>>> 658b929 (Version 1.0)

  const handleSelectFolder = async () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      const folderPath = await ipcRenderer.invoke('select-folder');
      if (folderPath) {
        setSelectedFolder(folderPath);
<<<<<<< HEAD
<<<<<<< HEAD
        localStorage.setItem('dupclean_last_folder', folderPath);
        try {
          const response = await fetch('http://127.0.0.1:5015/api/count-categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: folderPath })
          });
          if (response.ok) {
            const newCounts = await response.json();
            setCounts(newCounts);
          }
        } catch (error) { console.error("Failed to fetch counts."); }
=======
=======
>>>>>>> 658b929 (Version 1.0)
        const categories = ['Images', 'Videos', 'Documents', 'Audios'];
        for (let cat of categories) {
          try {
            const response = await fetch('http://127.0.0.1:5015/api/scan-category', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ path: folderPath, category: cat })
            });
            if (response.ok) {
              const data = await response.json();
              setCounts(prev => ({ ...prev, [cat]: data.count }));
            }
          } catch (error) { console.log(`Skipped ${cat}`); }
        }
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
      }
    }
  };

  const handleScan = async (category) => {
<<<<<<< HEAD
<<<<<<< HEAD
    if (!selectedFolder) {
      setModalConfig({
        isOpen: true,
        type: 'info',
        title: 'Target Folder Required',
        message: 'Please select a target folder before choosing a category to scan.'
      });
      return;
    }

    const token = ++activeScanToken; 
=======
    if (!selectedFolder) { alert("Please select a target folder first."); return; }
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
    if (!selectedFolder) { alert("Please select a target folder first."); return; }
>>>>>>> 658b929 (Version 1.0)
    setCurrentCategory(category);
    setIsScanning(true);
    setView('analysis');
    setScannedFiles([]);
    setSelectedFiles(new Set());
<<<<<<< HEAD
<<<<<<< HEAD

    // HARDENED: Dynamically routes based on toggle selection
    const endpoint = scanMode === 'fuzzy' 
      ? 'http://127.0.0.1:5015/api/scan-fuzzy-names' 
      : 'http://127.0.0.1:5015/api/scan-category';

=======
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
>>>>>>> 658b929 (Version 1.0)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedFolder, category: category, mode: scanMode })
      });
<<<<<<< HEAD
<<<<<<< HEAD
      
      if (!response.ok) throw new Error("Failed to scan directory.");
=======
      if (!response.ok) throw new Error(`Server Code: ${response.status}`);
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
      if (!response.ok) throw new Error(`Server Code: ${response.status}`);
>>>>>>> 658b929 (Version 1.0)
      const data = await response.json();
      
      if (token !== activeScanToken) return;

      const files = data.files || [];
      setScannedFiles(files);
      
      const duplicates = files.filter(f => f.isDuplicate);
      
      if (duplicates.length > 0) {
        const totalSizeMB = duplicates.reduce((sum, f) => sum + f.size, 0).toFixed(2);
        if (window.Notification && Notification.permission === "granted") {
          new window.Notification("Scan Complete", {
            body: `Found ${duplicates.length} duplicate ${category} files (${totalSizeMB} MB).`
          });
        } else {
          setModalConfig({
            isOpen: true,
            type: 'success',
            title: 'Scan Complete',
            message: `Found ${duplicates.length} duplicate ${category} files.`
          });
        }
      } else {
        setModalConfig({
          isOpen: true,
          type: 'info',
          title: 'Folder Clean',
          message: `No duplicate ${category} files were found in this directory.`
        });
      }

    } catch (error) {
<<<<<<< HEAD
<<<<<<< HEAD
      if (token !== activeScanToken) return; 
      console.error("Scan error:", error);
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Scan Error',
        message: 'Could not connect to optimization core. Please verify execution permissions.'
      });
=======
      alert(`Connection Error: ${error.message}`);
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
      alert(`Connection Error: ${error.message}`);
>>>>>>> 658b929 (Version 1.0)
    } finally {
      if (token === activeScanToken) setIsScanning(false);
    }
  };

<<<<<<< HEAD
<<<<<<< HEAD
  const handleBigFishScan = async () => {
    const token = ++activeScanToken; 
    setView('big-fish');
    setIsScanning(true);
    setScannedFiles([]);
    setSelectedFiles(new Set());

    try {
      const response = await fetch('http://127.0.0.1:5015/api/big-fish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: 'auto' })
      });

      if (!response.ok) throw new Error("Failed to scan large files.");
      const data = await response.json();

      if (token !== activeScanToken) return; 

      setScannedFiles(data.files || []);

      if (data.files && data.files.length > 0) {
         if (window.Notification) new window.Notification("Big Fish Scan Complete", { body: `Found ${data.files.length} large files.` });
      } else {
         setModalConfig({ isOpen: true, type: 'info', title: 'No Large Files', message: 'No files over 15MB found in main user folders.' });
      }
    } catch (error) {
      if (token !== activeScanToken) return; 
      setModalConfig({ isOpen: true, type: 'error', title: 'Scan Error', message: 'Core communication timeout.' });
    } finally {
      if (token === activeScanToken) setIsScanning(false);
    }
  };

  const handleMagicWand = (mode) => {
    if (scannedFiles.length === 0) return;
    
    const hashGroups = {};
    scannedFiles.forEach(file => {
      const key = file.hash || file.name.replace(/\.[^/.]+$/, '');
      if (!hashGroups[key]) hashGroups[key] = [];
      hashGroups[key].push(file);
    });

    const newSelection = new Set(selectedFiles);
    
    Object.values(hashGroups).forEach(group => {
      if (group.length <= 1) return;
      
      const sorted = [...group].sort((a, b) => a.modified_timestamp - b.modified_timestamp);
      const keeper = mode === 'oldest' ? sorted[0] : sorted[sorted.length - 1];
      
      group.forEach(file => {
        if (file.path !== keeper.path && file.isDuplicate) {
          newSelection.add(file.path);
        }
      });
    });

    setSelectedFiles(newSelection);
  };

=======
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
>>>>>>> 658b929 (Version 1.0)
  const toggleFileSelection = (path) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(path)) newSelection.delete(path);
    else newSelection.add(path);
    setSelectedFiles(newSelection);
  };

<<<<<<< HEAD
  const handleSelectAll = (filesList) => {
    if (selectedFiles.size === filesList.length) setSelectedFiles(new Set());
    else setSelectedFiles(new Set(filesList.map(f => f.path)));
=======
  const handleSelectAll = (duplicateFiles) => {
    if (selectedFiles.size === duplicateFiles.length) setSelectedFiles(new Set());
    else setSelectedFiles(new Set(duplicateFiles.map(f => f.path)));
<<<<<<< HEAD
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
>>>>>>> 658b929 (Version 1.0)
  };

  const handleStageForDeletion = () => {
    const filesToStage = scannedFiles.filter(f => selectedFiles.has(f.path));
    setStagedForDeletion(prev => [...prev, ...filesToStage]);
    setScannedFiles(prev => prev.filter(f => !selectedFiles.has(f.path)));
    setSelectedFiles(new Set());
  };

<<<<<<< HEAD
<<<<<<< HEAD
  const stagedTotalMB = stagedForDeletion.reduce((total, file) => total + file.size, 0);

  const confirmEmptyBin = () => {
    if (stagedForDeletion.length === 0) return;
    setModalConfig({ 
      isOpen: true, 
      type: 'confirm', 
      title: 'Confirm Deletion', 
      message: `You are about to permanently delete ${stagedForDeletion.length} file(s).\n\nProceed?`, 
      onConfirm: executeDeletion 
    });
  };

  const executeDeletion = async () => {
    setModalConfig({ ...modalConfig, isOpen: false }); 
=======
=======
>>>>>>> 658b929 (Version 1.0)
  const handleEmptyBin = async () => {
    if (stagedForDeletion.length === 0) return;
    const isConfirmed = window.confirm(`WARNING: You are about to permanently delete ${stagedForDeletion.length} files from your device's storage.\n\nDo you want to proceed?`);
    if (!isConfirmed) return;
<<<<<<< HEAD
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
>>>>>>> 658b929 (Version 1.0)
    try {
      await fetch('http://127.0.0.1:5015/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: stagedForDeletion.map(f => f.path), permanent: true })
      });
<<<<<<< HEAD
<<<<<<< HEAD
      
      const newTotal = totalSavedMB + stagedTotalMB;
      setTotalSavedMB(newTotal);
      localStorage.setItem('dupclean_lifetime_saved', newTotal.toFixed(2));
      
      setStagedForDeletion([]);
      
      setTimeout(() => {
          setModalConfig({ isOpen: true, type: 'success', title: 'Success', message: 'Success! Files removed.' });
      }, 100);
      
    } catch (error) { 
      setModalConfig({ isOpen: true, type: 'error', title: 'Deletion Failed', message: error.message }); 
    }
=======
      setStagedForDeletion([]);
      alert("Success! Files have been permanently removed from your system.");
    } catch (error) { alert(`Failed to delete: ${error.message}`); }
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
      setStagedForDeletion([]);
      alert("Success! Files have been permanently removed from your system.");
    } catch (error) { alert(`Failed to delete: ${error.message}`); }
>>>>>>> 658b929 (Version 1.0)
  };

  const duplicateFiles = scannedFiles.filter(f => f.isDuplicate);
  const duplicateCount = duplicateFiles.length;
  const originalCount = scannedFiles.length - duplicateCount;
  const dupePercent = scannedFiles.length > 0 ? (duplicateCount / scannedFiles.length) * 100 : 0;
<<<<<<< HEAD
<<<<<<< HEAD
  const origPercent = scannedFiles.length > 0 ? (originalCount / scannedFiles.length) * 100 : 0;

  const currentSelectedMB = scannedFiles
    .filter(f => selectedFiles.has(f.path))
    .reduce((sum, f) => sum + f.size, 0);

  return (
    <div className={`app-container ${!isDarkMode ? 'light-mode' : ''}`}>
      <div className="top-bar-drag"></div>
      <div className="window-controls-right">
        <Minus className="win-ctrl" size={18} onClick={() => handleWindow('min')} />
        <Square className="win-ctrl" size={14} onClick={() => handleWindow('max')} />
        <X className="win-ctrl close" size={20} onClick={() => handleWindow('close')} />
      </div>

=======
  const origPercent = scannedFiles.length > 0 ? (originalCount / scannedFiles.length) * 100 : (scannedFiles.length === 0 ? 0 : 100);

  return (
    <div className="app-container">
      {/* DRAGGABLE TOP BAR */}
      <div className="top-bar-drag"></div>

=======
  const origPercent = scannedFiles.length > 0 ? (originalCount / scannedFiles.length) * 100 : (scannedFiles.length === 0 ? 0 : 100);

  return (
    <div className="app-container">
      {/* DRAGGABLE TOP BAR */}
      <div className="top-bar-drag"></div>

>>>>>>> 658b929 (Version 1.0)
      {/* WINDOW CONTROLS */}
      <div className="window-controls-right">
        <Minus className="win-ctrl" size={18} onClick={() => handleWindow('min')} />
        <Square className="win-ctrl" size={14} onClick={() => handleWindow('max')} />
        <X className="win-ctrl close" size={20} onClick={() => handleWindow('close')} />
      </div>

      {/* SIDEBAR */}
<<<<<<< HEAD
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
>>>>>>> 658b929 (Version 1.0)
      <div className="sidebar">
        <div className="nav-wrapper">
          <div className="nav-section">
            <p className="nav-label">MENU</p>
            <button className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
              <LayoutDashboard size={20} /> Dashboard
            </button>
<<<<<<< HEAD
<<<<<<< HEAD
            <button
              className={`nav-item delete-action-btn ${stagedForDeletion.length > 0 ? 'has-files' : ''}`}
              onClick={confirmEmptyBin}
=======
            <button 
              className={`nav-item delete-action-btn ${stagedForDeletion.length > 0 ? 'has-files' : ''}`} 
              onClick={handleEmptyBin}
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
            <button 
              className={`nav-item delete-action-btn ${stagedForDeletion.length > 0 ? 'has-files' : ''}`} 
              onClick={handleEmptyBin}
>>>>>>> 658b929 (Version 1.0)
              disabled={stagedForDeletion.length === 0}
            >
              <div className="delete-btn-left">
                <Trash2 size={20} />
<<<<<<< HEAD
<<<<<<< HEAD
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
                  <span>Permanent Delete</span>
                  {stagedForDeletion.length > 0 && <span style={{ fontSize: '11px', opacity: 0.8 }}>Recover {formatDynamicSize(stagedTotalMB)}</span>}
                </span>
              </div>
              {stagedForDeletion.length > 0 && <span className="delete-badge">{stagedForDeletion.length}</span>}
            </button>
          </div>
          
          <div className="nav-section">
            <p className="nav-label">STORAGE</p>
            <div className="storage-target" style={{ marginBottom: '15px' }}>
              <HardDrive size={20} color="#06b6d4" />
              <div className="target-info">
                <span>Current Target</span>
                <p>{selectedFolder ? selectedFolder.split('\\').pop() : "No folder selected"}</p>
              </div>
            </div>
            
            <div className="storage-target">
              <Archive size={20} color="#a855f7" />
              <div className="target-info">
                <span>Total Freed Up</span>
                <p style={{ color: '#a855f7', fontWeight: '700', margin: '2px 0 0 0' }}>{formatDynamicSize(totalSavedMB)}</p>
              </div>
            </div>
            
            <button 
              className="nav-item" 
              onClick={() => {
                setTotalSavedMB(0);
                localStorage.setItem('dupclean_lifetime_saved', '0');
                setModalConfig({ isOpen: true, type: 'info', title: 'Cache Reset', message: 'Storage tracker has been reset to 0.' });
              }}
              style={{ fontSize: '12px', color: '#64748b' }}
            >
              Reset Cache
            </button>
          </div>
          
          <div className="nav-section" style={{ marginTop: '20px' }}>
            <button 
              className={`nav-item ${view === 'big-fish' ? 'active' : ''}`} 
              onClick={handleBigFishScan}
              style={{ color: '#ff3366' }}
            >
              <Archive size={20} /> Big Fish Finder
            </button>
          </div>
          
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
        <div className="sidebar-about">
          <h4>DupClean Pro v2</h4>
          <p>Version 2.0.0</p>
        </div>
      </div>

      <div className="main-content">
        <div className="view-area">
          {view === 'dashboard' && (
            <div className="fade-in">
              <h1 className="hero-title">Dashboard</h1>
=======
=======
>>>>>>> 658b929 (Version 1.0)
                <span>Permanent Delete</span>
              </div>
              {stagedForDeletion.length > 0 && (
                <span className="delete-badge">{stagedForDeletion.length}</span>
              )}
            </button>
          </div>

          <div className="nav-section">
            <p className="nav-label">STORAGE</p>
            <div className="storage-target">
              <HardDrive size={20} color="#06b6d4" />
              <div className="target-info">
                <span>Current Target</span>
                <p>{selectedFolder ? selectedFolder.split('\\').pop() : "No folder selected"}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-about">
          <h4>DupClean Pro</h4>
          <p>Version 1.0.0</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="view-area">
          {view === 'dashboard' && (
            <div className="fade-in">
              <div className="header-flex">
                <h1 className="hero-title">Dashboard</h1>
              </div>

              {/* SMALLER, SLEEKER HERO BANNER */}
<<<<<<< HEAD
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
>>>>>>> 658b929 (Version 1.0)
              <div className="hero-banner modern-hero centered-hero">
                <div className="hero-content">
                  <h2 className="app-branding">DupClean Pro</h2>
                  <h3>Intelligent System Optimization</h3>
<<<<<<< HEAD
<<<<<<< HEAD
                  <p>Scan your drive to identify redundant files.</p>
                </div>
              </div>

              <div className="top-action-container" style={{ width: '100%', marginBottom: '24px', marginTop: '24px' }}>
                <button 
                  className="gradient-btn hero-action-btn" 
                  onClick={handleSelectFolder} 
                  style={{ width: '100%', padding: '16px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                  <Search size={22} /> Select Target Folder
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 className="section-title" style={{ margin: 0 }}>Categories</h3>
                <div style={{ display: 'flex', gap: '8px', background: '#1e293b', padding: '6px', borderRadius: '12px' }}>
                  <button className={`toggle-btn ${scanMode === 'exact' ? 'active-exact' : ''}`} onClick={() => setScanMode('exact')}><Search size={14} /> Exact Hash</button>
                  <button className={`toggle-btn ${scanMode === 'fuzzy' ? 'active-fuzzy' : ''}`} onClick={() => setScanMode('fuzzy')}><FileSearch size={14} /> Fuzzy Name</button>
                </div>
              </div>

              <div className="theme-panel" style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', borderLeft: scanMode === 'exact' ? '4px solid #06b6d4' : '4px solid #a855f7', transition: 'all 0.2s' }}>
                <p className="theme-text" style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
                  {scanMode === 'exact'
                    ? <><strong style={{ color: '#06b6d4' }}>Exact Hash:</strong> Scans files byte-by-byte to find 100% identical duplicates, even if their file names are different.</>
                    : <><strong style={{ color: '#a855f7' }}>Fuzzy Name:</strong> Finds files with very similar names or typos (e.g., 'Report_v1' and 'Report_Final'), ignoring their actual contents.</>
                  }
                </p>
              </div>

              <div className="modern-grid">
                <div className="card cyan" onClick={() => handleScan('Images')}><ImageIcon size={28} /><div className="card-text"><h4>Images</h4><p>{counts.Images} files</p></div></div>
                <div className="card blue" onClick={() => handleScan('Videos')}><Film size={28} /><div className="card-text"><h4>Videos</h4><p>{counts.Videos} files</p></div></div>
                <div className="card purple" onClick={() => handleScan('Documents')}><FileText size={28} /><div className="card-text"><h4>Docs</h4><p>{counts.Documents} files</p></div></div>
                <div className="card pink" onClick={() => handleScan('Audios')}><Music size={28} /><div className="card-text"><h4>Audio</h4><p>{counts.Audios} files</p></div></div>
                <div className="card others-card" onClick={() => handleScan('Others')}><Archive size={28} /><div className="card-text"><h4>Others</h4><p>{counts.Others} files</p></div></div>
              </div>
            </div>
          )}

          {view === 'analysis' && (
            <div className="fade-in">
              <button className="back-btn" onClick={() => setView('dashboard')}><ChevronLeft size={20} /> Back</button>
              <h1 className="hero-title">
                {currentCategory} Analysis
                <span style={{ fontSize: '14px', marginLeft: '12px', color: '#64748b', fontWeight: 'normal' }}>
                  ({scanMode === 'fuzzy' ? 'Fuzzy Name Matching' : 'MD5 Exact Match'})
                </span>
              </h1>
              {isScanning ? (
                <div className="loading-state">
                  <Loader2 className="spinner" size={48} color="#06b6d4" />
                  <h2>Analyzing {currentCategory}...</h2>
=======
                  <p>Scan your drive to identify redundant files and instantly reclaim your lost storage space.</p>
                  
                  {selectedFolder && (
                    <p className="target-path">Target: {selectedFolder}</p>
                  )}
                </div>
              </div>

=======
                  <p>Scan your drive to identify redundant files and instantly reclaim your lost storage space.</p>
                  
                  {selectedFolder && (
                    <p className="target-path">Target: {selectedFolder}</p>
                  )}
                </div>
              </div>

>>>>>>> 658b929 (Version 1.0)
              <h3 className="section-title">Categories</h3>
              <div className="modern-grid">
                <div className="card cyan" onClick={() => handleScan('Images')}>
                  <ImageIcon size={28} />
                  <div className="card-text">
                    <h4>Images</h4>
                    <p>{counts.Images} files</p>
                  </div>
                </div>
                <div className="card blue" onClick={() => handleScan('Videos')}>
                  <Film size={28} />
                  <div className="card-text">
                    <h4>Videos</h4>
                    <p>{counts.Videos} files</p>
                  </div>
                </div>
                <div className="card purple" onClick={() => handleScan('Documents')}>
                  <FileText size={28} />
                  <div className="card-text">
                    <h4>Documents</h4>
                    <p>{counts.Documents} files</p>
                  </div>
                </div>
                <div className="card pink" onClick={() => handleScan('Audios')}>
                  <Music size={28} />
                  <div className="card-text">
                    <h4>Audio</h4>
                    <p>{counts.Audios} files</p>
                  </div>
                </div>
              </div>

              {/* MOVED: ACTION BUTTON AT THE BOTTOM */}
              <div className="bottom-action-container">
                <button className="gradient-btn hero-action-btn" onClick={handleSelectFolder}>
                  <Search size={18} /> Scan Now / Select Folder
                </button>
              </div>

            </div>
          )}

          {/* ... (Analysis view remains identical) ... */}
          {view === 'analysis' && (
            <div className="fade-in">
              <button className="back-btn" onClick={() => setView('dashboard')}>
                <ChevronLeft size={20} /> Back
              </button>
              <h1 className="hero-title">{currentCategory} Analysis</h1>
              
              {isScanning ? (
                <div className="loading-state">
                  <Loader2 className="spinner" size={48} color="#06b6d4" />
                  <h2>Scanning deeply...</h2>
<<<<<<< HEAD
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
>>>>>>> 658b929 (Version 1.0)
                </div>
              ) : (
                <>
                  <div className="stats-row">
<<<<<<< HEAD
<<<<<<< HEAD
                    <div className="stat-card"><span>Unique</span><h3>{originalCount}</h3><div className="bar-bg"><div className="bar-fill blue" style={{ width: `${origPercent}%` }}></div></div></div>
                    <div className="stat-card"><span>Redundancies</span><h3 style={{ color: '#ff3366' }}>{duplicateCount}</h3><div className="bar-bg"><div className="bar-fill pink" style={{ width: `${dupePercent}%` }}></div></div></div>
                  </div>
                  <div className="list-container">
                    <div className="list-header">
                      <h3>Identified Duplicates</h3>
                      <div className="list-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        
                        {selectedFiles.size > 0 && (
                          <span style={{ fontSize: '13px', color: '#8A8D9F', fontWeight: '500', marginRight: '8px' }}>
                            {formatDynamicSize(currentSelectedMB)} Selected
                          </span>
                        )}

                        <div className="magic-wand-group">
                          <button className="magic-wand-btn" onClick={() => handleMagicWand('oldest')} title="Auto-select duplicates keeping oldest files">
                            <Clock size={14} /> Keep Oldest
                          </button>
                          <button className="magic-wand-btn" onClick={() => handleMagicWand('newest')} title="Auto-select duplicates keeping newest files">
                            <Zap size={14} /> Keep Newest
                          </button>
                        </div>

                        <button className="glass-btn" onClick={() => handleSelectAll(duplicateFiles)}><CheckSquare size={16} /> Select All</button>
                        {selectedFiles.size > 0 && <button className="gradient-btn" onClick={handleStageForDeletion}>Move {selectedFiles.size} to Bin</button>}
                      </div>
=======
                    <div className="stat-card">
                      <span>Unique Files</span>
                      <h3>{originalCount}</h3>
                      <div className="bar-bg"><div className="bar-fill blue" style={{width: `${origPercent}%`}}></div></div>
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
                    </div>
                    <div className="stat-card">
                      <span>Redundancies</span>
                      <h3 style={{color: '#ff3366'}}>{duplicateCount}</h3>
                      <div className="bar-bg"><div className="bar-fill pink" style={{width: `${dupePercent}%`}}></div></div>
                    </div>
                  </div>

<<<<<<< HEAD
                    <div className="file-list">
                      {duplicateFiles.map((file, idx) => {
                        const isImage = file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                        const isVideo = file.name.match(/\.(mp4|webm|ogg|mov|mkv)$/i);
                        const isAudio = file.name.match(/\.(mp3|wav|ogg|flac|aac)$/i);
                        const isPDF = file.name.match(/\.pdf$/i);
                        const isDocx = file.name.match(/\.docx$/i);

                        return (
                          <div key={idx} className={`file-row ${selectedFiles.has(file.path) ? 'selected' : ''}`} onClick={() => setPreviewImage({ path: file.path, name: file.name, isImage, isVideo, isAudio, isPDF, isDocx, size: file.size })}>
                            <input 
                              type="checkbox" 
                              checked={selectedFiles.has(file.path)} 
                              onClick={(e) => e.stopPropagation()} 
                              onChange={() => toggleFileSelection(file.path)} 
                            />
                            {isImage ? (
                                <img
                                  src={`file://${file.path}`}
                                  alt="thumbnail"
                                  style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #334155' }}
                                />
                            ) : (
                              <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                {isVideo ? <Film size={18} /> : isAudio ? <Music size={18} /> : <FileText size={18} />}
                              </div>
                            )}
=======
                  {duplicateCount > 0 && (
                    <div className="list-container">
                      <div className="list-header">
                        <h3>Identified Duplicates</h3>
                        <div className="list-actions">
                          <button className="glass-btn" onClick={() => handleSelectAll(duplicateFiles)}>
                            <CheckSquare size={16}/> {selectedFiles.size === duplicateFiles.length ? 'Deselect All' : 'Select All'}
                          </button>
                          {selectedFiles.size > 0 && (
                            <button className="gradient-btn" onClick={handleStageForDeletion}>
                              Move {selectedFiles.size} to Bin
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="file-list">
                        {duplicateFiles.map((file, idx) => (
                          <div key={idx} className={`file-row ${selectedFiles.has(file.path) ? 'selected' : ''}`} onClick={() => toggleFileSelection(file.path)}>
                            <input type="checkbox" checked={selectedFiles.has(file.path)} readOnly />
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
                            <div className="file-details">
                              <span className="file-name">{file.name}</span>
                              <span className="file-path">{file.path}</span>
                            </div>
                            <span className="file-size">{formatDynamicSize(file.size)}</span>
                          </div>
<<<<<<< HEAD
                        );
                      })}
                    </div>

                  </div>
                </>
              )}
            </div>
          )}

          {view === 'big-fish' && (
            <div className="fade-in">
              <button className="back-btn" onClick={() => setView('dashboard')}><ChevronLeft size={20} /> Back</button>
              <h1 className="hero-title">Big Fish Finder <span style={{ fontSize: '14px', marginLeft: '12px', color: '#64748b', fontWeight: 'normal' }}>(Top 50 Largest Files)</span></h1>
              
              {isScanning ? (
                <div className="loading-state">
                  <Loader2 className="spinner" size={48} color="#ff3366" />
                  <h2>Scanning for large files...</h2>
                </div>
              ) : (
                <>
                  <div className="list-container">
                    <div className="list-header">
                      <h3>Large Files (Select to Delete)</h3>
                      <div className="list-actions">
                        {selectedFiles.size > 0 && (
                          <span style={{ fontSize: '13px', color: '#8A8D9F', fontWeight: '500', marginRight: '8px' }}>
                            {formatDynamicSize(currentSelectedMB)} Selected
                          </span>
                        )}
                        
                        <div className="magic-wand-group">
                          <button className="magic-wand-btn" onClick={() => handleMagicWand('oldest')} title="Auto-select duplicates keeping oldest files">
                            <Clock size={14} /> Keep Oldest
                          </button>
                          <button className="magic-wand-btn" onClick={() => handleMagicWand('newest')} title="Auto-select duplicates keeping newest files">
                            <Zap size={14} /> Keep Newest
                          </button>
                        </div>

                        <button className="glass-btn" onClick={() => handleSelectAll(scannedFiles)}><CheckSquare size={16} /> Select All</button>
                        {selectedFiles.size > 0 && <button className="gradient-btn" onClick={handleStageForDeletion}>Move {selectedFiles.size} to Bin</button>}
                      </div>
                    </div>
                    
                    <div className="file-list">
                      {scannedFiles.map((file, idx) => {
                        const isImage = file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                        const isVideo = file.name.match(/\.(mp4|webm|ogg|mov|mkv)$/i);
                        const isAudio = file.name.match(/\.(mp3|wav|ogg|flac|aac)$/i);
                        const isPDF = file.name.match(/\.pdf$/i);
                        const isDocx = file.name.match(/\.docx$/i);

                        return (
                          <div key={idx} className={`file-row ${selectedFiles.has(file.path) ? 'selected' : ''}`} onClick={() => setPreviewImage({ path: file.path, name: file.name, isImage, isVideo, isAudio, isPDF, isDocx, size: file.size })}>
                            <input 
                              type="checkbox" 
                              checked={selectedFiles.has(file.path)} 
                              onClick={(e) => e.stopPropagation()} 
                              onChange={() => toggleFileSelection(file.path)} 
                            />
                            <div style={{ width: '36px', height: '36px', borderRadius: '6px', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                              {isImage ? <ImageIcon size={18} /> : isVideo ? <Film size={18} /> : isAudio ? <Music size={18} /> : <FileText size={18} />}
                            </div>
                            <div className="file-details">
                              <span className="file-name">{file.name}</span>
                              <span className="file-path">{file.path}</span>
                            </div>
                            <span className="file-size">{formatDynamicSize(file.size)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
=======
                        ))}
                      </div>
                    </div>
                  )}
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
                    <div className="stat-card">
                      <span>Unique Files</span>
                      <h3>{originalCount}</h3>
                      <div className="bar-bg"><div className="bar-fill blue" style={{width: `${origPercent}%`}}></div></div>
                    </div>
                    <div className="stat-card">
                      <span>Redundancies</span>
                      <h3 style={{color: '#ff3366'}}>{duplicateCount}</h3>
                      <div className="bar-bg"><div className="bar-fill pink" style={{width: `${dupePercent}%`}}></div></div>
                    </div>
                  </div>

                  {duplicateCount > 0 && (
                    <div className="list-container">
                      <div className="list-header">
                        <h3>Identified Duplicates</h3>
                        <div className="list-actions">
                          <button className="glass-btn" onClick={() => handleSelectAll(duplicateFiles)}>
                            <CheckSquare size={16}/> {selectedFiles.size === duplicateFiles.length ? 'Deselect All' : 'Select All'}
                          </button>
                          {selectedFiles.size > 0 && (
                            <button className="gradient-btn" onClick={handleStageForDeletion}>
                              Move {selectedFiles.size} to Bin
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="file-list">
                        {duplicateFiles.map((file, idx) => (
                          <div key={idx} className={`file-row ${selectedFiles.has(file.path) ? 'selected' : ''}`} onClick={() => toggleFileSelection(file.path)}>
                            <input type="checkbox" checked={selectedFiles.has(file.path)} readOnly />
                            <div className="file-details">
                              <span className="file-name">{file.name}</span>
                              <span className="file-path">{file.path}</span>
                            </div>
                            <span className="file-size">{file.size} MB</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
>>>>>>> 658b929 (Version 1.0)
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {modalConfig.isOpen && (
        <div className="custom-modal-overlay" onClick={closeModal}>
          <div className="custom-modal" onClick={e => e.stopPropagation()}>
            <div 
              className="custom-modal-header" 
              style={{ 
                color: (modalConfig.type === 'error' || modalConfig.type === 'confirm') ? '#ff3366' : '#06b6d4',
                justifyContent: 'center'
              }}
            >
              <h3>{modalConfig.title}</h3>
            </div>
            <p>{modalConfig.message}</p>
            <div className="custom-modal-actions">
              {modalConfig.type === 'confirm' ? (
                <>
                  <button className="btn-cancel" onClick={closeModal}>Cancel</button>
                  <button className="btn-danger" onClick={modalConfig.onConfirm}>
                    <Trash2 size={16} /> Yes, Delete
                  </button>
                </>
              ) : (
                <button 
                  className="btn-cancel" 
                  style={{ background: '#06b6d4', color: '#0b0d17', border: 'none', fontWeight: 'bold' }} 
                  onClick={closeModal}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setPreviewImage(null)}>

          <button style={{
            position: 'absolute', top: 30, right: 30, background: 'none', border: 'none',
            color: '#f8fafc', cursor: 'pointer'
          }} onClick={() => setPreviewImage(null)}>
            <X size={36} />
          </button>

          <div style={{ maxWidth: '90%', maxHeight: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }} onClick={e => e.stopPropagation()}>
            {previewImage.isImage && (
              <img
                src={`file://${previewImage.path}`}
                alt="Fullscreen Preview"
                style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
              />
            )}

            {previewImage.isVideo && (
              <video
                src={`file://${previewImage.path}`}
                controls
                autoPlay
                style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }}
              />
            )}

            {previewImage.isAudio && (
              <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '12px', textAlign: 'center', minWidth: '300px' }}>
                <Music size={48} color="#06b6d4" style={{ marginBottom: '15px' }} />
                <audio src={`file://${previewImage.path}`} controls autoPlay style={{ width: '100%' }} />
              </div>
            )}

            {previewImage.isPDF && (
              <embed
                src={`file://${previewImage.path}`}
                type="application/pdf"
                style={{ width: '85vw', height: '85vh', borderRadius: '8px', border: 'none' }}
              />
            )}

            {previewImage.isDocx && (
              <div 
                ref={docxContainerRef}
                style={{ 
                  width: '85vw', 
                  height: '85vh', 
                  backgroundColor: '#ffffff', 
                  borderRadius: '8px', 
                  overflowY: 'auto',
                  padding: '20px',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <Loader2 className="spinner" size={32} />
                  <span style={{ marginLeft: '10px' }}>Formatting document page layout...</span>
                </div>
              </div>
            )}

            {(!previewImage.isImage && !previewImage.isVideo && !previewImage.isAudio && !previewImage.isPDF && !previewImage.isDocx) && (
              previewImage.name.match(/\.(txt|csv|json|html|md|xml|log)$/i) ? (
                <iframe
                  src={`file://${previewImage.path}`}
                  title="Document Preview"
                  style={{ width: '85vw', height: '85vh', backgroundColor: '#ffffff', borderRadius: '8px', border: 'none' }}
                />
              ) : (
                <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '12px', textAlign: 'center', minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <FileText size={64} color="#06b6d4" />
                  <h3 style={{ color: '#f8fafc', margin: 0 }}>Preview Not Supported</h3>
                  <p style={{ color: '#94a3b8', margin: 0, maxWidth: '300px' }}>
                    This specific raw system asset configuration cannot be safely rendered inside the sandbox.
                  </p>
                </div>
              )
            )}

            <div style={{ color: '#f8fafc', background: 'rgba(30, 41, 59, 0.8)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', maxWidth: '80vw', wordBreak: 'break-all', textAlign: 'center' }}>
              {previewImage.name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;