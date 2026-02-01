const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Database operations
    getWorkspaces: () => ipcRenderer.invoke('db:getWorkspaces'),
    getActiveWorkspace: () => ipcRenderer.invoke('db:getActiveWorkspace'),
    getPanels: (workspaceId) => ipcRenderer.invoke('db:getPanels', workspaceId),

    createWorkspace: (data) => ipcRenderer.invoke('db:createWorkspace', data),
    setActiveWorkspace: (id) => ipcRenderer.invoke('db:setActiveWorkspace', id),
    renameWorkspace: (data) => ipcRenderer.invoke('db:renameWorkspace', data),
    deleteWorkspace: (id) => ipcRenderer.invoke('db:deleteWorkspace', id),

    createPanel: (panel) => ipcRenderer.invoke('db:createPanel', panel),
    updatePanel: (data) => ipcRenderer.invoke('db:updatePanel', data),
    deletePanel: (id) => ipcRenderer.invoke('db:deletePanel', id),
    updatePanelPositions: (updates) => ipcRenderer.invoke('db:updatePanelPositions', updates),

    getSetting: (key) => ipcRenderer.invoke('db:getSetting', key),
    setSetting: (data) => ipcRenderer.invoke('db:setSetting', data),

    // Window controls
    minimizeWindow: () => ipcRenderer.send('window:minimize'),
    maximizeWindow: () => ipcRenderer.send('window:maximize'),
    closeWindow: () => ipcRenderer.send('window:close')
});
