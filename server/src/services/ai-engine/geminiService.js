const { GoogleGenerativeAI } = require("@google/generative-ai");
const DailyLog = require("../../models/DailyLog");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// [FIX] Use specific model version 'gemini-1.5-flash-001' to avoid 404 errors
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Streams response to Socket.io client
 */
const streamGeminiResponse = async (userId, userQuery, socket) => {
  const logs = await DailyLog.find({ user: userId })
    .sort({ date: -1 })
    .limit(3);
  const contextData = JSON.stringify(logs);

  const systemPrompt = `
    You are an empathetic AI Health Coach.
    Current User Context: ${contextData}
    User Question: ${userQuery}
    Answer concisely in Markdown.
  `;

  try {
    const result = await model.generateContentStream(systemPrompt);
    for await (const chunk of result.stream) {
      socket.emit("ai_stream_chunk", chunk.text());
    }
    socket.emit("ai_stream_end");
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    socket.emit("error", "AI Service Unavailable");
  }
};

const generateHealthInsight = async (userId, userQuery = "") => {
  const logs = await DailyLog.find({ user: userId })
    .sort({ date: -1 })
    .limit(3);
  const contextData = JSON.stringify(logs);
  const prompt = `Context: ${contextData}. Question: ${userQuery}. Provide a health insight.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "I couldn't generate an insight right now.";
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
/**
 * VISION ANALYSIS: Analyze food image for calories/macros
 * @param {Buffer} imageBuffer - The raw image data
 * @param {String} mimeType - e.g., 'image/jpeg'
 */
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
      "macros": {
        "protein": 0,
        "carbs": 0,
        "fats": 0
      }
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

    // Clean and parse JSON
    const jsonString = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Vision Analysis Error:", error);
    throw new Error("Failed to analyze image");
  }
};
/**
 * VOICE ANALYSIS: Transcribe and Extract Data from Audio
 * @param {Buffer} audioBuffer
 * @param {String} mimeType
 */
const analyzeAudioContent = async (audioBuffer, mimeType) => {
  const prompt = `
    Listen to this health log. Extract the following fields into JSON:
    1. Mood (label: Happy, Sad, etc., score: 1-10, note: string)
    2. Sleep (hours: number, quality: Poor/Fair/Good/Excellent)
    3. Exercise (activity: string, durationMinutes: number, intensity: Low/Medium/High)
    4. Diet (summary string of what they ate)

    If a field is not mentioned, use null or 0.
    
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
