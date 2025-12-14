import React, { useState, useEffect, useRef } from 'react';
import { generateSpeech } from './services/geminiService';
import { base64ToUint8Array, pcmToWav } from './utils/audioUtils';
import { AudioHistoryItem, StyleOption } from './types';
import { VOICES, STYLES } from './constants';
import { VoiceSelector } from './components/VoiceSelector';
import { HistoryItem } from './components/HistoryItem';

const App: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [selectedVoiceId, setSelectedVoiceId] = useState<string>(VOICES[0].id);
    const [selectedStyleId, setSelectedStyleId] = useState<string>(STYLES[0].id);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [history, setHistory] = useState<AudioHistoryItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Setup sticky header shadow on scroll
    const [isScrolled, setIsScrolled] = useState(false);
    const mainRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (mainRef.current) {
            setIsScrolled(mainRef.current.scrollTop > 10);
        }
    };

    useEffect(() => {
        const ref = mainRef.current;
        if (ref) {
            ref.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (ref) ref.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleGenerate = async () => {
        if (!text.trim()) {
            setError("Por favor escribe algún texto.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const { base64Audio } = await generateSpeech(text, selectedVoiceId, selectedStyleId);
            
            // Convert raw PCM (Int16, 24kHz) to WAV Blob
            const pcmData = base64ToUint8Array(base64Audio);
            const wavBlob = pcmToWav(pcmData, 24000);
            const audioUrl = URL.createObjectURL(wavBlob);

            const voice = VOICES.find(v => v.id === selectedVoiceId);
            const style = STYLES.find(s => s.id === selectedStyleId);

            const newItem: AudioHistoryItem = {
                id: crypto.randomUUID(),
                text: text,
                voiceName: voice?.name || selectedVoiceId,
                styleLabel: style?.label || 'Natural',
                audioUrl: audioUrl,
                timestamp: Date.now(),
                duration: 0 // Would require audio context to calculate precisely
            };

            setHistory(prev => [newItem, ...prev]);

        } catch (err: any) {
            setError(err.message || "Error al generar audio. Revisa tu API Key.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        setHistory(prev => {
            const item = prev.find(i => i.id === id);
            if (item) {
                URL.revokeObjectURL(item.audioUrl);
            }
            return prev.filter(i => i.id !== id);
        });
    };

    return (
        <div className="flex flex-col h-full md:flex-row overflow-hidden bg-slate-50">
            {/* Sidebar / Configuration Panel */}
            <div className="w-full md:w-[480px] lg:w-[550px] bg-white border-r border-slate-200 flex flex-col h-full z-10 shadow-lg md:shadow-none">
                <div className={`p-6 border-b border-slate-100 sticky top-0 bg-white z-20 ${isScrolled ? 'shadow-sm' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            Gemini Voice Studio
                        </h1>
                    </div>
                    <p className="text-sm text-slate-500">
                        Generador de voz realista impulsado por IA.
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Voice Selection */}
                    <section>
                        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            Selecciona una Voz
                        </h2>
                        <VoiceSelector 
                            selectedVoiceId={selectedVoiceId} 
                            onSelect={setSelectedVoiceId} 
                        />
                    </section>

                    {/* Style Selection */}
                    <section>
                        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            Estilo y Tono
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            {STYLES.map(style => (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyleId(style.id)}
                                    className={`
                                        px-4 py-3 rounded-lg text-sm font-medium transition-all text-left border
                                        ${selectedStyleId === style.id 
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'}
                                    `}
                                >
                                    {style.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Text Input */}
                    <section>
                        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                            Texto a Voz
                        </h2>
                        <div className="relative">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Escribe algo increíble aquí para que Gemini lo lea..."
                                className="w-full h-40 p-4 text-base leading-relaxed bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-shadow"
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium">
                                {text.length} caracteres
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0 z-20">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !text.trim()}
                        className={`
                            w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2
                            ${isLoading || !text.trim() 
                                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'}
                        `}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Generando Audio...</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                                <span>Generar Audio</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Area / History */}
            <div ref={mainRef} className="flex-1 h-full overflow-y-auto bg-slate-50/50">
                <div className="max-w-3xl mx-auto p-6 md:p-10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Historial de Generación
                        </h2>
                        <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                            {history.length} Clips
                        </span>
                    </div>

                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl p-10">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                            </div>
                            <h3 className="text-lg font-medium text-slate-600 mb-2">Tu historial está vacío</h3>
                            <p className="max-w-xs mx-auto">
                                Configura la voz en el panel izquierdo y haz clic en "Generar Audio" para empezar.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map(item => (
                                <HistoryItem 
                                    key={item.id} 
                                    item={item} 
                                    onDelete={handleDelete} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;