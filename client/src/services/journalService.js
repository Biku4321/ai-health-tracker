import api from './api';

const analyzeJournal = async (text) => {
  const response = await api.post('/ai/analyze-journal', { text });
  return response.data;
};

const saveJournal = async (journalData) => {
  const response = await api.post('/journals', journalData);
  return response.data;
};

const getAllJournals = async () => {
  const response = await api.get('/journals');
  return response.data;
};

export default { analyzeJournal, saveJournal, getAllJournals };