import { useState, useRef } from 'react';
import { Mic, Square, Loader2, Sparkles } from 'lucide-react';
import api from '../../services/api';

const VoiceRecorder = ({ onAnalysisComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleUpload(audioBlob);
        
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Could not access microphone.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const handleUpload = async (audioBlob) => {
    const formData = new FormData();
    // FileName must have extension for some parsers
    formData.append('audio', audioBlob, 'voice-log.webm');

    try {
      const { data } = await api.post('/ai/analyze-voice', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onAnalysisComplete(data);
    } catch (error) {
      console.error(error);
      alert("Voice analysis failed. Try speaking clearer.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg ${
          isRecording 
            ? 'bg-red-500 text-white animate-pulse' 
            : isProcessing 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary to-blue-500 text-white hover:scale-105 active:scale-95'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="animate-spin" size={20} /> Processing...
          </>
        ) : isRecording ? (
          <>
            <Square size={20} fill="currentColor" /> Stop Recording
          </>
        ) : (
          <>
            <Mic size={20} /> Voice Log
          </>
        )}
      </button>
      
      {/* Floating tooltip suggestion */}
      {!isRecording && !isProcessing && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white text-xs px-3 py-1 rounded-full opacity-0 hover:opacity-100 transition-opacity">
          "Try: I slept 7 hours and feel happy!"
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;