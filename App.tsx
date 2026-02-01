import React, { useState, useRef, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Panel from './components/Panel';
import SplashScreen from './components/SplashScreen';
import QuickAccessDock from './components/QuickAccessDock';
import OnboardingTutorial from './components/OnboardingTutorial';
import AppLibraryModal from './components/AppLibraryModal';
import { PanelData, Workspace } from './types';
import { Plus, X, Maximize2, Minimize2, Minimize, LayoutGrid } from 'lucide-react';

const COLORS = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500'];

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.electronAPI;

const App: React.FC = () => {
  // Global States
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  // Global States (panels derived from activeWorkspace)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('');

  // UI States
  const [broadcastInput, setBroadcastInput] = useState('');
  const [showHeader, setShowHeader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hoverDelay, setHoverDelay] = useState<number>(500);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Initial Check for Onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('isolix_onboarding_completed');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('isolix_onboarding_completed', 'true');
  };

  // Track mouse position for header auto-hide (Legacy, but kept for future use)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setShowHeader(e.clientY < 20);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);


  // Load data from database on mount
  useEffect(() => {
    if (!isElectron) {
      console.warn('Not running in Electron environment');
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        // Load workspaces
        const dbWorkspaces = await window.electronAPI.getWorkspaces();

        // Load panels for each workspace
        const workspacesWithPanels = await Promise.all(
          dbWorkspaces.map(async (ws: any) => {
            const panels = await window.electronAPI.getPanels(ws.id);
            return {
              id: ws.id,
              name: ws.name,
              panels: panels.map((p: any) => ({
                id: p.id,
                title: p.title,
                url: p.url,
                type: 'browser' as const,
                color: p.color,
                partition_id: p.partition_id,
                position: p.position
              }))
            };
          })
        );

        setWorkspaces(workspacesWithPanels);

        // Set active workspace
        const activeWs = await window.electronAPI.getActiveWorkspace();
        if (activeWs) {
          setActiveWorkspaceId(activeWs.id);
        } else if (workspacesWithPanels.length > 0) {
          setActiveWorkspaceId(workspacesWithPanels[0].id);
        }

        // Load settings
        const savedHoverDelay = await window.electronAPI.getSetting('hoverDelay');
        if (savedHoverDelay) {
          setHoverDelay(parseInt(savedHoverDelay, 10));
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save hover delay when it changes
  useEffect(() => {
    if (isElectron && !isLoading) {
      window.electronAPI.setSetting({ key: 'hoverDelay', value: String(hoverDelay) });
    }
  }, [hoverDelay, isLoading]);

  const activeWorkspace = useMemo(() => {
    if (workspaces.length === 0) return null;
    return workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];
  }, [workspaces, activeWorkspaceId]);

  if (isLoading) {
    return (
      <main className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-500">
        <LayoutGrid className="animate-pulse mb-4" size={48} />
        <p>Loading Isolix...</p>
      </main>
    );
  }

  if (!activeWorkspace) {
    return (
      <main className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-500">
        <LayoutGrid className="animate-pulse mb-4" size={48} />
        <p>No workspace available</p>
      </main>
    );
  }

  const panels = activeWorkspace.panels;

  const updateActivePanels = (updateFn: (currentPanels: PanelData[]) => PanelData[]) => {
    setWorkspaces(prev => prev.map(w =>
      w.id === activeWorkspace.id ? { ...w, panels: updateFn(w.panels) } : w
    ));
  };

  // Workspace Actions
  const handleCreateWorkspace = async () => {
    const newId = `w${Date.now()}`;
    const newWorkspace: Workspace = {
      id: newId,
      name: `Workspace ${workspaces.length + 1}`,
      panels: []
    };

    if (isElectron) {
      await window.electronAPI.createWorkspace({ id: newId, name: newWorkspace.name });
    }

    setWorkspaces(prev => [...prev, newWorkspace]);
    setActiveWorkspaceId(newId);
  };

  const handleRenameWorkspace = async (id: string, newName: string) => {
    if (isElectron) {
      await window.electronAPI.renameWorkspace({ id, name: newName });
    }
    setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, name: newName } : w));
  };

  const handleDeleteWorkspace = async (id: string) => {
    if (workspaces.length <= 1) return;

    if (isElectron) {
      await window.electronAPI.deleteWorkspace(id);
    }

    const newWorkspaces = workspaces.filter(w => w.id !== id);
    setWorkspaces(newWorkspaces);

    if (activeWorkspaceId === id) {
      const newActiveId = newWorkspaces[0].id;
      setActiveWorkspaceId(newActiveId);
      if (isElectron) {
        await window.electronAPI.setActiveWorkspace(newActiveId);
      }
    }
  };

  const handleSwitchWorkspace = async (id: string) => {
    setActiveWorkspaceId(id);
    if (isElectron) {
      await window.electronAPI.setActiveWorkspace(id);
    }
  };

  // Panel Actions
  const handleOpenAddModal = () => {
    setNewTitle('');
    setNewUrl('');
    setIsModalOpen(true);
  };

  const handleOpenAppLibrary = () => {
    setIsLibraryOpen(true);
  };

  const createPanel = async (title: string, url: string) => {
    const newId = `p${Date.now()}`;
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const position = panels.length;
    const partitionId = `panel_${newId}`;

    // Normalize URL
    let finalUrl = url;
    if (!finalUrl.startsWith('http') && !finalUrl.startsWith('file://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const newPanel: PanelData = {
      id: newId,
      title: title,
      url: finalUrl,
      type: 'browser',
      color: randomColor,
      partition_id: partitionId,
      position
    };

    if (isElectron) {
      await window.electronAPI.createPanel({
        ...newPanel,
        workspace_id: activeWorkspace.id
      });
    }

    updateActivePanels(current => [...current, newPanel]);

    setTimeout(() => {
      const container = document.getElementById('panel-container');
      if (container) container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    }, 50);
  };

  const handleCreatePanel = async () => {
    if (!newTitle.trim()) return;
    // Default to Brave if generic
    await createPanel(newTitle, newUrl || 'https://search.brave.com');
    setIsModalOpen(false);
  };

  const handleRemovePanel = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (isElectron) {
      await window.electronAPI.deletePanel(id);
    }

    updateActivePanels(current => current.filter(p => p.id !== id));
  };

  const handleUpdateTitle = async (id: string, updatedTitle: string) => {
    const panel = panels.find(p => p.id === id);
    if (!panel) return;

    if (isElectron) {
      await window.electronAPI.updatePanel({ id, title: updatedTitle, url: panel.url });
    }

    updateActivePanels(current => current.map(p => p.id === id ? { ...p, title: updatedTitle } : p));
  };

  const handleUpdateUrl = async (id: string, updatedUrl: string) => {
    const panel = panels.find(p => p.id === id);
    if (!panel) return;

    if (isElectron) {
      await window.electronAPI.updatePanel({ id, title: panel.title, url: updatedUrl });
    }

    updateActivePanels(current => current.map(p => p.id === id ? { ...p, url: updatedUrl } : p));
  };

  // Drag and Drop Reordering
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId === targetId) return;

    const sourceIndex = panels.findIndex(p => p.id === draggedId);
    const targetIndex = panels.findIndex(p => p.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const newPanels = [...panels];
    const [removed] = newPanels.splice(sourceIndex, 1);
    newPanels.splice(targetIndex, 0, removed);

    // Update positions locally
    const updatedPanels = newPanels.map((p, index) => ({ ...p, position: index }));
    updateActivePanels(() => updatedPanels);

    // Update in DB (optional, but good for persistence)
    // Note: This would require a batch update API or loop. For prototype, local state is key.
  };


  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastInput.trim()) return;

    const lowerInput = broadcastInput.trim().toLowerCase();

    // Command Bar Logic: Check for direct service commands
    const serviceMap: Record<string, string> = {
      'google': 'https://google.com',
      'chatgpt': 'https://chatgpt.com',
      'claude': 'https://claude.ai',
      'perplexity': 'https://perplexity.ai',
      'youtube': 'https://youtube.com',
      'gmail': 'https://gmail.com'
    };

    if (serviceMap[lowerInput]) {
      const title = lowerInput.charAt(0).toUpperCase() + lowerInput.slice(1);
      createPanel(title, serviceMap[lowerInput]);
      setBroadcastInput('');
      return;
    }

    // Directed Broadcast Logic (@Target)
    const mentionRegex = /^(@\w+\s?)+/i;
    const match = broadcastInput.match(mentionRegex);

    let targetPanels = panels; // Default to all panels
    let messageToSend = broadcastInput;

    if (match) {
      const prefix = match[0].trim(); // e.g., "@hero @google"
      const names = prefix.split(' ').map(s => s.slice(1).toLowerCase());

      // Filter panels that match the names (case insensitive)
      const foundPanels = panels.filter(p => names.includes(p.title.toLowerCase()));

      if (foundPanels.length > 0) {
        targetPanels = foundPanels;
        messageToSend = broadcastInput.slice(prefix.length).trim();
      }
    }

    // Send broadcast message to target panels
    targetPanels.forEach((panel) => {
      // Robust selector to find the active webview
      const webview = document.querySelector(`webview[partition="persist:${panel.partition_id}"]`) as any;

      if (webview) {
        // Execute robust script
        webview.executeJavaScript(`
          (function() {
            function typeInElement(el, text) {
               if (!el) return false;
               
               // Focus the element
               el.focus();
               
               // Set value
               const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
               const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;

               if (el.tagName === 'INPUT' && nativeInputValueSetter) {
                  nativeInputValueSetter.call(el, text);
               } else if (el.tagName === 'TEXTAREA' && nativeTextAreaValueSetter) {
                  nativeTextAreaValueSetter.call(el, text);
               } else {
                  el.value = text;
                  el.textContent = text;
               }

               // Dispatch events
               el.dispatchEvent(new Event('input', { bubbles: true }));
               el.dispatchEvent(new Event('change', { bubbles: true }));
               
               // Try Enter key for search boxes
               // el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, bubbles: true }));
               
               return true;
            }

            // 1. Try currently active element
            if (document.activeElement && 
                (document.activeElement.tagName === 'INPUT' || 
                 document.activeElement.tagName === 'TEXTAREA' || 
                 document.activeElement.isContentEditable)) {
                return typeInElement(document.activeElement, '${messageToSend.replace(/'/g, "\\'")}');
            }

            // 2. Try identifying main search inputs
            const searchInput = document.querySelector('input[type="search"], input[type="text"], textarea');
            if (searchInput) {
               return typeInElement(searchInput, '${messageToSend.replace(/'/g, "\\'")}');
            }
          })();
        `).catch((err: any) => console.error('Broadcast error for ' + panel.title, err));
      }
    });

    setBroadcastInput('');
  };

  // Hover Logic
  const handleHover = (id: string | null) => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (id === null) {
      setHoveredId(null);
    } else {
      hoverTimerRef.current = setTimeout(() => {
        setHoveredId(id);
      }, hoverDelay);
    }
  };

  const getPanelWidthClass = (id: string) => {
    // Disable hover expansion if only one panel
    if (panels.length === 1) {
      return 'flex-1';
    }

    const isScrollMode = panels.length > 3;
    if (isScrollMode) {
      if (hoveredId === id) return 'flex-none w-[60vw]';
      if (hoveredId) return 'flex-none w-[16vw]';
      return 'flex-none w-[calc((100vw-4rem)/3)]';
    } else {
      if (hoveredId === id) return 'flex-[5]';
      if (hoveredId) return 'flex-[1]';
      return 'flex-1';
    }
  };

  return (
    <div className="h-screen w-screen bg-[#020617] text-slate-200 flex flex-col overflow-hidden font-sans selection:bg-cyan-500/30">

      {/* Overlays */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && showOnboarding && <OnboardingTutorial onComplete={handleOnboardingComplete} />}
      <AppLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onLaunch={createPanel}
      />

      {/* Persistence Logic (Invisible) */}
      {isElectron && (
        <div className="absolute top-0 right-0 z-50 flex gap-2 p-2 drag-region">
          <button
            onClick={() => window.electronAPI.minimizeWindow()}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Minimize2 size={14} />
          </button>
          <button
            onClick={() => window.electronAPI.maximizeWindow()}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={() => window.electronAPI.closeWindow()}
            className="p-1 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <Sidebar
        workspaces={workspaces}
        activeId={activeWorkspace.id}
        onSwitch={handleSwitchWorkspace}
        onCreate={handleCreateWorkspace}
        onRename={handleRenameWorkspace}
        onDelete={handleDeleteWorkspace}
      />

      {/* Panels Area - Full Height now */}
      <div
        id="panel-container"
        className="flex-1 w-full p-4 pb-24 flex items-center relative overflow-x-auto overflow-y-hidden transition-all duration-500 gap-3"
      >
        {panels.map((panel) => (
          <div
            key={panel.id}
            draggable
            onDragStart={(e) => handleDragStart(e, panel.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, panel.id)}
            className={`${getPanelWidthClass(panel.id)} h-full transition-all duration-500 ease-in-out`}
          >
            <Panel
              data={panel}
              isActive={hoveredId === panel.id}
              isDimmed={hoveredId !== null && hoveredId !== panel.id}
              widthClass="w-full h-full" // width handled by wrapper now for smoothness
              onHover={handleHover}
              onRemove={handleRemovePanel}
              onUpdateTitle={handleUpdateTitle}
              onUpdateUrl={handleUpdateUrl}
            />
          </div>
        ))}

        {/* Empty State */}
        {panels.length === 0 && (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 animate-pulse">
            <LayoutGrid size={64} className="mb-6 opacity-20" />
            <p className="text-slate-500 font-medium">No sites open</p>
            <button
              onClick={handleOpenAddModal}
              className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm font-bold tracking-wide flex items-center gap-2"
            >
              <Plus size={16} />
              Open Command Center
            </button>
          </div>
        )}
        {panels.length > 3 && <div className="min-w-[1rem] flex-none" />}
      </div>

      {/* Quick Access Dock - Bottom Fixed */}
      <QuickAccessDock
        onBroadcast={handleBroadcast}
        broadcastInput={broadcastInput}
        setBroadcastInput={setBroadcastInput}
        createPanel={createPanel}
        onOpenAddModal={handleOpenAddModal}
        onOpenAppLibrary={handleOpenAppLibrary}
        hoverDelay={hoverDelay}
        setHoverDelay={setHoverDelay}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-sm scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-200">Open Website</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Site Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. ChatGPT"
                  autoFocus
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePanel()}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">URL</label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePanel()}
                />
              </div>
              <button
                onClick={handleCreatePanel}
                disabled={!newTitle.trim()}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg shadow-lg"
              >
                Launch Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;