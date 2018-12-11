const { app, autoUpdater, ipcMain, Notification } = require('electron');
const os = require('os');

export default class AppUpdater {
  mainWindow: BrowserWindow;

  autoUpdater: autoUpdater;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.autoUpdater = autoUpdater;
  }

  setup() {
    const self = this;

    this.autoUpdater.on('checking-for-update', () => {
      console.log('checking-for-update');
    });
    this.autoUpdater.on('update-available', info => {
      console.log(`update-available: ${JSON.stringify(info)}`);
    });
    this.autoUpdater.on('update-not-available', info => {
      console.log(`update-not-available: ${JSON.stringify(info)}`);
    });
    this.autoUpdater.on('error', err => {
      console.log(`error: ${err}`);
    });
    this.autoUpdater.on('download-progress', progressObj => {
      let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
      logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
      logMessage = `${logMessage} (${progressObj.transferred}/${
        progressObj.total
      })`;
      console.log(logMessage);

      console.log(`download-progress: ${JSON.stringify(progressObj)}`);
    });
    this.autoUpdater.on('update-downloaded', info => {
      console.log(`update-downloaded: ${JSON.stringify(info)}`);

      const notification = new Notification({
        title: 'Update Downloaded',
        body:
          'An app update has been downloaded and will be applied the next time you start the app. Click here to restart the app now.'
      });

      notification.on('click', () => {
        self.autoUpdater.quitAndInstall();
      });

      notification.show();
    });
    ipcMain.on('quit-and-install-update', () => {
      console.log('doing the thing!');
      autoUpdater.quitAndInstall();
    });

    const feedUrl = `https://reactron-quick-start-nuts.herokuapp.com/update/${os.platform()}_${os.arch()}/${app.getVersion()}?filetype=zip`;
    console.log(feedUrl);

    this.autoUpdater.setFeedURL(feedUrl);
    this.autoUpdater.checkForUpdates();
  }
}
