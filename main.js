require('update-electron-app')();
const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let pyProcess = null;

function createWindow() {
  // Completely removes the top file/edit menu
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 950,
    minHeight: 650,
    frame: false,           // REMOVES THE WINDOW BORDER
    autoHideMenuBar: true,  // HIDES THE MENU BAR FOREVER
    titleBarStyle: 'hidden', 
    icon: path.join(__dirname, 'icon.ico'),
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