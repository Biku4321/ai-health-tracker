import React, { useState } from 'react';
import { Mail, Send, MapPin, Loader2 } from 'lucide-react';
import authService from '../../services/authService'; // ✅ Import Service

const ContactSupport = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ Call Backend API
      await authService.contactSupport(formData);
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', message: '' }); // Reset Form
    } catch (err) {
      console.error(err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F8] dark:bg-[#0F172A] pt-24 pb-12 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Get in touch</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Have a question about the AI? Found a bug? Or just want to say hi? We'd love to hear from you.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-full flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email us</p>
                <p className="font-bold text-gray-900 dark:text-white">support@healthai.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Office</p>
                <p className="font-bold text-gray-900 dark:text-white">123 AI Street, Tech City, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
          {submitted ? (
            <div className="text-center py-12 animate-fadeIn">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
              <p className="text-gray-500 dark:text-gray-400">We'll get back to you within 24 hours.</p>
              <button 
                onClick={() => setSubmitted(false)} 
                className="mt-6 text-teal-600 font-bold hover:underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all" 
                    placeholder="John" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all" 
                    placeholder="Doe" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white transition-all" 
                  placeholder="john@example.com" 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 h-32 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 dark:text-white resize-none transition-all" 
                  placeholder="How can we help?" 
                  required
                ></textarea>
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                  {error}
                </p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <> <Loader2 className="animate-spin" size={20} /> Sending... </>
                ) : (
                  <> <Send size={20} /> Send Message </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ContactSupport;