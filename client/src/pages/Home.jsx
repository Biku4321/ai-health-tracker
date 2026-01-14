import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  MessageSquare, 
  Camera, 
  Mic, 
  BookOpen, 
  Users, 
  ChevronRight, 
  ShieldCheck, 
  TrendingUp, 
  FileText 
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Helper to handle protected navigation
  const handleNavigation = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/signup'); // Redirects to signup if not logged in
    }
  };

  const features = [
    {
      title: "AI Health Coach",
      desc: "Chat 24/7 with our AI doctor for instant advice and motivation.",
      icon: MessageSquare,
      path: "/chat",
      color: "bg-teal-100 text-teal-600",
      span: "md:col-span-2", // Big Card
    },
    {
      title: "Food Vision AI",
      desc: "Snap a photo of your meal. We calculate calories & macros instantly.",
      icon: Camera,
      path: "/track",
      color: "bg-orange-100 text-orange-600",
      span: "md:col-span-1",
    },
    {
      title: "Voice Logging",
      desc: "Just say 'I ate a burger and ran 5km'. We handle the rest.",
      icon: Mic,
      path: "/track",
      color: "bg-blue-100 text-blue-600",
      span: "md:col-span-1",
    },
    {
      title: "Smart Journal",
      desc: "Write your thoughts. AI analyzes your sentiment & mental health.",
      icon: BookOpen,
      path: "/journal",
      color: "bg-purple-100 text-purple-600",
      span: "md:col-span-1",
    },
    {
      title: "Community Hub",
      desc: "Compete on leaderboards and find accountability partners.",
      icon: Users,
      path: "/community",
      color: "bg-yellow-100 text-yellow-600",
      span: "md:col-span-1",
    },
    {
      title: "Clinical Reports",
      desc: "Generate doctor-ready PDF reports of your health trends.",
      icon: FileText,
      path: "/report",
      color: "bg-indigo-100 text-indigo-600",
      span: "md:col-span-2", // Wide Card
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F8] dark:bg-[#0F172A] text-gray-800 dark:text-gray-100 transition-colors duration-300 font-inter">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-20 lg:pt-32 overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-teal-200 dark:border-teal-900 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider shadow-sm">
              <SparklesIcon /> AI-Powered Health Tracking
            </span>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gray-900 dark:text-white">
              Your Health, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
                Reimagined with AI.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Track your mood, sleep, and diet effortlessly. Get real-time insights from your personal AI Health Coach.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              {user ? (
                <Link 
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Go to Dashboard <ChevronRight size={20} />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/signup"
                    className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    Get Started Free <ChevronRight size={20} />
                  </Link>
                  {/* <Link 
                    to="/login"
                    className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-lg hover:border-teal-500 hover:text-teal-500 transition-all flex items-center justify-center"
                  >
                    Login
                  </Link> */}
                </>
              )}
            </div>
            
            <p className="text-sm text-gray-500 pt-4">No credit card required • Free for students</p>
          </div>
        </div>
      </section>

      {/* --- STATS TICKER --- */}
      <section className="border-y border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">10k+</h3>
            <p className="text-sm text-gray-500 uppercase tracking-wide">Daily Logs</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">98%</h3>
            <p className="text-sm text-gray-500 uppercase tracking-wide">AI Accuracy</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">4.9/5</h3>
            <p className="text-sm text-gray-500 uppercase tracking-wide">User Rating</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">24/7</h3>
            <p className="text-sm text-gray-500 uppercase tracking-wide">AI Availability</p>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID (BENTO STYLE) --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Everything You Need</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We combined advanced AI with simple journaling to give you the most complete health picture possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              onClick={() => handleNavigation(feature.path)}
              className={`${feature.span} group relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-teal-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
              
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <ChevronRight size={20} className="text-teal-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-20 bg-teal-900 text-white rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold">Sign Up</h3>
              <p className="text-teal-200">Create your free account and set your health goals.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold">Log Daily</h3>
              <p className="text-teal-200">Use Voice or Photo to log your meals, mood, and sleep in seconds.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold">Get Insights</h3>
              <p className="text-teal-200">Watch your AI dashboard update in real-time with actionable advice.</p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

// Simple Icon Component
const SparklesIcon = () => (
  <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
  </svg>
);

export default Home;