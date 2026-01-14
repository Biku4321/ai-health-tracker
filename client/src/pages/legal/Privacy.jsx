import React from 'react';
import { Shield, Lock, Eye, Database, FileText } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#F4F7F8] dark:bg-[#0F172A] pt-24 pb-12 px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
          <p className="text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Database size={20} className="text-teal-500" /> 1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, log health data (mood, sleep, diet), or communicate with our AI Coach. This may include your name, email, age, and health metrics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Eye size={20} className="text-teal-500" /> 2. How We Use Your Data
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide personalized AI health insights and clinical summaries.</li>
              <li>To maintain and improve our services.</li>
              <li>To monitor trends and usage (anonymously).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Lock size={20} className="text-teal-500" /> 3. Data Security
            </h2>
            <p>
              We use industry-standard encryption to protect your personal health information. Your data is stored securely and is never sold to third-party advertisers. You have full control to export or delete your data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FileText size={20} className="text-teal-500" /> 4. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal data. You can manage these settings directly from your Profile Dashboard or by contacting support.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default Privacy;