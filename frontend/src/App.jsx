import React, { useState } from 'react';
import { 
  Settings, ChevronLeft, Trash2, Moon, Sun, 
  Image as ImageIcon, Film, FileText, Music, Loader2, CheckSquare
} from 'lucide-react';
import './App.css';

function App() {
  const [counts, setCounts] = useState({ Images: 0, Videos: 0, Documents: 0, Audios: 0 });
  const [view, setView] = useState('dashboard'); 
  const [darkMode, setDarkMode] = useState(true);
  const [scannedFiles, setScannedFiles] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  
  // --- NEW STATES FOR DELETION WORKFLOW ---
  const [selectedFiles, setSelectedFiles] = useState(new Set()); // Tracks checkboxes
  const [stagedForDeletion, setStagedForDeletion] = useState([]); // Tracks files moved to the Bin

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
          } catch (error) {
            console.log(`Background scan skipped for ${cat}`);
          }
        }
      }
    } else {
      alert("Please run the app through Electron to select folders.");
    }
  };

  const handleScan = async (category) => {
    if (!selectedFolder) {
      alert("Please select a folder using the 'Scan Now' button first!");
      return;
    }
    
    setCurrentCategory(category);
    setView('analysis'); 
    setIsScanning(true);
    setScannedFiles([]);
    setSelectedFiles(new Set()); // Clear selections on new scan
    
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
      alert(`Connection Error: Make sure app.py is running!\nDetails: ${error.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  // --- NEW: SELECTION LOGIC ---
  const toggleFileSelection = (path) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(path)) newSelection.delete(path);
    else newSelection.add(path);
    setSelectedFiles(newSelection);
  };

  const handleSelectAll = (duplicateFiles) => {
    if (selectedFiles.size === duplicateFiles.length) {
      setSelectedFiles(new Set()); // Deselect all
    } else {
      setSelectedFiles(new Set(duplicateFiles.map(f => f.path))); // Select all
    }
  };

  // --- NEW: MOVE TO BIN LOGIC ---
  const handleStageForDeletion = () => {
    const filesToStage = scannedFiles.filter(f => selectedFiles.has(f.path));
    
    // Add to our Trash Bin
    setStagedForDeletion(prev => [...prev, ...filesToStage]);
    
    // Remove them from the current view so the progress bars update!
    setScannedFiles(prev => prev.filter(f => !selectedFiles.has(f.path)));
    setSelectedFiles(new Set()); // Reset checkboxes
  };

  // --- NEW: ACTUAL DELETE LOGIC (Hits the Python Backend) ---
  // --- NEW: ACTUAL DELETE LOGIC (Hits the Python Backend) ---
  const handleEmptyBin = async () => {
    if (stagedForDeletion.length === 0) return;
    
    // Safety check pop-up
    if (!window.confirm(`Are you sure you want to permanently delete ${stagedForDeletion.length} files from your device? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5015/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          files: stagedForDeletion.map(f => f.path), 
          permanent: true 
        })
      });

      if (!response.ok) throw new Error("Delete request failed");
      
      // Success! Empty the bin in our UI.
      setStagedForDeletion([]);
      alert("Files successfully deleted from your storage!");

      // --- NEW: SILENTLY REFRESH DASHBOARD COUNTS ---
      if (selectedFolder) {
        const categories = ['Images', 'Videos', 'Documents', 'Audios'];
        for (let cat of categories) {
          try {
            const res = await fetch('http://127.0.0.1:5015/api/scan-category', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ path: selectedFolder, category: cat })
            });
            if (res.ok) {
              const data = await res.json();
              setCounts(prev => ({ ...prev, [cat]: data.count })); // Updates the dashboard numbers!
            }
          } catch (e) {
            console.log(`Failed to refresh count for ${cat}`);
          }
        }
      }
      
    } catch (error) {
      alert(`Failed to delete files: ${error.message}`);
    }
  };

  const totalFiles = scannedFiles.length;
  const duplicateFiles = scannedFiles.filter(f => f.isDuplicate);
  const duplicateCount = duplicateFiles.length;
  const originalCount = totalFiles - duplicateCount;
  
  const dupePercent = totalFiles > 0 ? (duplicateCount / totalFiles) * 100 : 0;
  const origPercent = totalFiles > 0 ? (originalCount / totalFiles) * 100 : (totalFiles === 0 ? 0 : 100);

  return (
    <div className={darkMode ? 'theme-dark' : 'theme-light'}>
      <div className="page-wrapper">
        
        {/* VIEW: DASHBOARD */}
        {view === 'dashboard' && (
          <div className="content-area">
            <div className="header-actions">
              <button className="nav-item-glass" onClick={() => setView('settings')}>
                <Settings size={20} /> Settings
              </button>
            </div>
            <h1 className="title-clean">DupClean Pro</h1>
            
            <div className="cat-grid">
              <div className="cat-card" onClick={() => handleScan('Images')}><ImageIcon color="#8b5cf6" /><h3>Images</h3><p className="count-highlight" style={{marginTop: '10px'}}>{counts.Images} Files</p></div>
              <div className="cat-card" onClick={() => handleScan('Videos')}><Film color="#06b6d4" /><h3>Videos</h3><p className="count-highlight" style={{marginTop: '10px'}}>{counts.Videos} Files</p></div>
              <div className="cat-card" onClick={() => handleScan('Documents')}><FileText color="#10b981" /><h3>Documents</h3><p className="count-highlight" style={{marginTop: '10px'}}>{counts.Documents} Files</p></div>
              <div className="cat-card" onClick={() => handleScan('Audios')}><Music color="#f59e0b" /><h3>Audios</h3><p className="count-highlight" style={{marginTop: '10px'}}>{counts.Audios} Files</p></div>
            </div>

            <div className="dock-container">
              <button className="scan-main-btn" onClick={handleSelectFolder}>
                {selectedFolder ? `Target: ${selectedFolder}` : "Scan Now / Select Folder"}
              </button>
            </div>
          </div>
        )}

        {/* VIEW: SETTINGS */}
        {view === 'settings' && (
           <div className="content-area">
            <button className="nav-item-glass" onClick={() => setView('dashboard')}>
              <ChevronLeft size={18} /> DASHBOARD
            </button>
            <div className="system-prefs-card">
              <h2 className="prefs-title">System Preferences</h2>
              <div className="pref-row">
                <span>Dark Mode Appearance</span>
                <button className="nav-item-glass" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </div>
              <div className="trash-bin-highlight">
                <div className="bin-text">
                  <h3>Permanent Delete Bin</h3>
                  {/* DYNAMIC BIN COUNT HERE */}
                  <p>{stagedForDeletion.length} files staged for deletion</p>
                </div>
                {/* WIRED UP THE TRASH BUTTON */}
                <button 
                  className="trash-confirm-btn" 
                  onClick={handleEmptyBin}
                  style={{ opacity: stagedForDeletion.length === 0 ? 0.5 : 1, cursor: stagedForDeletion.length === 0 ? 'not-allowed' : 'pointer' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="about-footer">
              <hr className="footer-divider" />
              <h3 className="footer-title">About</h3>
              <p className="footer-version">DupClean Pro V2.0</p>
              <p className="footer-desc">A professional workspace optimization assistant designed to safely remove redundant data.</p>
            </div>
          </div>
        )}

        {/* VIEW: ANALYSIS */}
        {view === 'analysis' && (
          <div className="content-area">
            <button className="nav-item-glass" onClick={() => setView('dashboard')}>
              <ChevronLeft size={18} /> BACK
            </button>
            
            <h1 className="title-clean" style={{fontSize: '3rem'}}>{currentCategory} Analysis</h1>
            
            {isScanning ? (
              <div style={{textAlign: 'center', marginTop: '50px'}}>
                <Loader2 className="spinning-icon" size={48} color="#8b5cf6" style={{animation: 'spin 1s linear infinite'}} />
                <h2>Scanning your storage...</h2>
                <p>Looking for duplicates deep in the files.</p>
              </div>
            ) : (
              <>
                <div className="analysis-stats-container">
                  <div className="stat-box">
                    <h3>Original Files</h3>
                    <p>{originalCount} unique items</p>
                    <div className="p-bar"><div className="fill orig" style={{ width: `${origPercent}%` }}></div></div>
                  </div>
                  <div className="stat-box">
                    <h3>Duplicate Files</h3>
                    <p style={{color: '#ef4444'}}>{duplicateCount} redundancies</p>
                    <div className="p-bar"><div className="fill dupe" style={{ width: `${dupePercent}%` }}></div></div>
                  </div>
                </div>

                {duplicateCount > 0 && (
                  <div className="file-list-container">
                    {/* NEW: HEADER ACTIONS (Select All & Delete) */}
                    <div className="list-header">
                      <h3>Identified Duplicates</h3>
                      <div className="list-actions">
                        <button className="nav-item-glass" onClick={() => handleSelectAll(duplicateFiles)}>
                          <CheckSquare size={16}/> {selectedFiles.size === duplicateFiles.length ? 'Deselect All' : 'Select All'}
                        </button>
                        {selectedFiles.size > 0 && (
                          <button className="delete-selected-btn" onClick={handleStageForDeletion}>
                            Move {selectedFiles.size} to Bin
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="file-list">
                      {duplicateFiles.map((file, idx) => (
                        <div key={idx} className={`file-row ${selectedFiles.has(file.path) ? 'selected' : ''}`} onClick={() => toggleFileSelection(file.path)}>
                          <div className="file-info">
                            {/* NEW: CHECKBOX IN ROW */}
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                              <input 
                                type="checkbox" 
                                checked={selectedFiles.has(file.path)} 
                                readOnly 
                                className="file-checkbox"
                              />
                              <span className="file-name">{file.name}</span>
                            </div>
                            <span className="file-size">{file.size} MB</span>
                          </div>
                          <span className="file-path">{file.path}</span>
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
  );
}

export default App;