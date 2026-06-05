import { app, BrowserWindow } from "electron";
import { createWindow } from "./window";
import { setupApp } from "./lib/setup";
import { registerAllHandlers } from "./ipc";
import AppDatabase from "./services/database";
import { updateElectronApp, UpdateSourceType } from "update-electron-app";

let db: AppDatabase;

const GITHUB_REPO_URL = "faisal-hendra/Reledger";

setupApp();

updateElectronApp({
  updateSource: {
    type: UpdateSourceType.ElectronPublicUpdateService,
    repo: GITHUB_REPO_URL,
  },
  updateInterval: "1 hour",
  logger: require("electron-log"),
});

app.whenReady().then(() => {
  db = new AppDatabase();
  registerAllHandlers(db);
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
