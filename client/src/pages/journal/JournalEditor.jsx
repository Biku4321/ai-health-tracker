import { useState } from 'react';
import journalService from '../../services/journalService'; // Use new service
import Button from '../../components/common/Button';
import { Sparkles, Save, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JournalEditor = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const result = await journalService.analyzeJournal(text);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      alert("AI Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!analysis) return;
    try {
      await journalService.saveJournal({
        content: text,
        ...analysis // spreads mood, summary, advice, sentimentScore
      });
      alert("Journal Saved Successfully!");
      navigate('/journal/history'); // Go to history after save
    } catch (error) {
      alert("Failed to save journal");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-[#1A3C40] dark:text-white mb-6">AI Journal</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card h-fit">
          <label className="block font-bold mb-2 dark:text-gray-200">How are you feeling right now?</label>
          <textarea
            className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#4EC5C1] outline-none resize-none dark:text-white"
            placeholder="I'm feeling..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <div className="mt-4 flex gap-3">
            <Button onClick={handleAnalyze} isLoading={loading}>
              <Sparkles size={18} /> Analyze
            </Button>
            {analysis && (
              <Button onClick={handleSave} variant="secondary">
                <Save size={18} /> Save Entry
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {analysis ? (
            <>
              <div className="card bg-gradient-to-br from-[#4EC5C1]/10 to-[#1A3C40]/5 border-[#4EC5C1]">
                <h3 className="font-bold text-[#1A3C40] dark:text-[#4EC5C1] mb-2">AI Analysis</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">
                     {analysis.mood === 'Happy' ? '😄' : analysis.mood === 'Sad' ? '😢' : '😐'}
                  </div>
                  <div>
                    <p className="font-bold text-xl dark:text-white">{analysis.mood}</p>
                    <p className="text-xs text-gray-500">Score: {analysis.sentimentScore}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{analysis.summary}"</p>
              </div>
              <div className="card border-l-4 border-l-[#1A3C40]">
                <h4 className="font-bold mb-2 text-sm uppercase text-gray-400">Suggestion</h4>
                <p className="dark:text-white">{analysis.advice}</p>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-50 border-2 border-dashed border-gray-300 rounded-2xl p-8">
              <Sparkles size={48} className="mb-4 text-gray-400" />
              <p className="text-center text-sm">Write & Analyze to see AI insights.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalEditor;