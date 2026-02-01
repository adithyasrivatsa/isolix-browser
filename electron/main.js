const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Debug Logging Setup
const logPath = path.join(app.getPath('userData'), 'startup_error.log');
function logError(error) {
  try {
    fs.appendFileSync(logPath, `${new Date().toISOString()}: ${error.stack || error}\n`);
  } catch (e) {
    // ignore logging errors
  }
}

process.on('uncaughtException', (error) => {
  logError('Uncaught Exception: ' + error);
});

let mainWindow;
let db;
let Database;

try {
  Database = require('better-sqlite3');
} catch (e) {
  logError('CRITICAL: Failed to load better-sqlite3. This is likely a native module mismatch. ' + e);
}

// Initialize database
// Initialize database
function initDatabase() {
  if (!Database) {
    logError('Skipping database init: better-sqlite3 module missing');
    return;
  }

  try {
    const dbPath = path.join(app.getPath('userData'), 'prism.db');
    db = new Database(dbPath);

    // Create tables
    db.exec(`
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      is_active INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS panels (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      color TEXT NOT NULL,
      partition_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

    // Create default workspace if none exists
    const workspaceCount = db.prepare('SELECT COUNT(*) as count FROM workspaces').get();
    if (workspaceCount.count === 0) {
      const workspaceId = 'w' + Date.now();
      db.prepare('INSERT INTO workspaces (id, name, is_active) VALUES (?, ?, 1)')
        .run(workspaceId, 'Default Workspace');

      // Add default Google panel
      const panelId = 'p' + Date.now();
      db.prepare('INSERT INTO panels (id, workspace_id, title, url, color, partition_id, position) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(panelId, workspaceId, 'Google', 'https://www.google.com', 'bg-blue-500', `panel_${panelId}`, 0);
    }

    console.log('Database initialized at:', dbPath);
  } catch (e) {
    logError('Database initialization error: ' + e);
  }
}


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true // Enable webview tags
    },
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#FF0000', // DEBUG: Red background to detect if HTML loads
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true
    }
  });

  // Debug: Renderer Event Listeners
  mainWindow.webContents.on('did-finish-load', () => {
    logError('Renderer: did-finish-load');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    const msg = `Renderer Failed to Load: ${errorDescription} (${errorCode})`;
    logError(msg);
    // dialog is not imported yet, so we use logError. 
    // We should import dialog at the top if we want popups.
  });

  mainWindow.webContents.on('crashed', () => {
    logError('Renderer: CRASHED');
  });

  // Load app
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    // Production Path Resolution Debugging
    const relativePath = path.join(__dirname, '../dist/index.html');
    const appPath = path.join(app.getAppPath(), 'dist/index.html');

    logError(`DEBUG: __dirname: ${__dirname}`);
    logError(`DEBUG: app.getAppPath(): ${app.getAppPath()}`);
    logError(`DEBUG: Trying relative path: ${relativePath}`);

    // Try relative path first
    mainWindow.loadFile(relativePath).catch(e => {
      logError(`Failed to load relative path: ${e}`);

      // Fallback to app path
      logError(`DEBUG: Trying fallback path: ${appPath}`);
      mainWindow.loadFile(appPath).catch(e2 => {
        logError(`Failed to load fallback path: ${e2}`);
      });
    });

    // Force detached dev tools
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

// IPC Handlers
ipcMain.handle('db:getWorkspaces', () => {
  const workspaces = db.prepare('SELECT * FROM workspaces ORDER BY created_at ASC').all();
  return workspaces;
});

ipcMain.handle('db:getActiveWorkspace', () => {
  const workspace = db.prepare('SELECT * FROM workspaces WHERE is_active = 1 LIMIT 1').get();
  return workspace;
});

ipcMain.handle('db:getPanels', (event, workspaceId) => {
  const panels = db.prepare('SELECT * FROM panels WHERE workspace_id = ? ORDER BY position ASC').all(workspaceId);
  return panels;
});

ipcMain.handle('db:createWorkspace', (event, { id, name }) => {
  // Set all workspaces to inactive
  db.prepare('UPDATE workspaces SET is_active = 0').run();
  // Create new workspace
  db.prepare('INSERT INTO workspaces (id, name, is_active) VALUES (?, ?, 1)').run(id, name);
  return { id, name, is_active: 1 };
});

ipcMain.handle('db:setActiveWorkspace', (event, id) => {
  db.prepare('UPDATE workspaces SET is_active = 0').run();
  db.prepare('UPDATE workspaces SET is_active = 1 WHERE id = ?').run(id);
  return true;
});

ipcMain.handle('db:renameWorkspace', (event, { id, name }) => {
  db.prepare('UPDATE workspaces SET name = ? WHERE id = ?').run(name, id);
  return true;
});

ipcMain.handle('db:deleteWorkspace', (event, id) => {
  db.prepare('DELETE FROM workspaces WHERE id = ?').run(id);
  db.prepare('DELETE FROM panels WHERE workspace_id = ?').run(id);
  return true;
});

ipcMain.handle('db:createPanel', (event, panel) => {
  const { id, workspace_id, title, url, color, partition_id, position } = panel;
  db.prepare('INSERT INTO panels (id, workspace_id, title, url, color, partition_id, position) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(id, workspace_id, title, url, color, partition_id, position);
  return panel;
});

ipcMain.handle('db:updatePanel', (event, { id, title, url }) => {
  db.prepare('UPDATE panels SET title = ?, url = ? WHERE id = ?').run(title, url, id);
  return true;
});

ipcMain.handle('db:deletePanel', (event, id) => {
  db.prepare('DELETE FROM panels WHERE id = ?').run(id);
  return true;
});

ipcMain.handle('db:updatePanelPositions', (event, updates) => {
  const stmt = db.prepare('UPDATE panels SET position = ? WHERE id = ?');
  const transaction = db.transaction((updates) => {
    for (const { id, position } of updates) {
      stmt.run(position, id);
    }
  });
  transaction(updates);
  return true;
});

ipcMain.handle('db:getSetting', (event, key) => {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? row.value : null;
});

ipcMain.handle('db:setSetting', (event, { key, value }) => {
  db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
  return true;
});

// Window controls
ipcMain.on('window:minimize', () => {
  mainWindow.minimize();
});

ipcMain.on('window:maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('window:close', () => {
  mainWindow.close();
});

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) db.close();
    app.quit();
  }
});

app.on('before-quit', () => {
  if (db) db.close();
});
