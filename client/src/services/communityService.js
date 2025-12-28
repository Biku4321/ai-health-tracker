import api from './api';

const getLeaderboard = async () => {
  const { data } = await api.get('/community/leaderboard');
  return data;
};

const getPartners = async () => {
  const { data } = await api.get('/community/partners');
  return data;
};

const invitePartner = async (email) => {
  const { data } = await api.post('/community/partner/invite', { email });
  return data;
};

const acceptPartner = async (requestId) => {
  const { data } = await api.post('/community/partner/accept', { requestId });
  return data;
};

export default { getLeaderboard, getPartners, invitePartner, acceptPartner };