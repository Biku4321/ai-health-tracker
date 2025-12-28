import { createContext, useContext, useState, useEffect } from 'react';
import logService from '../services/logService';
import { useAuth } from './AuthContext';

const HealthDataContext = createContext();

export const HealthDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshLogs = async () => {
    if (user) {
      setLoading(true);
      try {
        const data = await logService.getWeeklyLogs();
        setLogs(data.reverse()); // Chronological
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    refreshLogs();
  }, [user]);

  return (
    <HealthDataContext.Provider value={{ logs, refreshLogs, loading }}>
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => useContext(HealthDataContext);