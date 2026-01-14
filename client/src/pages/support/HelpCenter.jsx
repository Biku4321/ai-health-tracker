import React from 'react';
import { Link } from 'react-router-dom';
import { Search, HelpCircle, MessageCircle, FileText, Mail } from 'lucide-react';

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-[#F4F7F8] dark:bg-[#0F172A] pt-24 pb-12 px-6 transition-colors duration-300">
      
      {/* Search Header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">How can we help you?</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for answers..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-teal-500 outline-none shadow-sm dark:text-white transition-all"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        
        {/* FAQ Card */}
        <Link to="/faq" className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg transition-all group">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <HelpCircle size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">FAQs</h3>
          <p className="text-gray-500 dark:text-gray-400">Find answers to commonly asked questions about tracking and AI.</p>
        </Link>

        {/* Contact Support Card */}
        <Link to="/contact" className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg transition-all group">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Mail size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Contact Support</h3>
          <p className="text-gray-500 dark:text-gray-400">Need specific help? Reach out to our support team directly.</p>
        </Link>

        {/* Community Card */}
        <Link to="/community" className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg transition-all group">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <MessageCircle size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Community Forum</h3>
          <p className="text-gray-500 dark:text-gray-400">Join discussions with other users and share your journey.</p>
        </Link>

      </div>
    </div>
  );
};

export default HelpCenter;