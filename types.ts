export interface VoiceOption {
    id: string;
    name: string;
    gender: 'Masculino' | 'Femenino';
    description: string;
}

export interface StyleOption {
    id: string;
    label: string;
    promptPrefix: string;
}

export interface AudioHistoryItem {
    id: string;
    text: string;
    voiceName: string;
    styleLabel: string;
    audioUrl: string; // Blob URL for the WAV file
    timestamp: number;
    duration: number; // Duration in seconds (estimated)
}

export interface GenerationConfig {
    text: string;
    voiceId: string;
    styleId: string;
}