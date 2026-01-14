import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import GoogleLogin from '../auth/GoogleLogin'; 
import { User, Mail, Lock, CheckCircle } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      if (response.token) {
        login(response);
        navigate('/profile-setup');
      } else {
        alert("✅ Account created! Please check your email.");
        navigate('/login');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F4F7F8] dark:bg-dark-bg transition-colors">
      <div className="card max-w-md w-full bg-white dark:bg-dark-card shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-[#1A3C40] dark:text-white mb-2">Join HealthAI</h2>
        <p className="text-center text-gray-500 mb-6">Start tracking your physical & mental health</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            type="text" name="name" placeholder="Full Name" 
            value={formData.name} onChange={handleChange} icon={User} required 
          />
          <Input 
            type="email" name="email" placeholder="Email Address" 
            value={formData.email} onChange={handleChange} icon={Mail} required 
          />
          <Input 
            type="password" name="password" placeholder="Password" 
            value={formData.password} onChange={handleChange} icon={Lock} required 
          />
          <Input 
            type="password" name="confirmPassword" placeholder="Confirm Password" 
            value={formData.confirmPassword} onChange={handleChange} icon={CheckCircle} required 
          />
          
          <Button type="submit" isLoading={loading}>Create Account</Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-dark-card text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-4">
          <GoogleLogin />
        </div>

        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-[#4EC5C1] font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;