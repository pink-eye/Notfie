const { app, BrowserWindow, Menu, Tray } = require('electron')
const fs = require('fs')
const electron = require('electron')
const path = require('path')
const globalShortcut = electron.globalShortcut

app.disableHardwareAcceleration();

if (require('electron-squirrel-startup'))
	app.quit();

let isAppQuitting = false
let win = null
let tray = null
let storage = null

const ICONS_PATH = `assets\\icons`

let icon = null
switch (process.platform) {
	case 'win32': icon = path.resolve(__dirname, ICONS_PATH, 'icon.ico'); break;
	case 'darwin': icon = path.resolve(__dirname, ICONS_PATH, 'icon.icns'); break;
	case 'linux': icon = path.resolve(__dirname, ICONS_PATH, 'icon.png'); break;
}

const readStorage = () => {
	fs.readFile(path.join(__dirname, 'storage/storage.json'), 'utf-8', (err, data) => {
		if (err) return;
		storage = JSON.parse(data)
	});
}

const createTray = () => {
	if (!tray) {
		tray = new Tray(icon)
		tray.setToolTip('Notfie')
		tray.on('click', () => {
			win.isMinimized()
				? win.show()
				: win.minimize()
		})
		const contextMenu = Menu.buildFromTemplate([
			{ label: 'Show app', click: () => { win.show() } },
			{ label: 'Quick app', click: () => { app.exit() } }
		])
		tray.setContextMenu(contextMenu)
	}
}

const createWindow = () => {
	win = new BrowserWindow({
		icon,
		frame: false,
		fullscreen: true,
		offscreen: false,
		contextIsolation: true,
		backgroundColor: '#38C',
		enableRemoteModule: false,
		minWidth: 320,
		webPreferences: {
			preload: `${__dirname}\\preload.js`,
			show: false,
			devTools: true,
		}
	});
	win.loadFile(path.join(__dirname, 'index.html'));
	createTray();

	win.once('ready-to-show', () => {
		storage.settings.launchMinimized
			? win.minimize()
			: win.show()
	});

	win.on('show', () => {
		win.setSkipTaskbar(false)
	})

	win.on('minimize', () => {
		win.setSkipTaskbar(true)
	})

	win.on('close', e => {
		if (!isAppQuitting) {
			e.preventDefault();
			win.minimize()
		}
	});
};

app.on('will-finish-launching', readStorage)

app.on('ready', () => {
	createWindow();

	globalShortcut.register("CmdOrCtrl + Alt + T", () => { win.show() });
});

app.on('before-quit', () => {
	isAppQuitting = true;
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0)
		createWindow();
});

