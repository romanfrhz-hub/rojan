import React from 'react';
import { AudioHistoryItem } from '../types';
import { formatDuration } from '../utils/audioUtils';

interface HistoryItemProps {
    item: AudioHistoryItem;
    onDelete: (id: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onDelete }) => {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            {item.voiceName}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                            {item.styleLabel}
                        </span>
                        <span className="text-xs text-slate-400">
                            • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <p className="text-sm text-slate-800 line-clamp-2 font-medium" title={item.text}>
                        "{item.text}"
                    </p>
                </div>
                <button 
                    onClick={() => onDelete(item.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
            
            <div className="flex items-center gap-3">
                <audio 
                    controls 
                    src={item.audioUrl} 
                    className="w-full h-8 block" 
                    style={{ borderRadius: '4px' }}
                />
                <a 
                    href={item.audioUrl} 
                    download={`gemini_tts_${item.timestamp}.wav`}
                    className="flex-shrink-0 p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-colors"
                    title="Download WAV"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </a>
            </div>
        </div>
    );
};