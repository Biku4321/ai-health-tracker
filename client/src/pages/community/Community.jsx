import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import communityService from '../../services/communityService';
import Avatar from '../../components/gamification/Avatar';
import { Trophy, Users, UserPlus, Check, X, Hand } from 'lucide-react';

const Community = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [leaders, setLeaders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [requests, setRequests] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'leaderboard') {
        const data = await communityService.getLeaderboard();
        setLeaders(data);
      } else {
        const data = await communityService.getPartners();
        setPartners(data.partners);
        setRequests(data.requests);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await communityService.invitePartner(inviteEmail);
      alert('Invite sent!');
      setInviteEmail('');
    } catch (error) {
      alert('Failed to send invite. Check email.');
    }
  };

  const handleAccept = async (id) => {
    await communityService.acceptPartner(id);
    fetchData(); // refresh
  };

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-poppins font-bold text-secondary dark:text-white">Community Hub</h1>
        <p className="text-gray-500 dark:text-gray-400">Compete, connect, and grow together.</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`pb-3 px-4 font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'leaderboard' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'
          }`}
        >
          <Trophy size={20} /> Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('partners')}
          className={`pb-3 px-4 font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'partners' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'
          }`}
        >
          <Users size={20} /> Partners
        </button>
      </div>

      {/* LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-dark-card rounded-3xl shadow-glass overflow-hidden animate-fadeIn">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Rank</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">User</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase">Level</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {leaders.map((leader, index) => (
                <tr key={leader._id} className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition ${user._id === leader._id ? 'bg-primary/10' : ''}`}>
                  <td className="p-4 font-bold text-secondary dark:text-white">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <Avatar level={leader.gamification.level} size="sm" />
                    <span className="font-bold text-secondary dark:text-white">{leader.name} {user._id === leader._id && '(You)'}</span>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 font-medium">Lvl {leader.gamification.level}</td>
                  <td className="p-4 text-right font-bold text-primary">{leader.gamification.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PARTNERS TAB */}
      {activeTab === 'partners' && (
        <div className="grid md:grid-cols-2 gap-8 animate-fadeIn">
          
          {/* My Partners List */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-secondary dark:text-white">Your Squad</h3>
            {partners.length === 0 && <p className="text-gray-400 italic">No partners yet. Invite someone!</p>}
            
            {partners.map((partner) => (
              <div key={partner._id} className="bg-white dark:bg-dark-card p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar level={partner.gamification.level} size="sm" />
                  <div>
                    <h4 className="font-bold text-secondary dark:text-white">{partner.name}</h4>
                    <p className="text-xs text-orange-500">🔥 {partner.gamification.streak} Day Streak</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert(`High Five sent to ${partner.name}! 👋`)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition"
                  title="Send High Five"
                >
                  <Hand size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Invites & Requests */}
          <div className="space-y-6">
            
            {/* Invite Form */}
            <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 rounded-2xl border border-primary/20">
              <h3 className="font-bold text-lg text-secondary dark:text-white mb-2 flex items-center gap-2">
                <UserPlus size={20} /> Invite Friend
              </h3>
              <form onSubmit={handleInvite} className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="friend@email.com" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 p-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  required
                />
                <button type="submit" className="bg-primary text-secondary px-4 py-2 rounded-xl font-bold">
                  Send
                </button>
              </form>
            </div>

            {/* Pending Requests */}
            {requests.length > 0 && (
              <div>
                <h3 className="font-bold text-lg text-secondary dark:text-white mb-2">Pending Requests</h3>
                <div className="space-y-2">
                  {requests.map((req) => (
                    <div key={req._id} className="bg-white dark:bg-dark-card p-3 rounded-xl flex justify-between items-center shadow-sm">
                      <span className="text-sm dark:text-white">{req.sender.name} wants to connect.</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleAccept(req.sender._id)} className="p-1 bg-green-100 text-green-600 rounded-lg"><Check size={18}/></button>
                        <button className="p-1 bg-red-100 text-red-600 rounded-lg"><X size={18}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;