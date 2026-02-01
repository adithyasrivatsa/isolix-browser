import React from 'react';

// A generic skeleton that looks like a webpage to indicate this will be a real browser view
export const WebviewSkeleton = () => (
  <div className="flex flex-col h-full w-full opacity-30 px-6 py-6 transition-opacity duration-500">
    {/* Mock Hero Section */}
    <div className="flex gap-6 mb-8">
      <div className="w-16 h-16 rounded-full bg-slate-600/20 shrink-0"></div>
      <div className="flex flex-col gap-3 w-full">
        <div className="w-3/4 h-6 bg-slate-500/20 rounded"></div>
        <div className="w-1/2 h-4 bg-slate-600/20 rounded"></div>
      </div>
    </div>
    
    {/* Mock Content Lines */}
    <div className="space-y-3">
      <div className="w-full h-3 bg-slate-600/10 rounded"></div>
      <div className="w-full h-3 bg-slate-600/10 rounded"></div>
      <div className="w-5/6 h-3 bg-slate-600/10 rounded"></div>
      <div className="w-4/5 h-3 bg-slate-600/10 rounded"></div>
      <div className="w-full h-3 bg-slate-600/10 rounded mt-4"></div>
      <div className="w-11/12 h-3 bg-slate-600/10 rounded"></div>
    </div>

    {/* Mock Image/Card Grid */}
    <div className="grid grid-cols-2 gap-4 mt-8">
      <div className="aspect-video bg-slate-700/10 rounded border border-slate-700/20"></div>
      <div className="aspect-video bg-slate-700/10 rounded border border-slate-700/20"></div>
    </div>
    
    <div className="mt-auto text-center">
      <div className="inline-block px-3 py-1 bg-slate-800/50 rounded text-[10px] text-slate-500">
        WebView Container
      </div>
    </div>
  </div>
);