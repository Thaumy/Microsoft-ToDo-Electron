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

    //this path resolver is deprecated because not working properly.
    /*
    let runPath//path of exe file
    if (!app.isPackaged)
        //The length of str 'node_modules' is 12
        runPath = app.getPath("exe").substring(0, app.getPath("exe").length - app.getName().length - 12)//dev
    else
        runPath = app.getPath("exe").substring(0, app.getPath("exe").length - app.getName().length)//prod
    */
    let appName = 'microsoft-todo-electron'
    let homePath = require('electron').app.getPath('home')
    let cfgPath = `${homePath}/.config/${appName}/cfg`

    let appStatusJsonPath = `${cfgPath}/appStatus.json`
    let appConfigJsonPath = `${cfgPath}/appConfig.json`
    let themeCssPath = `${cfgPath}/theme.css`
    let globCssPath = `${cfgPath}/glob.css`

    let appStatus
    let appConfig
    let themeCss
    let globCss

    try {
        appStatus = JSON.parse(fs.readFileSync(appStatusJsonPath, 'utf8'))
        appConfig = JSON.parse(fs.readFileSync(appConfigJsonPath, 'utf8'))
        themeCss = fs.readFileSync(themeCssPath, 'utf8')
        globCss = fs.readFileSync(globCssPath, 'utf8')
    } catch (e) {
        console.log(e)
        console.log('resolve custom cfg failed, apply default cfg.')

        appStatus = {"url": "https://to-do.live.com/tasks"}
        appConfig = {
            "width": 500,
            "height": 800,
            "resizable": false,
            "enableTheme": true
        }
        themeCss = ""
        globCss = ".o365cs-base .o365sx-button{background-color:#0000!important}._3XjCbKdKOEIOUJsh2GlYnZ.o365sx-appName{background-color:#0000!important}.o365sx-navbar{background-color:#00457b!important}.o365sx-appName{background:unset!important}.mectrl_commands{display:none}.officeApps{display:none!important}button#O365_MainLink_NavMenu{display:none}button#owaToDoButton{display:none}button#whatsnew{display:none}"

        fs.mkdir(cfgPath, {recursive: true}, () => {
        })
        fs.writeFileSync(appStatusJsonPath, JSON.stringify(appStatus), "utf8")
        fs.writeFileSync(appConfigJsonPath, JSON.stringify(appConfig), "utf8")
        fs.writeFileSync(themeCssPath, themeCss, "utf8")
        fs.writeFileSync(globCssPath, globCss, "utf8")
    }

    mainWindow = new BrowserWindow({
        width: appConfig.width,
        height: appConfig.height,
        resizable: appConfig.resizable,
        show: false
    })

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()

    //using system default browser to open link
    mainWindow.webContents.setWindowOpenHandler(details =>
        shell.openExternal(details.url)
    )

    mainWindow.webContents.on("dom-ready", async function () {
        await mainWindow.webContents.insertCSS(globCss)
        if (appConfig.enableTheme)
            await mainWindow.webContents.insertCSS(themeCss)
    });

    mainWindow.webContents.on("did-finish-load", async function () {
        mainWindow.show()
    });

    //mainWindow.loadURL(appstatus.url)//restore navi status

    mainWindow.loadURL("https://to-do.live.com/tasks/")//restore navi status

    mainWindow.on('close', () => {
        const url = mainWindow.webContents.getURL()
        //save url to status when still in to-do
        if (url.startsWith("https://to-do.live.com/tasks/")) {
            const json = {"url": url}
            fs.writeFileSync(appStatusJsonPath, JSON.stringify(json), "utf8")
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