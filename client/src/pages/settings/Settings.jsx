
import { useState } from 'react';
import Papa from 'papaparse'; // CSV Parser
import { useAuth } from '../../context/AuthContext';
import { Upload, FileText, CheckCircle } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [importing, setImporting] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        console.log("Imported Data:", results.data);
        // Here you would send results.data to your backend API
        setTimeout(() => {
           alert(`Successfully imported ${results.data.length} records from Apple Health CSV.`);
           setImporting(false);
        }, 1500);
      }
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-secondary dark:text-white">Settings</h1>
      
      {/* Import Section */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-glass border border-gray-100 dark:border-gray-700">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-secondary dark:text-white">
          <Upload size={20} /> Data Import
        </h2>
        <p className="text-sm text-gray-500 mb-4">Import your Apple Health or Fitbit data via CSV.</p>
        
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer relative">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {importing ? (
            <div className="flex flex-col items-center animate-pulse">
               <CheckCircle className="text-primary mb-2" size={32} />
               <p className="font-bold text-secondary dark:text-white">Processing Data...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
               <FileText className="text-gray-400 mb-2" size={32} />
               <p className="font-bold text-secondary dark:text-white">Click to Upload CSV</p>
               <p className="text-xs text-gray-400">Max size 5MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;