import { useEffect, useState } from 'react';
import journalService from '../../services/journalService';
import Loader from '../../components/common/Loader';

const JournalHistory = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const data = await journalService.getAllJournals();
        setJournals(data);
      } catch (error) {
        console.error("Failed to fetch journals");
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Past Entries</h1>
      <div className="grid gap-4">
        {journals.map((entry) => (
          <div key={entry._id} className="card hover:shadow-md transition">
             <div className="flex justify-between mb-2">
               <span className="font-bold text-gray-500 text-sm">{new Date(entry.createdAt).toLocaleDateString()}</span>
               <span className={`font-bold px-2 py-1 rounded text-xs ${entry.mood === 'Happy' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                 {entry.mood}
               </span>
             </div>
             <p className="text-gray-700 dark:text-gray-300 line-clamp-2 italic">"{entry.summary}"</p>
             <div className="mt-2 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded">
               Advice: {entry.advice}
             </div>
          </div>
        ))}
        {journals.length === 0 && <p className="text-gray-500 text-center">No journals found.</p>}
      </div>
    </div>
  );
};

export default JournalHistory;