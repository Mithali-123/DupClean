import React, { useState } from 'react';
import { 
  ChevronLeft, Trash2, CheckSquare,
  Search, Image as ImageIcon, Film, FileText, Music, Loader2,
  LayoutDashboard, HardDrive, X, Square, Minus
} from 'lucide-react';
import './App.css';

function App() {
  const [counts, setCounts] = useState({ Images: 0, Videos: 0, Documents: 0, Audios: 0 });
  const [view, setView] = useState('dashboard'); 
  const [scannedFiles, setScannedFiles] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [stagedForDeletion, setStagedForDeletion] = useState([]);

  // Window Controls
  const handleWindow = (action) => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send(`window-${action}`);
    }
  };

  const handleSelectFolder = async () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      const folderPath = await ipcRenderer.invoke('select-folder');
      if (folderPath) {
        setSelectedFolder(folderPath);
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
      }
    }
  };

  const handleScan = async (category) => {
    if (!selectedFolder) { alert("Please select a target folder first."); return; }
    setCurrentCategory(category);
    setView('analysis'); 
    setIsScanning(true);
    setScannedFiles([]);
    setSelectedFiles(new Set());
    try {
      const response = await fetch('http://127.0.0.1:5015/api/scan-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedFolder, category }) 
      });
      if (!response.ok) throw new Error(`Server Code: ${response.status}`);
      const data = await response.json();
      setScannedFiles(data.files);
    } catch (error) {
      alert(`Connection Error: ${error.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  const toggleFileSelection = (path) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(path)) newSelection.delete(path);
    else newSelection.add(path);
    setSelectedFiles(newSelection);
  };

  const handleSelectAll = (duplicateFiles) => {
    if (selectedFiles.size === duplicateFiles.length) setSelectedFiles(new Set());
    else setSelectedFiles(new Set(duplicateFiles.map(f => f.path)));
  };

  const handleStageForDeletion = () => {
    const filesToStage = scannedFiles.filter(f => selectedFiles.has(f.path));
    setStagedForDeletion(prev => [...prev, ...filesToStage]);
    setScannedFiles(prev => prev.filter(f => !selectedFiles.has(f.path)));
    setSelectedFiles(new Set());
  };

  const handleEmptyBin = async () => {
    if (stagedForDeletion.length === 0) return;
    const isConfirmed = window.confirm(`WARNING: You are about to permanently delete ${stagedForDeletion.length} files from your device's storage.\n\nDo you want to proceed?`);
    if (!isConfirmed) return;
    try {
      await fetch('http://127.0.0.1:5015/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: stagedForDeletion.map(f => f.path), permanent: true })
      });
      setStagedForDeletion([]);
      alert("Success! Files have been permanently removed from your system.");
    } catch (error) { alert(`Failed to delete: ${error.message}`); }
  };

  const duplicateFiles = scannedFiles.filter(f => f.isDuplicate);
  const duplicateCount = duplicateFiles.length;
  const originalCount = scannedFiles.length - duplicateCount;
  const dupePercent = scannedFiles.length > 0 ? (duplicateCount / scannedFiles.length) * 100 : 0;
  const origPercent = scannedFiles.length > 0 ? (originalCount / scannedFiles.length) * 100 : (scannedFiles.length === 0 ? 0 : 100);

  return (
    <div className="app-container">
      {/* DRAGGABLE TOP BAR */}
      <div className="top-bar-drag"></div>

      {/* WINDOW CONTROLS */}
      <div className="window-controls-right">
        <Minus className="win-ctrl" size={18} onClick={() => handleWindow('min')} />
        <Square className="win-ctrl" size={14} onClick={() => handleWindow('max')} />
        <X className="win-ctrl close" size={20} onClick={() => handleWindow('close')} />
      </div>

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="nav-wrapper">
          <div className="nav-section">
            <p className="nav-label">MENU</p>
            <button className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
              <LayoutDashboard size={20} /> Dashboard
            </button>
            <button 
              className={`nav-item delete-action-btn ${stagedForDeletion.length > 0 ? 'has-files' : ''}`} 
              onClick={handleEmptyBin}
              disabled={stagedForDeletion.length === 0}
            >
              <div className="delete-btn-left">
                <Trash2 size={20} />
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
              <div className="hero-banner modern-hero centered-hero">
                <div className="hero-content">
                  <h2 className="app-branding">DupClean Pro</h2>
                  <h3>Intelligent System Optimization</h3>
                  <p>Scan your drive to identify redundant files and instantly reclaim your lost storage space.</p>
                  
                  {selectedFolder && (
                    <p className="target-path">Target: {selectedFolder}</p>
                  )}
                </div>
              </div>

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
                </div>
              ) : (
                <>
                  <div className="stats-row">
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
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;