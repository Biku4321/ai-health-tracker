const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const models = await genAI.getGenerativeModelFactory().listModels();
    console.log("✅ Available Models:");
    // Filter for models that support 'generateContent'
    const available = models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    available.forEach(m => console.log(` - ${m.name.replace("models/", "")}`));
  } catch (error) {
    console.error("❌ Error fetching models:", error.message);
  }
}

listModels();