const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let pyProcess = null;

function createWindow() {
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 950,
    minHeight: 650,
    frame: false, // <--- THIS REMOVES THE DEFAULT WINDOW BAR
    titleBarStyle: 'hidden', // Helps with custom styling
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    title: "DupClean Pro"
  });

  if (app.isPackaged) {
    const pyPath = path.join(process.resourcesPath, 'backend', 'app.exe');
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
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (pyProcess) pyProcess.kill();
  app.quit();
});