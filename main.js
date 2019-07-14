'use strict';

const electron = require('electron');

const DEV_MODE = process.env.NODE_ENV === 'development';

let mainWindow;

const createWindow = function createWindow() {
  mainWindow = new electron.BrowserWindow({
    title:      'To The End',
    width:      1600,
    height:     900,
    fullscreen: !DEV_MODE,
    frame:      DEV_MODE,
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  if (DEV_MODE) {
    mainWindow.openDevTools();
  }

  mainWindow.on('closed', function onClosed() {
    mainWindow = null;
  });
};

electron.app.on('ready', createWindow);

electron.app.on('window-all-closed', function onWindowAllClosed() {
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});

electron.app.on('activate', function onActivate() {
  if (!mainWindow) {
    createWindow();
  }
});
