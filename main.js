const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let pyProcess = null; // Set to null by default

function createWindow() {
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 850,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Allows React to talk to your live Python terminal
    },
    title: "DupClean Pro"
  });

  // ONLY LAUNCH .EXE IF THE APP IS PUBLISHED
  if (app.isPackaged) {
    const pyPath = path.join(process.resourcesPath, 'app.exe');
    try { 
      pyProcess = spawn(pyPath); 
    } catch (e) { 
      console.log("Failed to start packaged backend."); 
    }
    mainWindow.loadFile(path.join(__dirname, 'frontend/dist/index.html'));
  } else {
    // DEVELOPMENT MODE: Do nothing with .exe, rely on user running python app.py
    mainWindow.loadURL('http://localhost:5173');
  }
}

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (pyProcess) pyProcess.kill();
  app.quit();
});