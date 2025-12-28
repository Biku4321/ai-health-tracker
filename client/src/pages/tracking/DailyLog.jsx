import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import logService from "../../services/logService"; // [FIX] Import service
import VoiceRecorder from "../../components/common/VoiceRecorder";
import { useNavigate } from "react-router-dom";
import FoodVision from "./FoodVision"; // [NEW] Import the component
import { Camera, PenTool } from "lucide-react";
import confetti from "canvas-confetti";
const DailyLog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mood");
  const [loading, setLoading] = useState(false);
  const [dietMode, setDietMode] = useState("vision");
  // State for the form
  const [logData, setLogData] = useState({
    mood: { score: 5, label: "Calm", note: "" },
    sleep: { hours: 7, quality: "Good" },
    exercise: { activity: "", durationMinutes: 0, intensity: "Medium" },
    diet: "", // Changed to string for simple text input
    symptoms: [],
  });

  const moodOptions = [
    { label: "Happy", emoji: "😄", color: "bg-yellow-100 border-yellow-300" },
    { label: "Energetic", emoji: "⚡", color: "bg-green-100 border-green-300" },
    { label: "Calm", emoji: "😌", color: "bg-blue-100 border-blue-300" },
    { label: "Stressed", emoji: "😫", color: "bg-red-100 border-red-300" },
    { label: "Sad", emoji: "😢", color: "bg-gray-100 border-gray-300" },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Format diet for backend (simple array of one item for now)
      const formattedData = {
        ...logData,
        diet: logData.diet
          ? [{ mealName: logData.diet, calories: 0, time: "Day" }]
          : [],
      };

      // The backend now returns { log, gameStats }
      const response = await logService.createLog(formattedData);

      // Check for Level Up!
      if (response.gameStats && response.gameStats.leveledUp) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        alert(`🎉 LEVEL UP! You are now Level ${response.gameStats.level}!`);
      } else {
        alert("✅ Log Saved! +50 XP");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to save log");
    } finally {
      setLoading(false);
    }
  };
  const handleAiLog = (foodData) => {
    // Append the AI result to the diet text
    const newEntry = `${foodData.mealName} (~${foodData.calories} kcal) - P:${foodData.macros.protein}g C:${foodData.macros.carbs}g F:${foodData.macros.fats}g`;
    setLogData((prev) => ({
      ...prev,
      diet: prev.diet ? `${prev.diet}\n${newEntry}` : newEntry,
    }));
    alert("Food added to log!");
  };
  const handleVoiceData = (aiData) => {
    // Intelligent Merge: Only overwrite if AI found data
    setLogData((prev) => ({
      ...prev,
      mood: aiData.mood?.label ? { ...prev.mood, ...aiData.mood } : prev.mood,
      sleep: aiData.sleep?.hours
        ? { ...prev.sleep, ...aiData.sleep }
        : prev.sleep,
      exercise: aiData.exercise?.activity
        ? { ...prev.exercise, ...aiData.exercise }
        : prev.exercise,
      diet: aiData.diet
        ? prev.diet
          ? prev.diet + "\n" + aiData.diet
          : aiData.diet
        : prev.diet,
    }));

    // Auto-switch tabs to show user what happened
    if (aiData.mood?.label) setActiveTab("mood");

    alert("✨ Voice Log Processed! Review the details below.");
  };

  return (
    <div className="min-h-screen bg-[#F4F7F8] p-4 pb-20">
      <header className="mb-6">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-[#1A3C40]">
            Daily Check-in
          </h1>
          <p className="text-gray-500 text-sm">
            How are you feeling today, {user?.name}?
          </p>
        </div>
        <VoiceRecorder onAnalysisComplete={handleVoiceData} />
      </header>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {["mood", "sleep", "exercise", "diet"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? "bg-[#4EC5C1] text-[#1A3C40] shadow-md"
                : "bg-white text-gray-400 border border-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[400px]">
        {/* MOOD SECTION */}
        {activeTab === "mood" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#1A3C40]">
              How's your mood?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {moodOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() =>
                    setLogData({
                      ...logData,
                      mood: { ...logData.mood, label: option.label },
                    })
                  }
                  className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                    logData.mood.label === option.label
                      ? option.color
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <span className="text-3xl mb-1">{option.emoji}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">
                Intensity (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={logData.mood.score}
                onChange={(e) =>
                  setLogData({
                    ...logData,
                    mood: { ...logData.mood, score: e.target.value },
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4EC5C1]"
              />
            </div>
            <button
              onClick={() => setActiveTab("sleep")}
              className="w-full py-3 bg-[#1A3C40] text-white rounded-xl font-bold"
            >
              Next: Sleep
            </button>
          </div>
        )}

        {/* SLEEP SECTION */}
        {activeTab === "sleep" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#1A3C40]">Sleep Quality</h2>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={() =>
                  setLogData({
                    ...logData,
                    sleep: {
                      ...logData.sleep,
                      hours: Math.max(0, logData.sleep.hours - 0.5),
                    },
                  })
                }
                className="w-10 h-10 rounded-full bg-gray-100 text-xl font-bold text-[#1A3C40]"
              >
                -
              </button>
              <div className="text-center">
                <span className="text-4xl font-bold text-[#4EC5C1]">
                  {logData.sleep.hours}
                </span>
                <p className="text-gray-400 text-xs uppercase tracking-wide">
                  Hours
                </p>
              </div>
              <button
                onClick={() =>
                  setLogData({
                    ...logData,
                    sleep: {
                      ...logData.sleep,
                      hours: logData.sleep.hours + 0.5,
                    },
                  })
                }
                className="w-10 h-10 rounded-full bg-gray-100 text-xl font-bold text-[#1A3C40]"
              >
                +
              </button>
            </div>
            <button
              onClick={() => setActiveTab("exercise")}
              className="w-full py-3 bg-[#1A3C40] text-white rounded-xl font-bold"
            >
              Next: Exercise
            </button>
          </div>
        )}

        {/* EXERCISE SECTION */}
        {activeTab === "exercise" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#1A3C40]">Movement</h2>
            <input
              type="text"
              placeholder="Activity (e.g., Running)"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              onChange={(e) =>
                setLogData({
                  ...logData,
                  exercise: { ...logData.exercise, activity: e.target.value },
                })
              }
            />
            <div className="flex-1">
              <label className="text-xs text-gray-500 font-bold uppercase">
                Mins
              </label>
              <input
                type="number"
                placeholder="30"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                onChange={(e) =>
                  setLogData({
                    ...logData,
                    exercise: {
                      ...logData.exercise,
                      durationMinutes: e.target.value,
                    },
                  })
                }
              />
            </div>
            <button
              onClick={() => setActiveTab("diet")}
              className="w-full py-3 bg-[#1A3C40] text-white rounded-xl font-bold"
            >
              Next: Diet
            </button>
          </div>
        )}

        {/* DIET / FINISH SECTION */}
        {activeTab === "diet" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#1A3C40] dark:text-white">
                Diet Log
              </h2>
              {/* Toggle Buttons */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setDietMode("vision")}
                  className={`p-2 rounded-md transition-all ${
                    dietMode === "vision"
                      ? "bg-white dark:bg-gray-600 shadow-sm text-primary"
                      : "text-gray-400"
                  }`}
                >
                  <Camera size={20} />
                </button>
                <button
                  onClick={() => setDietMode("text")}
                  className={`p-2 rounded-md transition-all ${
                    dietMode === "text"
                      ? "bg-white dark:bg-gray-600 shadow-sm text-primary"
                      : "text-gray-400"
                  }`}
                >
                  <PenTool size={20} />
                </button>
              </div>
            </div>

            {dietMode === "vision" ? (
              <div className="animate-fadeIn">
                <FoodVision onLogSuccess={handleAiLog} />
                <p className="text-center text-xs text-gray-400 mt-2">
                  AI will estimate calories & macros
                </p>
              </div>
            ) : (
              <textarea
                placeholder="What did you eat today?"
                value={logData.diet}
                onChange={(e) =>
                  setLogData({ ...logData, diet: e.target.value })
                }
                className="w-full h-48 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:border-[#4EC5C1] dark:text-white outline-none"
              ></textarea>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#4EC5C1] to-[#2D5C63] text-white rounded-xl font-bold shadow-lg transform hover:scale-[1.02] transition-transform"
            >
              {loading ? "Saving..." : "✅ Save Today's Log"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyLog;
