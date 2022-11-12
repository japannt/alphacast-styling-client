const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1000,
		height: 600,
		autoHideMenuBar: true,
	webPreferences: {
			preload: path.join(__dirname, './js/preload.js')
		}
	})
  
	// win.removeMenu()
	win.loadFile('./html/index.html')
}
app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if(BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if(process.platform !== 'darwin') app.quit()
})