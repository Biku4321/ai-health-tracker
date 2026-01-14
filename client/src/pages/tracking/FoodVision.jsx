import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2, CheckCircle, X } from 'lucide-react';
import api from '../../services/api'; 

const FoodVision = ({ onLogSuccess }) => {
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(Object.assign(file, { preview: URL.createObjectURL(file) }));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: {'image/*': []} });

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    
    // Create FormData to send file to backend
    const formData = new FormData();
    formData.append('image', image);

    try {
      const { data } = await api.post('/ai/analyze-food', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(data);
    } catch (error) {
      console.error("Vision Error", error);
    } finally {
      setLoading(false);
    }
  };

  const saveLog = () => {
    if (onLogSuccess && analysis) {
      onLogSuccess({
        mealName: analysis.foodName,
        calories: analysis.calories,
        macros: analysis.macros
      });
      setImage(null);
      setAnalysis(null);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence>
        {!analysis ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center cursor-pointer hover:border-primary transition-colors bg-gray-50 dark:bg-gray-800/50"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {image ? (
              <div className="relative">
                 <img src={image.preview} alt="Preview" className="h-48 mx-auto rounded-lg object-cover shadow-lg" />
                 <button onClick={(e) => { e.stopPropagation(); setImage(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"><X size={16}/></button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-2">
                  <Camera size={32} />
                </div>
                <p className="font-bold">Snap or Upload your Meal</p>
                <p className="text-xs">AI will calculate calories & macros</p>
              </div>
            )}
            
            {image && (
              <button 
                onClick={(e) => { e.stopPropagation(); analyzeImage(); }}
                disabled={loading}
                className="mt-4 bg-primary text-secondary px-6 py-2 rounded-xl font-bold flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Analyze Food"}
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-primary/20"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-secondary dark:text-white">{analysis.foodName}</h3>
                <p className="text-sm text-gray-500">{analysis.calories} kcal</p>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <CheckCircle size={12} /> High Protein
              </div>
            </div>
            
            {/* Macro Bars */}
            <div className="space-y-3 mb-6">
              {Object.entries(analysis.macros).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1 capitalize text-gray-600 dark:text-gray-300">
                    <span>{key}</span>
                    <span>{value}g</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${(value/100)*100}%` }}
                      className={`h-full ${key === 'protein' ? 'bg-blue-500' : key === 'carbs' ? 'bg-orange-500' : 'bg-yellow-500'}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button onClick={saveLog} className="w-full bg-secondary text-white py-3 rounded-xl font-bold">
              Add to Diary
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodVision;