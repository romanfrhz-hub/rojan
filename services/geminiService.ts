import { GoogleGenAI, Modality } from "@google/genai";
import { GEMINI_MODEL, STYLES } from '../constants';

export const generateSpeech = async (
    text: string,
    voiceId: string,
    styleId: string
): Promise<{ base64Audio: string }> => {
    if (!process.env.API_KEY) {
        throw new Error("API Key is missing. Please check your environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Find style prompt prefix
    const style = STYLES.find(s => s.id === styleId);
    const promptPrefix = style ? style.promptPrefix : STYLES[0].promptPrefix;
    
    const finalPrompt = `${promptPrefix} ${text}`;

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                {
                    parts: [
                        { text: finalPrompt }
                    ]
                }
            ],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: voiceId
                        }
                    }
                }
            }
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (!base64Audio) {
            throw new Error("No audio content generated.");
        }

        return { base64Audio };

    } catch (error) {
        console.error("Gemini TTS Error:", error);
        throw error;
    }
};