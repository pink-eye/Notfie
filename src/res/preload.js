const { contextBridge } = require('electron')
const fs = require('fs')
const AutoLaunch = require('auto-launch')

let isHiddenLaunch = null;

let AutoLauncher = new AutoLaunch({
	name: 'Notfie',
	isHidden: isHiddenLaunch,
});

const STORAGE_PATH = `${__dirname}\\storage\\storage.json`

contextBridge.exposeInMainWorld('API', {
	readStorage: async callback => {
		let readerStream = fs.createReadStream(STORAGE_PATH);
		readerStream.setEncoding('UTF8');
		readerStream.on('data', callback);
	},

	writeStorage: async data => {
		let writerStream = fs.createWriteStream(STORAGE_PATH);
		writerStream.write(JSON.stringify(data));
		writerStream.end();
		writerStream = null;
	},

	toggleAutoLauncher: async option => {
		option ? AutoLauncher.enable() : AutoLauncher.disable()
	},

	toggleMinimizedLaunch: async option => {
		option ? isHiddenLaunch = true : isHiddenLaunch = false
	}
});

