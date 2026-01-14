import React from 'react';
import { Shield, Lock, Eye, Database, Globe, Check } from 'lucide-react';

const Security = () => {
  return (
    <div className="min-h-screen bg-[#F4F7F8] dark:bg-[#0F172A] pt-24 pb-12 px-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <Shield size={64} className="text-[#4EC5C1] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-[#1A3C40] dark:text-white mb-4">
            Security at HealthAI
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Protecting your health data is our top priority. We use enterprise-grade encryption and security practices.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <SecurityCard 
            icon={Lock} 
            title="End-to-End Encryption" 
            desc="Your personal health logs and chats are encrypted in transit and at rest using AES-256 encryption." 
          />
          <SecurityCard 
            icon={Eye} 
            title="Privacy First" 
            desc="We never sell your data. Your health records are only accessible to you and the AI features you authorize." 
          />
          <SecurityCard 
            icon={Database} 
            title="Secure Infrastructure" 
            desc="Hosted on secure cloud servers with 24/7 monitoring and automated threat detection." 
          />
          <SecurityCard 
            icon={Globe} 
            title="GDPR & HIPAA Compliant" 
            desc="We follow strict international guidelines for handling sensitive medical and personal data." 
          />
        </div>

        {/* Audit Section */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-[#1A3C40] dark:text-white mb-6">Security Checklist</h2>
          <div className="space-y-4">
            <CheckItem text="Regular Penetration Testing" />
            <CheckItem text="Two-Factor Authentication (Coming Soon)" />
            <CheckItem text="Automated Daily Backups" />
            <CheckItem text="Strict Access Control Policies" />
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Components
const SecurityCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 rounded-xl flex items-center justify-center text-[#4EC5C1] mb-4">
      <Icon size={24} />
    </div>
    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400">{desc}</p>
  </div>
);

const CheckItem = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400">
      <Check size={16} />
    </div>
    <span className="text-gray-700 dark:text-gray-300 font-medium">{text}</span>
  </div>
);

export default Security;