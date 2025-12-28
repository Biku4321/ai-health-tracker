import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await authService.login({ email, password });
      login(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-[#1A3C40] dark:text-white mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8">Login to continue your health journey</p>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            icon={Mail}
            required 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            icon={Lock}
            required 
          />
          
          <Button type="submit" isLoading={loading}>Login</Button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          New here? <Link to="/signup" className="text-[#4EC5C1] font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;