import {
  screen,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  ipcMain,
  dialog,
  app,
} from 'electron';
import Store from 'electron-store';
const {download} = require('electron-dl');

export default (windowName: string, options: BrowserWindowConstructorOptions): BrowserWindow => {
  const key = 'window-state';
  const name = `window-state-${windowName}`;
  const store = new Store({ name });
  const defaultSize = {
    width: options.width,
    height: options.height,
  };
  let state = {};
  let win;

  const restore = () => store.get(key, defaultSize);

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
  };

  const ensureVisibleOnSomeDisplay = windowState => {
    const visible = screen.getAllDisplays().some(display => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    store.set(key, state);
  };

  state = ensureVisibleOnSomeDisplay(restore());

  const browserOptions: BrowserWindowConstructorOptions = {
    ...state,
    ...options,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      ...options.webPreferences,
    },
  };
  win = new BrowserWindow(browserOptions);
  win.on('close', saveState);

  ipcMain.on("download-single", (event, info) => {
    download(BrowserWindow.getAllWindows()[0], info.url, info.properties)
    .then((dl) => {
      win.webContents.send("download complete", dl.getSavePath())
    })
  })

  ipcMain.on("download-files", async (event, request) => {
    for (const track of request.tracks) {
      await download(BrowserWindow.getAllWindows()[0], track, {
        directory: request.path,
      }).catch((err) => {
        console.log(request.path, track)
        console.error(err)
      })
    }
  });

  ipcMain.on("folder-request", (event) => {
    dialog.showOpenDialog({properties: ['openDirectory']})
    .then((folder) => {
      app.setPath("downloads", folder.filePaths[0])
      event.reply('folder', folder.filePaths[0])
    })
    .catch((err) => console.error(err))
  })
  
  ipcMain.handle("get-folder", async (event) => {
    return app.getPath("downloads")
  })

  return win;
};
