// Type declarations for Electron API exposed via preload script
export { };

declare global {
    interface Window {
        electronAPI: {
            // Database operations
            getWorkspaces: () => Promise<Workspace[]>;
            getActiveWorkspace: () => Promise<Workspace | null>;
            getPanels: (workspaceId: string) => Promise<Panel[]>;

            createWorkspace: (data: { id: string; name: string }) => Promise<Workspace>;
            setActiveWorkspace: (id: string) => Promise<boolean>;
            renameWorkspace: (data: { id: string; name: string }) => Promise<boolean>;
            deleteWorkspace: (id: string) => Promise<boolean>;

            createPanel: (panel: Panel) => Promise<Panel>;
            updatePanel: (data: { id: string; title: string; url: string }) => Promise<boolean>;
            deletePanel: (id: string) => Promise<boolean>;
            updatePanelPositions: (updates: Array<{ id: string; position: number }>) => Promise<boolean>;

            getSetting: (key: string) => Promise<string | null>;
            setSetting: (data: { key: string; value: string }) => Promise<boolean>;

            // Window controls
            minimizeWindow: () => void;
            maximizeWindow: () => void;
            closeWindow: () => void;
        };
    }

    interface Workspace {
        id: string;
        name: string;
        is_active: number;
        created_at?: number;
    }

    interface Panel {
        id: string;
        workspace_id: string;
        title: string;
        url: string;
        color: string;
        partition_id: string;
        position: number;
    }
}
