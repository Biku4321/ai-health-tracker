import { useState, useCallback } from 'react';
import api from '../services/api';

const useAIResponse = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const triggerAI = useCallback(async (payload, headers = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(endpoint, payload, { headers });
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'AI Service Failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return { data, loading, error, triggerAI, reset: () => setData(null) };
};

export default useAIResponse;