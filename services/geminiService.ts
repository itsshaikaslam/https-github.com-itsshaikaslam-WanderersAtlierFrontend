import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ImageAspectRatio } from "../types";

let userApiKey: string | null = null;

export const setApiKey = (key: string) => {
  userApiKey = key;
  if (typeof window !== 'undefined') {
    localStorage.setItem('gemini_api_key', key);
  }
};

export const getApiKey = () => {
    if (userApiKey) return userApiKey;
    if (typeof window !== 'undefined') {
        return localStorage.getItem('gemini_api_key') || "";
    }
    return "";
}

// Initialize logic to load from storage on module load if possible
if (typeof window !== 'undefined') {
    userApiKey = localStorage.getItem('gemini_api_key');
}

const getAIClient = () => {
  const apiKey = userApiKey || process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing. Please provide it via settings or process.env.API_KEY.");
    throw new Error("API Key is missing. Please add your Gemini API Key in Settings.");
  }
  return new GoogleGenAI({ apiKey });
};

export const enhancePrompt = async (prompt: string): Promise<string> => {
  if (!prompt) return "";
  try {
    const ai = getAIClient();
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Enhance the following image generation prompt to be more descriptive, artistic, and effective for high-quality image generation. Keep it under 100 words. \n\nOriginal: "${prompt}"\n\nEnhanced:`,
    });
    return response.text?.trim() || "Failed to enhance prompt.";
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    if ((error as Error).message.includes("API Key")) return "Please set your API Key in Settings.";
    return `Enhanced version of: ${prompt} (Simulation: Error)`;
  }
};

export const generateImageFromText = async (prompt: string, aspectRatio: ImageAspectRatio): Promise<string> => {
  try {
    const ai = getAIClient();
    // Using gemini-2.5-flash-image for generation as requested by instructions
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: aspectRatio
        }
      }
    });

    // Extract image
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return ""; // No image found
  } catch (error) {
    console.error("Error generating image:", error);
    if ((error as Error).message.includes("API Key")) throw error;
    // Return a placeholder if simulation/error
    return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/1024/1024`;
  }
};

export const generateImageFromSketch = async (sketchBase64: string, prompt: string): Promise<string> => {
  try {
    const ai = getAIClient();
    // Strip header if present
    const base64Data = sketchBase64.replace(/^data:image\/\w+;base64,/, "");
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG for sketch uploads
              data: base64Data
            }
          },
          { text: prompt || "Turn this sketch into a high quality realistic image." }
        ]
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
       for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return "";
  } catch (error) {
    console.error("Error generating from sketch:", error);
    if ((error as Error).message.includes("API Key")) throw error;
    return `https://picsum.photos/seed/sketch/1024/1024`;
  }
};

export const enhanceProductAd = async (imageBase64: string, config: any): Promise<string> => {
    try {
        const ai = getAIClient();
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const prompt = `Create a professional product advertisement using this product. 
        Background style: ${config.background}. 
        Lighting: ${config.lighting}. 
        Make it high resolution and commercially appealing.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                    { text: prompt }
                ]
            }
        });

        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
        return "";
    } catch (error) {
        console.error("Error enhancing ad:", error);
        if ((error as Error).message.includes("API Key")) throw error;
         return `https://picsum.photos/seed/product/1024/1024`;
    }
}

export const editImageWithPrompt = async (imageBase64: string, editPrompt: string): Promise<string> => {
    try {
        const ai = getAIClient();
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                    { text: `Edit this image: ${editPrompt}` }
                ]
            }
        });

        if (response.candidates?.[0]?.content?.parts) {
             for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
        return "";
    } catch (error) {
        console.error("Error editing image:", error);
        if ((error as Error).message.includes("API Key")) throw error;
        return `https://picsum.photos/seed/edit/1024/1024`;
    }
}