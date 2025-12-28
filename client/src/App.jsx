import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SocketProvider } from "./context/SocketContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Feature
import { Suspense, lazy } from "react";
import Layout from "./components/layout/Layout";
import Loader from "./components/common/Loader";
import { MoodProvider } from "./context/MoodContext";
// Lazy Load Pages
const ProfileSetup = lazy(() => import("./pages/auth/ProfileSetup"));
const DailyLog = lazy(() => import("./pages/tracking/DailyLog"));
const ChatAssistant = lazy(() => import("./pages/ai-chat/ChatAssistant"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const ReportView = lazy(() => import("./pages/reports/ReportView"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const Login = lazy(() => import("./pages/auth/Login"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const JournalEditor = lazy(() => import("./pages/journal/JournalEditor"));
const JournalHistory = lazy(() => import("./pages/journal/JournalHistory"));
const Community = lazy(() => import("./pages/community/Community"));
// Create a client
const queryClient = new QueryClient();

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <MoodProvider>
            <SocketProvider>
              <Router>
                <div className="font-inter text-gray-800 bg-[#F4F7F8] dark:bg-dark-bg dark:text-dark-text min-h-screen transition-colors duration-300">
                  <Suspense
                    fallback={
                      <div className="h-screen flex items-center justify-center">
                        <Loader />
                      </div>
                    }
                  >
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />

                      <Route
                        element={
                          <PrivateRoute>
                            <Layout />
                          </PrivateRoute>
                        }
                      >
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/track" element={<DailyLog />} />
                        <Route path="/chat" element={<ChatAssistant />} />
                        <Route path="/report" element={<ReportView />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route
                          path="/profile-setup"
                          element={<ProfileSetup />}
                        />

                        {/* [FIX] Add Journal Routes */}
                        <Route path="/journal" element={<JournalEditor />} />
                        <Route
                          path="/journal/history"
                          element={<JournalHistory />}
                        />
                        <Route path="/community" element={<Community />} />
                      </Route>

                      <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                  </Suspense>
                </div>
              </Router>
            </SocketProvider>
          </MoodProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
