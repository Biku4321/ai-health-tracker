import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github, 
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#0F172A] border-t border-gray-100 dark:border-gray-800 pt-20 pb-10 transition-colors duration-300 font-inter">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* --- Top Section: Grid Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* 1. Brand & Newsletter (Takes 4 columns space) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-teal-500/20">
                H
              </div>
              <span className="font-bold text-2xl text-gray-900 dark:text-white tracking-tight">
                Health<span className="text-teal-500">AI</span>
              </span>
            </Link>
            
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed pr-4">
              Your personal AI health companion. We combine advanced technology with medical knowledge to help you live a longer, healthier life.
            </p>

            {/* Fake Newsletter Input */}
            <div className="pt-2">
              <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                Stay Updated
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-teal-500 dark:text-white transition-all"
                />
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 rounded-lg flex items-center justify-center transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Spacer Column (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* 2. Product Links (2 Cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><FooterLink to="/track">Food Vision AI</FooterLink></li>
              <li><FooterLink to="/chat">Smart Coach</FooterLink></li>
              <li><FooterLink to="/journal">Mood Journal</FooterLink></li>
              <li><FooterLink to="/report">Health Reports</FooterLink></li>
              <li><FooterLink to="/dashboard">Dashboard</FooterLink></li>
            </ul>
          </div>

          {/* 3. Support Links (2 Cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><FooterLink to="/help">Help Center</FooterLink></li>
              <li><FooterLink to="/faq">FAQs</FooterLink></li>
              <li><FooterLink to="/contact">Contact Us</FooterLink></li>
              <li><FooterLink to="/community">Community</FooterLink></li>
              <li><FooterLink to="/status">System Status</FooterLink></li>
            </ul>
          </div>

          {/* 4. Legal Links (3 Cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-gray-900 dark:text-white mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink to="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink to="/cookie">Cookie Settings</FooterLink></li>
              <li><FooterLink to="/security">Security</FooterLink></li>
            </ul>
          </div>
        </div>

        {/* --- Bottom Section --- */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} HealthAI Platform. All rights reserved.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <SocialLink href="#" icon={Twitter} />
            <SocialLink href="#" icon={Instagram} />
            <SocialLink href="#" icon={Linkedin} />
            <SocialLink href="#" icon={Github} />
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700">
            <span>Made with</span>
            <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper for Links with Hover Animation
const FooterLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="block hover:text-teal-600 dark:hover:text-teal-400 transition-all duration-200 hover:translate-x-1"
  >
    {children}
  </Link>
);

// Helper for Social Icons
const SocialLink = ({ href, icon: Icon }) => (
  <a 
    href={href} 
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-teal-500 hover:text-white dark:hover:bg-teal-500 hover:border-teal-500 transition-all duration-300"
  >
    <Icon size={18} />
  </a>
);

export default Footer;