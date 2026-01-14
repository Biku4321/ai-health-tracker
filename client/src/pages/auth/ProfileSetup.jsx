import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Activity, Target, AlertTriangle, CheckCircle, Ruler, Weight } from 'lucide-react';

const ProfileSetup = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    goal: 'General Fitness',
    password: '',
    confirmPassword: ''
  });

  // Load existing user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        age: user.age || '',
        height: user.height || '',
        weight: user.weight || '',
        goal: user.goal || 'General Fitness',
      }));

      // Check if profile is incomplete (Logic for new signups)
      if (!user.age || !user.height || !user.weight) {
        setWarning("⚠️ Please complete your profile to unlock the Dashboard & AI features.");
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Password Validation (only if user is trying to change it)
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("❌ Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      // Clean data before sending
      const { confirmPassword, ...dataToSend } = formData;
      if (!dataToSend.password) delete dataToSend.password; // Don't send empty password

      const updatedUser = await authService.updateProfile(dataToSend);
      
      // Update Context & Redirect
      login(updatedUser); 
      // alert("✅ Profile Updated Successfully!");
      navigate('/dashboard'); 
    } catch (error) {
      console.error("Profile Update Error:", error);
      alert("❌ Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F8] dark:bg-dark-bg px-4 py-12 transition-colors">
      <div className="max-w-2xl w-full bg-white dark:bg-dark-card rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#1A3C40] to-[#2D5C63] p-8 text-center relative">
          <h2 className="text-3xl font-poppins font-bold text-white mb-2">
            Profile Settings
          </h2>
          <p className="text-[#4EC5C1] text-sm">
            Keep your health data accurate for better AI insights.
          </p>
        </div>

        {/* Warning Banner for New Users */}
        {warning && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-800 p-4 flex items-center justify-center gap-2 text-yellow-700 dark:text-yellow-400 text-sm font-medium animate-pulse">
            <AlertTriangle size={18} />
            {warning}
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-gray-800 dark:text-white font-bold text-lg flex items-center gap-2 border-b pb-2 dark:border-gray-700">
              <User size={20} className="text-[#4EC5C1]" /> Personal Details
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#4EC5C1] outline-none bg-gray-50 dark:bg-gray-800 dark:text-white"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#4EC5C1] outline-none bg-gray-50 dark:bg-gray-800 dark:text-white"
                  placeholder="25"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Body Stats */}
          <div className="space-y-4">
            <h3 className="text-gray-800 dark:text-white font-bold text-lg flex items-center gap-2 border-b pb-2 dark:border-gray-700">
              <Activity size={20} className="text-[#4EC5C1]" /> Body Metrics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 flex items-center gap-1">
                  <Ruler size={14} /> Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#4EC5C1] outline-none bg-gray-50 dark:bg-gray-800 dark:text-white"
                  placeholder="175"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 flex items-center gap-1">
                  <Weight size={14} /> Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#4EC5C1] outline-none bg-gray-50 dark:bg-gray-800 dark:text-white"
                  placeholder="70"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 flex items-center gap-1">
                <Target size={14} /> Primary Goal
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full px-4 py-3 border dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#4EC5C1] outline-none bg-gray-50 dark:bg-gray-800 dark:text-white cursor-pointer"
              >
                <option>General Fitness</option>
                <option>Weight Loss</option>
                <option>Weight Gain</option>
                <option>Mental Wellness</option>
                <option>Build Muscle</option>
              </select>
            </div>
          </div>

          {/* Section 3: Security (Optional) */}
          <div className="space-y-4">
            <h3 className="text-gray-800 dark:text-white font-bold text-lg flex items-center gap-2 border-b pb-2 dark:border-gray-700">
              <Lock size={20} className="text-[#4EC5C1]" /> Security <span className="text-xs text-gray-400 font-normal ml-auto">(Optional: Leave blank to keep current)</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#4EC5C1] outline-none bg-gray-50 dark:bg-gray-800 dark:text-white"
                placeholder="New Password"
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#4EC5C1] outline-none bg-gray-50 dark:bg-gray-800 dark:text-white"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#1A3C40] to-[#2D5C63] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Saving...' : <><CheckCircle size={20} /> Save & Continue</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;