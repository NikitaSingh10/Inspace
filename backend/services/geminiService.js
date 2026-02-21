import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const analyzeRoomImage = async (base64Image) => {

  const prompt = `
Analyze this room image and return:

1. Dominant wall color
2. Floor color
3. Room type (bedroom/living room/office)
4. Estimated room size (small/medium/large)

Respond strictly in JSON format like:
{
  "wallColor": "",
  "floorColor": "",
  "roomType": "",
  "roomSize": ""
}
`;

const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }
    ]
  });
  const text = response.text();

  const cleanJSON = text.match(/\{[\s\S]*\}/)[0];

  return JSON.parse(cleanJSON);
}; 
