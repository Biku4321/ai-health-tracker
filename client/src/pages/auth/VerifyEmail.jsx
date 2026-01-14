import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const userData = await authService.verifyEmail(token);
        
        login(userData);
        setStatus('success');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);

      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F8] dark:bg-dark-bg p-4">
      <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
        
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 text-[#4EC5C1] animate-spin" />
            <h2 className="text-xl font-bold dark:text-white">Verifying your account...</h2>
            <p className="text-gray-500">Please wait a moment.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 animate-fadeIn">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h2 className="text-xl font-bold dark:text-white">Verified Successfully!</h2>
            <p className="text-gray-500">Redirecting you to dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 animate-fadeIn">
            <XCircle className="w-16 h-16 text-red-500" />
            <h2 className="text-xl font-bold dark:text-white">Verification Failed</h2>
            <p className="text-gray-500">The link is invalid or expired.</p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-4 bg-[#1A3C40] text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
            >
              Go to Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;