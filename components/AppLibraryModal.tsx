
import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Plus, Trash2, LayoutGrid, Star } from 'lucide-react';
import { APP_LIBRARY, AppDefinition } from '../data/appLibrary';

interface AppLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLaunch: (title: string, url: string) => void;
}

const AppLibraryModal: React.FC<AppLibraryModalProps> = ({ isOpen, onClose, onLaunch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'library' | 'custom'>('library');
    const [customApps, setCustomApps] = useState<AppDefinition[]>([]);
    const [newAppName, setNewAppName] = useState('');
    const [newAppUrl, setNewAppUrl] = useState('');

    // Load custom apps
    useEffect(() => {
        const saved = localStorage.getItem('isolix_custom_apps');
        if (saved) {
            try {
                setCustomApps(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse custom apps', e);
            }
        }
    }, []);

    // Save custom apps
    useEffect(() => {
        localStorage.setItem('isolix_custom_apps', JSON.stringify(customApps));
    }, [customApps]);

    const handleCreateCustomApp = () => {
        if (!newAppName.trim() || !newAppUrl.trim()) return;

        // Normalize URL
        let url = newAppUrl.trim();
        if (!url.startsWith('http')) {
            url = 'https://' + url;
        }

        const newApp: AppDefinition = {
            name: newAppName.trim(),
            url: url
        };

        setCustomApps([...customApps, newApp]);
        setNewAppName('');
        setNewAppUrl('');
    };

    const handleDeleteCustomApp = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setCustomApps(customApps.filter((_, i) => i !== index));
    };

    const filteredLibrary = useMemo(() => {
        if (!searchTerm) return APP_LIBRARY;

        // Deep filter
        return APP_LIBRARY.map(cat => ({
            ...cat,
            apps: cat.apps.filter(app =>
                app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.url.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })).filter(cat => cat.apps.length > 0);

    }, [searchTerm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#0f172a] border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden animate-in scale-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <LayoutGrid className="text-cyan-400" size={24} />
                        <h2 className="text-xl font-bold text-slate-200 tracking-tight">App Library</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Tabs */}
                        <div className="flex bg-slate-800 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('library')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'library' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                Explore
                            </button>
                            <button
                                onClick={() => setActiveTab('custom')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'custom' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                Custom
                            </button>
                        </div>

                        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col">

                    {activeTab === 'library' && (
                        <>
                            {/* Search Bar */}
                            <div className="px-6 py-4">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search apps by name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all font-medium"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                                {filteredLibrary.map(category => (
                                    <div key={category.id} className="mb-8">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">{category.name}</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                            {category.apps.map(app => (
                                                <button
                                                    key={app.name}
                                                    onClick={() => { onLaunch(app.name, app.url); onClose(); }}
                                                    className="flex items-center gap-3 p-3 bg-slate-800/40 hover:bg-slate-700 border border-slate-700/30 hover:border-slate-600 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 text-left group"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:scale-110 transition-all">
                                                        {app.icon ? <app.icon size={20} /> : <LayoutGrid size={20} />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-semibold text-slate-300 group-hover:text-white truncate">{app.name}</div>
                                                        <div className="text-[10px] text-slate-500 truncate">{new URL(app.url).hostname.replace('www.', '')}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'custom' && (
                        <div className="flex-1 overflow-y-auto px-6 py-6">

                            {/* Add Custom Form */}
                            <div className="bg-slate-800/30 rounded-xl p-6 mb-8 border border-slate-700/50">
                                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                                    <Plus size={20} className="text-emerald-400" />
                                    Add Custom Shortcut
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-end">
                                    <div>
                                        <label className="text-xs text-slate-400 font-medium mb-1 block">App Name</label>
                                        <input
                                            type="text"
                                            placeholder="My Dashboard"
                                            value={newAppName}
                                            onChange={(e) => setNewAppName(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 font-medium mb-1 block">URL</label>
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            value={newAppUrl}
                                            onChange={(e) => setNewAppUrl(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                    <button
                                        onClick={handleCreateCustomApp}
                                        disabled={!newAppName.trim() || !newAppUrl.trim()}
                                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold rounded-lg shadow-lg transition-all"
                                    >
                                        Add App
                                    </button>
                                </div>
                            </div>

                            {/* Custom List */}
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Your Apps</h3>
                            {customApps.length === 0 ? (
                                <div className="text-center py-12 text-slate-600 italic">
                                    No custom apps yet. Add one above!
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {customApps.map((app, index) => (
                                        <div
                                            key={index + app.name}
                                            className="flex items-center gap-3 p-3 bg-slate-800/40 hover:bg-slate-700 border border-slate-700/30 hover:border-slate-600 rounded-xl transition-all group relative cursor-pointer"
                                            onClick={() => { onLaunch(app.name, app.url); onClose(); }}
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-emerald-900/20 flex items-center justify-center text-emerald-400">
                                                <Star size={20} fill="currentColor" className="opacity-50" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-slate-300 group-hover:text-white truncate">{app.name}</div>
                                                <div className="text-[10px] text-slate-500 truncate">{new URL(app.url).hostname}</div>
                                            </div>
                                            <button
                                                onClick={(e) => handleDeleteCustomApp(index, e)}
                                                className="absolute top-2 right-2 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                                title="Remove"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AppLibraryModal;
