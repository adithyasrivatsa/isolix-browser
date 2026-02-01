import React, { useRef, useState, useEffect } from 'react';
import { PanelProps } from '../types';
import { X, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

// Declare webview type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      webview: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        partition?: string;
        allowpopups?: any;
        useragent?: string;
      };
    }
  }
}

const Panel: React.FC<PanelProps> = ({
  data,
  isActive,
  isDimmed,
  widthClass,
  onHover,
  onRemove,
  onUpdateTitle,
  onUpdateUrl
}) => {
  const webviewRef = useRef<any>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayUrl, setDisplayUrl] = useState(data.url);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleDidNavigate = () => {
      setCanGoBack(webview.canGoBack());
      setCanGoForward(webview.canGoForward());
      setDisplayUrl(webview.getURL());
      setIsLoading(false);
    };

    const handleDidStartLoading = () => {
      setIsLoading(true);
    };

    const handleDidStopLoading = () => {
      setIsLoading(false);
      setCanGoBack(webview.canGoBack());
      setCanGoForward(webview.canGoForward());
    };

    const handlePageTitleUpdated = (e: any) => {
      if (e.title && e.title !== data.title) {
        onUpdateTitle(data.id, e.title);
      }
    };

    webview.addEventListener('did-navigate', handleDidNavigate);
    webview.addEventListener('did-navigate-in-page', handleDidNavigate);
    webview.addEventListener('did-start-loading', handleDidStartLoading);
    webview.addEventListener('did-stop-loading', handleDidStopLoading);
    webview.addEventListener('page-title-updated', handlePageTitleUpdated);

    return () => {
      webview.removeEventListener('did-navigate', handleDidNavigate);
      webview.removeEventListener('did-navigate-in-page', handleDidNavigate);
      webview.removeEventListener('did-start-loading', handleDidStartLoading);
      webview.removeEventListener('did-stop-loading', handleDidStopLoading);
      webview.removeEventListener('page-title-updated', handlePageTitleUpdated);
    };
  }, [data.id, data.title, onUpdateTitle]);

  // Event Handlers
  const handleInputClick = (e: React.MouseEvent) => e.stopPropagation();
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(data.id, e);
  };

  const handleGoBack = () => {
    if (webviewRef.current?.canGoBack()) {
      webviewRef.current.goBack();
    }
  };

  const handleGoForward = () => {
    if (webviewRef.current?.canGoForward()) {
      webviewRef.current.goForward();
    }
  };

  const handleReload = () => {
    webviewRef.current?.reload();
  };

  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newUrl = (e.target as HTMLInputElement).value;
      onUpdateUrl(data.id, newUrl);
      webviewRef.current?.loadURL(newUrl);
    }
  };

  return (
    <div
      className={`
        group relative flex flex-col
        transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
        h-full ${widthClass} rounded-2xl border border-slate-700/50 shadow-xl hover:shadow-2xl
        bg-slate-800 overflow-hidden
        ${isDimmed ? 'opacity-40 scale-[0.98] grayscale-[0.5]' : 'opacity-100'}
        ${!isActive && !isDimmed ? 'hover:border-slate-500' : ''}
        ${isActive ? 'z-10 border-slate-400 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]' : 'z-0'}
      `}
      onMouseEnter={() => onHover(data.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Top bar - Title and Navigation */}
      <div className="relative z-20 flex items-center gap-2 px-3 py-2 bg-slate-800/90 border-b border-slate-700/30">
        {/* Color Indicator */}
        <div className={`w-1.5 h-1.5 rounded-full ${data.color} flex-shrink-0`} />

        {/* Title */}
        <input
          type="text"
          value={data.title}
          onClick={handleInputClick}
          onChange={(e) => onUpdateTitle(data.id, e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-slate-200 font-medium text-sm focus:bg-slate-700/50 rounded px-1 -ml-1 truncate placeholder-slate-500"
          placeholder="Site Name"
        />

        {/* Navigation Buttons (visible on hover/active) */}
        <div className={`
          flex items-center gap-1 flex-shrink-0
          transition-opacity duration-200
          ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}>
          <button
            onClick={handleGoBack}
            disabled={!canGoBack || !isActive}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-all"
            title="Back"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={handleGoForward}
            disabled={!canGoForward || !isActive}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-all"
            title="Forward"
          >
            <ChevronRight size={14} />
          </button>
          <button
            onClick={handleReload}
            disabled={!isActive}
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-all"
            title="Reload"
          >
            <RotateCw size={12} className={`${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>


      </div>

      {/* Webview Content - Takes remaining space */}
      <div className="flex-1 relative bg-slate-900">
        <webview
          ref={webviewRef}
          src={data.url}
          partition={`persist:${data.partition_id}`}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          allowpopups={true as any}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 pointer-events-none">
            <div className="text-slate-500 text-xs">Loading...</div>
          </div>
        )}
      </div>

      {/* Bottom bar - URL */}
      <div className={`
        relative z-20 px-2 py-1 bg-slate-800/95 border-t border-slate-700/30
        flex items-center gap-2
        transition-all duration-200
        ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-80'}
      `}>

        <input
          type="text"
          value={displayUrl}
          onClick={handleInputClick}
          onChange={(e) => setDisplayUrl(e.target.value)}
          onKeyDown={handleUrlKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-[11px] text-slate-300 font-mono focus:bg-slate-700/50 focus:text-indigo-400 rounded px-1 truncate hover:text-indigo-300 transition-colors placeholder-slate-600"
          placeholder="https://..."
        />

        {/* Close Button - Moved to Right */}
        <button
          onClick={handleRemoveClick}
          className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded-md text-slate-400 transition-all duration-200 flex-shrink-0"
          title="Close Panel"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Panel;