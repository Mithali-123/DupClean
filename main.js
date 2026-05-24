const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs'); 
const { spawn } = require('child_process');

if (process.platform === 'win32') {
    app.setAppUserModelId('DupClean Pro');
}

let mainWindow;
let pyProcess = null;

function createWindow() {
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 950,
    minHeight: 650,
<<<<<<< HEAD
<<<<<<< HEAD
    frame: false,
    show: false,
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // REQUIRED FALSE: Allows local file previews (PDFs/Images) to render
=======
    frame: false, // <--- THIS REMOVES THE DEFAULT WINDOW BAR
    titleBarStyle: 'hidden', // Helps with custom styling
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
=======
    frame: false, // <--- THIS REMOVES THE DEFAULT WINDOW BAR
    titleBarStyle: 'hidden', // Helps with custom styling
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
>>>>>>> 658b929 (Version 1.0)
    },
  });

<<<<<<< HEAD
<<<<<<< HEAD
  const indexPath = path.join(__dirname, 'frontend', 'dist', 'index.html');

  mainWindow.loadFile(indexPath).catch(err => {
      console.error("FAILED TO LOAD UI:", err);
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (app.isPackaged) {
    const pyPath = path.join(process.resourcesPath, 'backend', 'app.exe');
    
    if (fs.existsSync(pyPath)) {
        try { 
          pyProcess = spawn(pyPath, [], { 
              cwd: path.dirname(pyPath),
              stdio: 'ignore' 
          }); 
          
          pyProcess.on('error', (err) => {
              console.error("Backend Spawn Error:", err);
          });
        } catch (e) { 
          console.error("Backend Catch Error:", e); 
        }
    } else {
        console.error("CRITICAL: app.exe not found at", pyPath);
    }
  } else {
    const pyPath = path.join(__dirname, 'backend', 'app.py');
    if (fs.existsSync(pyPath)) {
        try { 
          pyProcess = spawn('python', [pyPath], { 
              cwd: path.dirname(pyPath),
              stdio: 'ignore' 
          }); 
          pyProcess.on('error', (err) => { console.error("Dev Backend Error:", err); });
        } catch (e) { 
          console.error("Dev Backend Error:", e); 
        }
    }
  }
}

ipcMain.on('window-min', () => mainWindow.minimize());
ipcMain.on('window-max', () => mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize());
ipcMain.on('window-focus', () => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
    }
});
ipcMain.on('window-close', () => {
    if (pyProcess) {
        if (process.platform === 'win32') {
            spawn('taskkill', ['/pid', pyProcess.pid, '/f', '/t']);
        } else {
            try { pyProcess.kill(); } catch(e) {}
        }
    }
    app.quit();
});

// HARDENED: Explicitly checks array length and cancellation
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
  if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
      return null; 
  }
  return result.filePaths[0];
=======
  if (app.isPackaged) {
    const pyPath = path.join(process.resourcesPath, 'backend', 'app.exe');
=======
  if (app.isPackaged) {
    const pyPath = path.join(process.resourcesPath, 'backend', 'app.exe');
>>>>>>> 658b929 (Version 1.0)
    try { pyProcess = spawn(pyPath); } catch (e) { console.log("Failed to start backend."); }
    mainWindow.loadFile(path.join(__dirname, 'frontend/dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }
}

// Custom Window Controls (Connects to our new React buttons)
ipcMain.on('window-min', () => mainWindow.minimize());
ipcMain.on('window-max', () => {
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
ipcMain.on('window-close', () => mainWindow.close());

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
  return result.canceled ? null : result.filePaths[0];
>>>>>>> 3372f3003fb32872509e4d7476ff7a5ccefb13c8
});

app.whenReady().then(createWindow);

app.on('will-quit', () => {
    if (pyProcess) {
        if (process.platform === 'win32') {
            spawn('taskkill', ['/pid', pyProcess.pid, '/f', '/t']);
        } else {
            try { pyProcess.kill(); } catch(e) {}
        }
    }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});