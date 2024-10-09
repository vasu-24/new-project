const { ipcRenderer } = require('electron');


const startScreenShare = () => {
    ipcRenderer.send('start-share'); 
};


const stopScreenShare = () => {
    ipcRenderer.send('stop-share'); 
};

document.getElementById('start-share').addEventListener('click', startScreenShare);


document.getElementById('stop-share').addEventListener('click', stopScreenShare);


ipcRenderer.on('uuid', (event, uuid) => {
    console.log('Screen share UUID:', uuid);
});
