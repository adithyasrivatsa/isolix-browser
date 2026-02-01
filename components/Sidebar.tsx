import React, { useState } from 'react';
import { Workspace } from '../types';
import { Layers, Plus, Trash2, Edit2, Search } from 'lucide-react';

interface SidebarProps {
  workspaces: Workspace[];
  activeId: string;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  workspaces,
  activeId,
  onSwitch,
  onCreate,
  onRename,
  onDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkspaces = workspaces.filter(ws =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEdit = (ws: Workspace, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(ws.id);
    setEditName(ws.name);
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingId && editName.trim()) {
      onRename(editingId, editName);
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this workspace?')) {
      onDelete(id);
    }
  };

  const hoverTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 300); // 300ms delay before opening
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsOpen(false);
    setEditingId(null);
    setSearchQuery('');
  };

  return (
    <div
      className={`
        fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
        ${isOpen ? 'w-64 bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 shadow-2xl' : 'w-14 bg-transparent delay-100'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Icon - Always visible, but styled differently based on state */}
      <div
        className={`
          absolute top-4 left-3 z-[60] p-2 rounded-lg transition-all duration-300
          ${isOpen
            ? 'opacity-0 translate-x-[-10px] pointer-events-none'
            : 'opacity-100 translate-x-0 bg-slate-800/80 backdrop-blur border border-slate-700/50 text-slate-400 hover:text-indigo-400 hover:scale-110 shadow-lg cursor-pointer'}
        `}
      >
        <Layers size={20} />
      </div>

      {/* Sidebar Content */}
      <div
        className={`
          flex flex-col h-full w-full overflow-hidden transition-opacity duration-300
          ${isOpen ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}
        `}
      >

        {/* Header with Add Button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50 flex-shrink-0">
          <div className="flex items-center gap-3 text-indigo-400">
            <Layers size={20} />
            <span className="font-semibold tracking-wide text-sm uppercase">Workspaces</span>
          </div>
          <button
            onClick={onCreate}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
            title="Create New Workspace"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 flex-shrink-0">
          <div className="relative group">
            <Search className="absolute left-2.5 top-2.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
            <input
              type="text"
              placeholder="Filter workspaces..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900 transition-all placeholder-slate-600"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {filteredWorkspaces.length === 0 && (
            <div className="text-center py-4 text-xs text-slate-600">
              No workspaces found
            </div>
          )}

          {filteredWorkspaces.map((ws) => (
            <div
              key={ws.id}
              onClick={() => !editingId && onSwitch(ws.id)}
              className={`
                group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer border
                ${activeId === ws.id
                  ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-100 shadow-md shadow-indigo-900/20'
                  : 'bg-transparent border-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200'}
              `}
            >
              {/* Icon Placeholder */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                ${activeId === ws.id ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}
              `}>
                {ws.name.charAt(0).toUpperCase()}
              </div>

              {/* Name or Edit Input */}
              <div className="flex-1 min-w-0">
                {editingId === ws.id ? (
                  <form onSubmit={handleSaveEdit} className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <input
                      autoFocus
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-950 border border-indigo-500/50 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                      onBlur={() => handleSaveEdit()}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                  </form>
                ) : (
                  <span className="truncate text-sm font-medium block">{ws.name}</span>
                )}
              </div>

              {/* Action Buttons (Hover) */}
              {!editingId && (
                <div className={`
                  flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity
                  ${activeId === ws.id ? 'opacity-100' : ''}
                `}>
                  <button
                    onClick={(e) => handleStartEdit(ws, e)}
                    className="p-1.5 hover:bg-slate-700 rounded text-slate-500 hover:text-indigo-400"
                    title="Rename"
                  >
                    <Edit2 size={12} />
                  </button>
                  {workspaces.length > 1 && (
                    <button
                      onClick={(e) => handleDelete(ws.id, e)}
                      className="p-1.5 hover:bg-red-900/30 rounded text-slate-500 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;