const { app, BrowserWindow } = require("electron");
const { fork } = require("node:child_process");
const path = require("node:path");

const port = 3000;
let serverProcess;

function getServerPath() {
  return path.join(__dirname, "..", ".next", "standalone", "server.js");
}

function startNextServer() {
  serverProcess = fork(getServerPath(), [], {
    cwd: path.dirname(getServerPath()),
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      HOSTNAME: "127.0.0.1",
      NODE_ENV: "production",
      PORT: String(port),
    },
    silent: true,
  });

  serverProcess.on("error", (error) => {
    console.error("Next.js server failed to start:", error);
  });
}

async function createWindow() {
  startNextServer();

  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 1500));
  await window.loadURL(`http://127.0.0.1:${port}`);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (serverProcess) {
    serverProcess.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});
