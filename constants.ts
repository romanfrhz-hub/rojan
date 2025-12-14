import { VoiceOption, StyleOption } from './types';

export const GEMINI_MODEL = "gemini-2.5-flash-preview-tts";

export const VOICES: VoiceOption[] = [
    { id: 'Puck', name: 'Puck', gender: 'Masculino', description: 'Voz masculina suave y clara' },
    { id: 'Charon', name: 'Charon', gender: 'Masculino', description: 'Voz masculina profunda y autoritaria' },
    { id: 'Kore', name: 'Kore', gender: 'Femenino', description: 'Voz femenina tranquila y relajante' },
    { id: 'Fenrir', name: 'Fenrir', gender: 'Masculino', description: 'Voz masculina enérgica y rápida' },
    { id: 'Zephyr', name: 'Zephyr', gender: 'Femenino', description: 'Voz femenina brillante y expresiva' },
];

export const STYLES: StyleOption[] = [
    { id: 'natural', label: 'Natural', promptPrefix: 'Say the following text naturally:' },
    { id: 'happy', label: 'Alegre', promptPrefix: 'Say the following text cheerfully and happily:' },
    { id: 'sad', label: 'Triste', promptPrefix: 'Say the following text in a sad and melancholic tone:' },
    { id: 'storyteller', label: 'Cuentacuentos', promptPrefix: 'Narrate the following text like a storyteller reading to children:' },
    { id: 'whisper', label: 'Susurro', promptPrefix: 'Whisper the following text softly:' },
    { id: 'professional', label: 'Profesional', promptPrefix: 'Read the following text in a professional, news-anchor tone:' },
];