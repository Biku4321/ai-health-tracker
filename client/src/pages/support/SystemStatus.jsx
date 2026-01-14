import React from 'react';
import { CheckCircle, AlertTriangle, Server, Activity, Cpu } from 'lucide-react';

const SystemStatus = () => {
  const systems = [
    { name: "Website & Dashboard", status: "Operational", icon: Activity },
    { name: "Backend API", status: "Operational", icon: Server },
    { name: "AI Engine (Gemini)", status: "Operational", icon: Cpu },
    { name: "Email Services", status: "Operational", icon: CheckCircle },
    { name: "Database Cluster", status: "Operational", icon: Server },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F8] dark:bg-[#0F172A] pt-24 pb-12 px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">
            <CheckCircle size={16} /> All Systems Operational
          </div>
          <h1 className="text-3xl font-bold text-[#1A3C40] dark:text-white">System Status</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Current status of HealthAI services. Updated every minute.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid gap-4">
          {systems.map((sys, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <sys.icon size={20} />
                </div>
                <span className="font-bold text-gray-900 dark:text-white text-lg">{sys.name}</span>
              </div>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                <CheckCircle size={18} />
                {sys.status}
              </div>
            </div>
          ))}
        </div>

        {/* Uptime Graph Mockup */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Uptime (Last 30 Days)</h3>
            <p className="text-4xl font-extrabold text-[#4EC5C1]">99.98%</p>
            <p className="text-sm text-gray-500 mt-2">No major incidents reported.</p>
        </div>

      </div>
    </div>
  );
};

export default SystemStatus;