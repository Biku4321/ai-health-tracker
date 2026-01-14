const { GoogleGenerativeAI } = require("@google/generative-ai");
const DailyLog = require("../../models/DailyLog");
require("dotenv").config(); 

console.log("---------------------------------------------------");
console.log("🔑 Gemini Service Init:");
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ ERROR: GEMINI_API_KEY is MISSING in process.env");
} else {
  console.log("✅ API Key Loaded Successfully (Length: " + process.env.GEMINI_API_KEY.length + ")");
}
console.log("---------------------------------------------------");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

/**
 * Streams response to Socket.io client
 */
const streamGeminiResponse = async (userId, userQuery, socket) => {
  try {
    const logs = await DailyLog.find({ user: userId }).sort({ date: -1 }).limit(3);
    const contextData = JSON.stringify(logs);

    const systemPrompt = `
      You are an empathetic AI Health Coach.
      Current User Context: ${contextData}
      User Question: ${userQuery}
      Answer concisely in Markdown.
    `;

    const result = await model.generateContentStream(systemPrompt);
    for await (const chunk of result.stream) {
      socket.emit("ai_stream_chunk", chunk.text());
    }
    socket.emit("ai_stream_end");
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    socket.emit("error", "AI Service Unavailable: " + error.message);
  }
};

const generateHealthInsight = async (userId, userQuery = "") => {
  try {
    const logs = await DailyLog.find({ user: userId }).sort({ date: -1 }).limit(3);
    const contextData = JSON.stringify(logs);
    const prompt = `Context: ${contextData}. Question: ${userQuery}. Provide a health insight.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Insight Error Details:", error); // Detailed log
    return "I couldn't generate an insight right now. Error: " + error.message;
  }
};

const analyzeJournalEntry = async (text) => {
  const prompt = `
    Analyze this journal: "${text}"
    Return JSON ONLY: { "mood": "string", "sentimentScore": number, "summary": "string", "advice": "string" }
  `;

  try {
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    const jsonString = textResponse.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Journal Analysis Error:", error);
    return null;
  }
};

const analyzeImageContent = async (imageBuffer, mimeType) => {
  const prompt = `
    Analyze this image of food. 
    1. Identify the dish.
    2. Estimate total calories.
    3. Estimate macros (protein, carbs, fats).
    
    Return ONLY valid JSON (no markdown):
    {
      "foodName": "Dish Name",
      "calories": 0,
      "macros": { "protein": 0, "carbs": 0, "fats": 0 }
    }
  `;

  try {
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Vision Analysis Error:", error);
    throw new Error("Failed to analyze image");
  }
};

const analyzeAudioContent = async (audioBuffer, mimeType) => {
  const prompt = `
    Listen to this health log. Extract: Mood, Sleep, Exercise, Diet.
    Return JSON ONLY:
    {
      "mood": { "score": 5, "label": "Neutral", "note": "" },
      "sleep": { "hours": 0, "quality": "Good" },
      "exercise": { "activity": "", "durationMinutes": 0, "intensity": "Medium" },
      "diet": ""
    }
  `;

  try {
    const audioPart = {
      inlineData: {
        data: audioBuffer.toString("base64"),
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, audioPart]);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Voice Analysis Error:", error);
    throw new Error("Failed to analyze voice log");
  }
};

module.exports = {
  generateHealthInsight,
  analyzeJournalEntry,
  streamGeminiResponse,
  analyzeImageContent,
  analyzeAudioContent,
};