import api from './api'; 
const createLog = async (logData) => {
  const response = await api.post('/logs', logData);
  return response.data;
};

const getWeeklyLogs = async () => {
  const response = await api.get('/logs');
  return response.data;
};

const analyzeJournal = async (text) => {
  const response = await api.post('/ai/analyze-journal', { text });
  return response.data;
};

export default { createLog, getWeeklyLogs, analyzeJournal };