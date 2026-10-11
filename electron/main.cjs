const { app, BrowserWindow } = require("electron");
const { fork } = require("node:child_process");
const http = require("node:http");
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

  serverProcess.stderr?.on("data", (data) => {
    console.error(`[Next.js] ${data.toString()}`);
  });
}

function waitForServer(timeoutMs = 30000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      const request = http.get(`http://127.0.0.1:${port}`, (response) => {
        response.resume();
        resolve();
      });

      request.on("error", () => {
        if (Date.now() - startedAt >= timeoutMs) {
          reject(new Error(`Next.js server did not start within ${timeoutMs}ms.`));
          return;
        }

        setTimeout(check, 250);
      });
    };

    check();
  });
}

async function createWindow() {
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

  startNextServer();

  try {
    await waitForServer();
    await window.loadURL(`http://127.0.0.1:${port}`);
  } catch (error) {
    console.error("Misi Detektif Termometer could not start:", error);
    await window.loadURL(
      `data:text/html;charset=utf-8,${encodeURIComponent(
        "<h1>Misi Detektif Termometer</h1><p>Aplikasi gagal memulai server lokal. Silakan tutup dan coba lagi.</p>"
      )}`
    );
  }
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
