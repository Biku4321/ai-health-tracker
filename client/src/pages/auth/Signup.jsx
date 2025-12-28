import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { User, Mail, Lock } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await authService.signup({ name, email, password });
      login(userData);
      navigate('/profile-setup'); // Redirect to profile setup first
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-[#1A3C40] dark:text-white mb-2">Join HealthAI</h2>
        <p className="text-center text-gray-500 mb-8">Start tracking your physical & mental health</p>
        
        <form onSubmit={handleSubmit}>
          <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} icon={User} required />
          <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} icon={Lock} required />
          
          <Button type="submit" isLoading={loading}>Create Account</Button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-[#4EC5C1] font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;