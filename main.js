// Modules to control application life and create native browser window
const {app, shell, BrowserWindow, Menu} = require('electron')
const path = require('path')
const fs = require('fs')

//hide the menu
Menu.setApplicationMenu(null)

function createWindow() {
    // Create the browser window.
    /*const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })*/

    // and load the index.html of the app.
    //mainWindow.loadFile('index.html')

    let runPath//path of exe file
    if (!app.isPackaged)
        //The length of str 'node_modules' is 12
        runPath = app.getPath("exe").substring(0, app.getPath("exe").length - app.getName().length - 12)//dev
    else
        runPath = app.getPath("exe").substring(0, app.getPath("exe").length - app.getName().length)//prod


    let appstatus_path = `${runPath}/appstatus.json`
    let appconfig_path = `${runPath}/appconfig.json`
    let darkCss_path = `${runPath}/dark.css`
    let globCss_path = `${runPath}/glob.css`

    let appstatus
    let appconfig
    let globCss
    let darkCss

    try {
        appstatus = JSON.parse(fs.readFileSync(appstatus_path, 'utf8'))
        appconfig = JSON.parse(fs.readFileSync(appconfig_path, 'utf8'))
        darkCss = fs.readFileSync(darkCss_path, 'utf8')
        globCss = fs.readFileSync(globCss_path, 'utf8')
    } catch (e) {
        console.log(e)
    }

    mainWindow = new BrowserWindow({
        width: appconfig.width,
        height: appconfig.height,
        resizable: appconfig.resizable,
        show: false
    })

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    //using system default browser to open link
    mainWindow.webContents.setWindowOpenHandler(details =>
        shell.openExternal(details.url)
    )

    if (appconfig.darkMode)
        mainWindow.webContents.on("dom-ready", async function () {
            await mainWindow.webContents.insertCSS(globCss)
            await mainWindow.webContents.insertCSS(darkCss)
        });

    mainWindow.webContents.on("did-finish-load", async function () {
        mainWindow.show()
    });

    mainWindow.loadURL(appstatus.url)//restore navi status

    mainWindow.on('close', () => {
        const url = mainWindow.webContents.getURL()
        //save url to status when still in to-do
        if (url.startsWith("https://to-do.live.com/tasks/")) {
            const json = {"url": url}
            fs.writeFileSync(appstatus_path, JSON.stringify(json), "utf8")
        }
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
