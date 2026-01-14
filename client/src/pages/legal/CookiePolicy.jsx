import React, { useState } from 'react';
import { Cookie, Save, Shield } from 'lucide-react';

const CookiePolicy = () => {
  const [settings, setSettings] = useState({
    essential: true, // Always true
    analytics: true,
    marketing: false,
  });

  const toggle = (key) => {
    if (key === 'essential') return;
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    alert("Preferences Saved! (This is a demo)");
  };

  return (
    <div className="min-h-screen bg-[#F4F7F8] dark:bg-[#0F172A] pt-24 pb-12 px-6 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        
        <div className="flex items-center gap-3 mb-6">
          <Cookie size={32} className="text-[#4EC5C1]" />
          <h1 className="text-3xl font-bold text-[#1A3C40] dark:text-white">Cookie Settings</h1>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We use cookies to improve your experience. You can customize your preferences below. 
          Note that blocking some cookies may impact your experience on the site.
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
          
          {/* Essential Cookies */}
          <div className="p-6 flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Essential Cookies</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                Strictly necessary for the website to function (e.g., login, security). These cannot be disabled.
              </p>
            </div>
            <div className="relative inline-flex items-center cursor-not-allowed opacity-50">
              <input type="checkbox" checked readOnly className="sr-only peer" />
              <div className="w-11 h-6 bg-teal-600 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="p-6 flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Analytics Cookies</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                Help us understand how you use our site so we can improve it. Data is anonymous.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.analytics} 
                onChange={() => toggle('analytics')} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4EC5C1]"></div>
            </label>
          </div>

          {/* Marketing Cookies */}
          <div className="p-6 flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Marketing Cookies</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md">
                Used to deliver personalized advertisements relevant to your interests.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.marketing} 
                onChange={() => toggle('marketing')} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4EC5C1]"></div>
            </label>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="mt-8 bg-[#1A3C40] hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
        >
          <Save size={18} /> Save Preferences
        </button>

      </div>
    </div>
  );
};

export default CookiePolicy;