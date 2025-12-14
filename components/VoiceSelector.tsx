import React from 'react';
import { VoiceOption } from '../types';
import { VOICES } from '../constants';

interface VoiceSelectorProps {
    selectedVoiceId: string;
    onSelect: (id: string) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoiceId, onSelect }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {VOICES.map((voice) => {
                const isSelected = voice.id === selectedVoiceId;
                return (
                    <button
                        key={voice.id}
                        onClick={() => onSelect(voice.id)}
                        className={`
                            relative flex flex-col items-center p-4 rounded-xl border transition-all duration-200 text-center group
                            ${isSelected 
                                ? 'border-indigo-600 bg-indigo-50 shadow-sm ring-1 ring-indigo-600' 
                                : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                            }
                        `}
                    >
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center mb-3 text-sm font-bold
                            ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}
                        `}>
                            {voice.name.charAt(0)}
                        </div>
                        <h3 className={`text-sm font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                            {voice.name}
                        </h3>
                        <span className="text-xs text-slate-500 mt-1">{voice.gender}</span>
                    </button>
                );
            })}
        </div>
    );
};