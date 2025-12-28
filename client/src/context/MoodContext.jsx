import { createContext, useContext, useState, useEffect } from 'react';

const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  const [currentMood, setCurrentMood] = useState('Neutral');

  // Map mood labels to CSS gradient classes
  const getMoodGradient = (mood) => {
    switch (mood?.toLowerCase()) {
      case 'happy':
      case 'energetic':
      case 'excited':
        return 'mood-warm'; // Orange/Yellow
      case 'stressed':
      case 'anxious':
      case 'angry':
        return 'mood-intense'; // Red/Purple
      case 'calm':
      case 'relaxed':
      case 'focused':
        return 'mood-calm'; // Teal/Green
      case 'sad':
      case 'tired':
        return 'mood-cool'; // Blue/Grey
      default:
        return 'mood-default'; // Original Mesh
    }
  };

  return (
    <MoodContext.Provider value={{ currentMood, setCurrentMood, moodGradient: getMoodGradient(currentMood) }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => useContext(MoodContext);