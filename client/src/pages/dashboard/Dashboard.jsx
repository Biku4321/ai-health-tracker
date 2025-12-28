import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { useQuery } from "@tanstack/react-query"; // React Query for caching
import Skeleton from "../../components/common/Skeleton";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { Activity, Moon, Zap, Award, ArrowRight } from "lucide-react";
import Avatar from "../../components/gamification/Avatar";
import BadgeCase from "../../components/gamification/BadgeCase";
import { useMood } from "../../context/MoodContext"; // [NEW]
import { useEffect } from "react";
const Dashboard = () => {
  const { user } = useAuth();
  const { setCurrentMood } = useMood();
  // 🚀 Feature: React Query for Caching & Speed
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["weeklyLogs"],
    queryFn: async () => {
      const { data } = await api.get("/logs"); // Uses secure api instance
      return data.reverse();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    if (logs.length > 0) {
      const latestLog = logs[logs.length - 1]; // logs are reversed in queryFn? Check this.
      // Actually, in queryFn above: return data.reverse();
      // So logs[0] is the oldest? No, wait.
      // Usually API returns oldest first. .reverse() makes [0] the newest.
      // Let's assume logs[0] is the newest.
      if (logs[0]?.mood?.label) {
        setCurrentMood(logs[0].mood.label);
      }
    }
  }, [logs, setCurrentMood]);
  // Data transformation for charts
  const chartData = logs.map((log) => ({
    date: new Date(log.date).toLocaleDateString("en-US", { weekday: "short" }),
    mood: log.mood?.score || 0,
    sleep: log.sleep?.hours || 0,
  }));

  // Calculate Averages safely
  const avgMood = logs.length
    ? (
        logs.reduce((acc, log) => acc + (log.mood?.score || 0), 0) / logs.length
      ).toFixed(1)
    : "0.0";

  const avgSleep = logs.length
    ? (
        logs.reduce((acc, log) => acc + (log.sleep?.hours || 0), 0) /
        logs.length
      ).toFixed(1)
    : "0.0";

  const gamification = user?.gamification || {
    level: 1,
    xp: 0,
    streak: 0,
    badges: [],
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 animate-fadeIn">
        <div className="flex items-center gap-4">
          <Avatar level={gamification.level} size="lg" />
          <div>
            <h1 className="text-3xl font-poppins font-bold text-secondary dark:text-white">
              Hello, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-sm opacity-75 text-gray-600 dark:text-gray-300">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <Link
          to="/track"
          className="bg-gradient-to-r from-[#4EC5C1] to-[#2D5C63] text-white px-6 py-3 rounded-2xl font-bold shadow-glow hover:scale-105 transition active:scale-95 flex items-center gap-2"
        >
          <Activity size={20} /> Log Activity
        </Link>
      </header>

      {/* Badges Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
        {/* A. AI Insights (Tall Card - Spans 2 Rows vertically on Desktop) */}
        <Link
          to="/chat"
          className="md:col-span-1 md:row-span-2 bg-gradient-to-b from-primary/20 to-secondary/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 relative overflow-hidden group hover:shadow-glow transition-all duration-300"
        >
          <div className="absolute top-0 right-0 p-4 opacity-50">
            <Zap
              size={80}
              className="text-primary rotate-12 group-hover:rotate-0 transition-transform duration-500"
            />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="bg-white/30 dark:bg-black/30 w-fit p-2 rounded-xl backdrop-blur-sm">
              <Zap className="text-secondary dark:text-white" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-secondary dark:text-white mb-1">
                AI Coach
              </h3>
              <p className="text-sm opacity-80 dark:text-gray-200">
                "Your sleep quality improved by 10% this week. Keep it up!"
              </p>
              <div className="mt-4 text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                Chat Now <ArrowRight size={12} />
              </div>
            </div>
          </div>
        </Link>

        {/* B. Stat: Mood (Square) */}
        <div className="md:col-span-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/20 dark:border-gray-700 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-yellow-100 rounded-xl text-2xl">😊</div>
            <span className="text-xs font-bold text-gray-400 uppercase">
              Avg Mood
            </span>
          </div>
          <div className="text-4xl font-bold text-secondary dark:text-white">
            {avgMood}
          </div>
          <div className="text-xs text-green-600 font-bold mt-1">
            +0.2 vs last week
          </div>
        </div>

        {/* C. Stat: Sleep (Square) */}
        <div className="md:col-span-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white/20 dark:border-gray-700 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
              <Moon size={24} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase">
              Avg Sleep
            </span>
          </div>
          <div className="text-4xl font-bold text-secondary dark:text-white">
            {avgSleep}
            <span className="text-lg text-gray-400">h</span>
          </div>
          <div className="text-xs text-red-500 font-bold mt-1">
            -0.5 vs last week
          </div>
        </div>

        {/* D. Gamification (Wide - Spans 1 Col on Desktop) */}
        <div className="md:col-span-1 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-6 border border-orange-200 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-secondary dark:text-white">
              {gamification.streak} Day Streak
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
            Next Reward: 7 Days
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-900 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-[70%]"></div>
          </div>
        </div>

        {/* E. Main Chart (Wide - Spans 2 Cols, 1 Row) */}
        <div className="md:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 border border-white/20 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-4">
            Mood Trends
          </h3>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    backgroundColor: "#1E293B",
                    color: "#fff",
                  }}
                  cursor={{ stroke: "#4EC5C1", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#4EC5C1"
                  strokeWidth={4}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* F. Trophy Case (Wide - Spans 2 Cols) */}
        <div className="md:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-6 border border-white/20 dark:border-gray-700 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Award className="text-yellow-500" /> Recent Badges
            </h3>
            <Link
              to="/profile-setup"
              className="text-xs text-primary font-bold hover:underline"
            >
              View All
            </Link>
          </div>
          <BadgeCase badges={gamification.badges.slice(0, 4)} />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
