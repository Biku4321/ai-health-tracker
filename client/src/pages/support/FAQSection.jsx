import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 dark:border-gray-700 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-6 text-left focus:outline-none"
      >
        <span className="font-bold text-gray-900 dark:text-white text-lg">{question}</span>
        {isOpen ? <ChevronUp className="text-teal-500" /> : <ChevronDown className="text-gray-400" />}
      </button>
      {isOpen && (
        <div className="pb-6 text-gray-600 dark:text-gray-300 leading-relaxed animate-fadeIn">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      q: "How accurate is the Food Vision AI?",
      a: "Our AI is trained on thousands of food images and is generally about 90-95% accurate. However, lighting and portion visibility can affect results. We recommend double-checking the macros for strict medical diets."
    },
    {
      q: "Is my health data private?",
      a: "Absolutely. We use end-to-end encryption for your journals and logs. Your data is never sold to third parties. You can read more in our Privacy Policy."
    },
    {
      q: "Can I export my data to share with a doctor?",
      a: "Yes! Go to the 'Reports' section in your dashboard. You can generate a comprehensive PDF summary of your last week or month to print or email to your healthcare provider."
    },
    {
      q: "Is the basic plan free?",
      a: "Yes, HealthAI is free for core features like mood tracking and basic logging. Premium features like advanced AI Clinical Reports and unlimited voice logs are part of our Pro plan."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F8] dark:bg-[#0F172A] pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h1>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm p-6 md:p-10">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;