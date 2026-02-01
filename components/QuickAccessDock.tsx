import React, { useState } from 'react';
import { MessageSquare, Radio, Sparkles, Github, Mail, Globe, Cloud, Plus, Settings, Search, Youtube, LayoutGrid } from 'lucide-react';

interface QuickAccessDockProps {
  onBroadcast: (e: React.FormEvent) => void;
  broadcastInput: string;
  setBroadcastInput: (val: string) => void;
  createPanel: (title: string, url: string) => void;
  onOpenAddModal: () => void;
  onOpenAppLibrary: () => void;
  hoverDelay: number;
  setHoverDelay: (val: number) => void;
}

const QuickAccessDock: React.FC<QuickAccessDockProps> = ({
  onBroadcast,
  broadcastInput,
  setBroadcastInput,
  createPanel,
  onOpenAddModal,
  onOpenAppLibrary,
  hoverDelay,
  setHoverDelay
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const apps = [
    { name: 'Brave', url: 'https://search.brave.com/?lang=en-in', icon: Globe, color: 'text-orange-400' },
    { name: 'YouTube', url: 'https://youtube.com', icon: Youtube, color: 'text-red-500' },
    { name: 'ChatGPT', url: 'https://chatgpt.com', icon: Sparkles, color: 'text-emerald-400' },
    { name: 'Notion', url: 'https://notion.so', icon: Cloud, color: 'text-stone-200' },
    { name: 'GitHub', url: 'https://github.com/codespaces', icon: Github, color: 'text-purple-400' },
  ];

  return (
    <div className="w-full flex justify-center px-4 py-4 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent absolute bottom-0 z-50">
      <div className="
        flex items-center gap-4 p-2 pl-3 pr-3
        bg-[#0f172a]/80 backdrop-blur-2xl border border-slate-700/50 
        rounded-2xl shadow-2xl shadow-black/80
        transition-all duration-300
        hover:bg-[#0f172a]/95 hover:border-slate-600
        max-w-4xl w-full
      ">

        {/* App Launcher (Waffle) */}
        <button
          onClick={onOpenAppLibrary}
          className="p-2.5 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-xl transition-all shadow-lg group mr-2"
          title="App Library"
        >
          <LayoutGrid size={18} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Quick Apps (Left) */}
        <div className="flex items-center gap-2 border-r border-slate-700/50 pr-4">
          {apps.map((app) => (
            <button
              key={app.name}
              onClick={() => createPanel(app.name, app.url)}
              className="p-2 hover:bg-slate-700/50 rounded-xl transition-all hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/10 group relative"
              title={`Launch ${app.name}`}
            >
              <app.icon size={18} className={`${app.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
            </button>
          ))}
        </div>

        {/* Broadcast / Search Input (Center - Flexible) */}
        <form
          onSubmit={onBroadcast}
          className="flex-1 flex items-center gap-3 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700/30 hover:border-slate-600/50 rounded-xl px-4 py-2.5 transition-all group focus-within:ring-1 focus-within:ring-cyan-500/30 focus-within:bg-slate-800"
        >
          <Search size={16} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            value={broadcastInput}
            onChange={(e) => setBroadcastInput(e.target.value)}
            placeholder="Search or broadcast..."
            className="bg-transparent border-none outline-none text-slate-200 text-sm flex-1 placeholder-slate-500 font-medium h-5"
          />
          {broadcastInput && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-cyan-500/80 bg-cyan-950/30 px-1.5 py-0.5 rounded">
                {broadcastInput.startsWith('@') ? 'Direct' : 'Broadcast'}
              </span>
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-500 text-white p-1 rounded-md transition-all"
              >
                <MessageSquare size={12} fill="currentColor" />
              </button>
            </div>
          )}
        </form>

        {/* Controls (Right) */}
        <div className="flex items-center gap-2 border-l border-slate-700/50 pl-4">

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span className="hidden sm:inline">Add</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl transition-all ${showSettings ? 'bg-slate-700 text-cyan-400' : 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-200'}`}
              title="Settings"
            >
              <Settings size={18} />
            </button>

            {/* Settings Popover */}
            {showSettings && (
              <div className="absolute bottom-full right-0 mb-4 w-64 bg-[#0f172a] border border-slate-700 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-2 fade-in">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hover Sensitivity</span>
                  <span className="text-xs font-mono text-cyan-400">{(hoverDelay / 1000).toFixed(1)}s</span>
                </div>
                <input
                  type="range" min="0" max="10000" step="100" value={hoverDelay}
                  onChange={(e) => setHoverDelay(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-slate-600">Instant</span>
                  <span className="text-[10px] text-slate-600">Refer</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuickAccessDock;
