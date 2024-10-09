const { app, BrowserWindow, ipcMain } = require('electron');
const { v4: uuidv4 } = require('uuid');
const screenshot = require('screenshot-desktop');
const socket = require('socket.io-client')('http://192.168.217.10:5000');
let interval;
 const robot =require("robotjs");

socket.on('connect', () => {
    console.log('Socket connected');
});

socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
});

socket.on('disconnect', () => {
    console.log('Socket disconnected');
});

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.removeMenu();
    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('start-share', (event, arg) => {
    console.log('Start share event received');
    const uuid = uuidv4();
    socket.emit('join-message', uuid);
    event.reply('uuid', uuid);

    interval = setInterval(() => {
        screenshot().then((img) => {
            const imgStr = Buffer.from(img).toString('base64');

            const obj = {
                room: uuid,
                image: imgStr
            };

            socket.emit('screen-data', JSON.stringify(obj));
        }).catch((err) => {
            console.error('Screenshot error:', err);
        });
    }, 100);
});

ipcMain.on('stop-share', (event, arg) => {
    console.log('Stop share event received');
    clearInterval(interval);
});
