import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import DOMPurify from 'dompurify';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'; // Added Loader2

const ChatAssistant = () => {
  const { user } = useAuth();
  const { socket,isConnected } = useSocket();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `Hello ${user?.name || 'there'}! I'm your AI Health Assistant. I've reviewed your recent logs. How can I help you today?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // WebSocket Listeners for Streaming
  useEffect(() => {
    if (!socket) return;

    // Listen for incoming chunks of text
    const handleChunk = (chunk) => {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        // If last message is assistant and incomplete, append to it
        if (lastMsg.role === 'assistant' && !lastMsg.isComplete) {
          const updatedMsg = { ...lastMsg, content: lastMsg.content + chunk };
          return [...prev.slice(0, -1), updatedMsg];
        } else {
          // Otherwise start new message block
          return [...prev, { role: 'assistant', content: chunk, isComplete: false }];
        }
      });
      // Stop typing animation as soon as first chunk arrives
      setIsTyping(false);
    };

    // Listen for stream end
    const handleStreamEnd = () => {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg.role === 'assistant') {
          return [...prev.slice(0, -1), { ...lastMsg, isComplete: true }];
        }
        return prev;
      });
      setIsTyping(false);
    };

    // [FIX] Handle Errors to stop loading state
    const handleError = (err) => {
      console.error("AI Chat Error:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ I'm having trouble connecting to the server. Please try again later.", isComplete: true }]);
      setIsTyping(false);
    };

    socket.on('ai_stream_chunk', handleChunk);
    socket.on('ai_stream_end', handleStreamEnd);
    socket.on('error', handleError);
    socket.on('connect_error', handleError);

    return () => {
      socket.off('ai_stream_chunk', handleChunk);
      socket.off('ai_stream_end', handleStreamEnd);
      socket.off('error', handleError);
      socket.off('connect_error', handleError);
    };
  }, [socket]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message immediately
    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    const messageToSend = input;
    setInput('');
    setIsTyping(true);

    // 2. Emit to Server
    if (socket && isConnected) {
      socket.emit('chat_message', { message: messageToSend, userId: user._id });
    } else {
      // Fallback if socket is disconnected
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Chat server is offline. Please refresh the page.", isComplete: true }]);
    }
  };

  // Secure HTML Rendering
  const renderContent = (content) => {
    // Simple markdown parsing
    let formatted = content
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    return { __html: DOMPurify.sanitize(formatted) };
  };

  return (
    <div className="flex flex-col h-[85vh] m-4 max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/50 dark:bg-[#1E293B]/50 backdrop-blur-xl transition-colors duration-300">
      
      {/* Glassmorphic Header */}
      <div className="bg-gradient-to-r from-[#1A3C40] to-[#2D5C63] p-5 flex items-center shadow-lg z-10">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4 border border-white/20 backdrop-blur-md">
          <Sparkles className="text-[#4EC5C1]" size={24} />
        </div>
        <div>
          <h2 className="font-poppins font-bold text-white text-lg">AI Health Coach</h2>
          <div className="flex items-center gap-2">
            {/* [NEW] Use isConnected state for UI */}
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></span>
            <p className="text-xs text-gray-300 font-medium">
              {isConnected ? 'Online & Ready' : 'Connecting...'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            {/* Avatar for Bot */}
            {msg.role === 'assistant' && (
               <div className="w-8 h-8 rounded-full bg-[#4EC5C1] flex items-center justify-center mr-2 mt-1 shadow-sm shrink-0">
                 <Bot size={16} className="text-[#1A3C40]" />
               </div>
            )}

            <div 
              className={`max-w-[85%] p-4 rounded-2xl text-sm leading-7 shadow-sm backdrop-blur-sm border ${
                msg.role === 'user' 
                  ? 'bg-[#1A3C40] text-white rounded-tr-none border-[#1A3C40]' 
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 rounded-tl-none border-white/40 dark:border-gray-600'
              }`}
            >
              <div dangerouslySetInnerHTML={renderContent(msg.content)} />
            </div>

             {/* Avatar for User */}
             {msg.role === 'user' && (
               <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ml-2 mt-1 shadow-sm shrink-0">
                 <User size={16} className="text-gray-500" />
               </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start items-center ml-10">
            <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-2xl rounded-tl-none flex space-x-1 items-center border border-white/20 dark:border-gray-700">
              <Loader2 className="animate-spin text-[#4EC5C1]" size={16} />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-2">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 dark:bg-[#1E293B]/80 border-t border-gray-100 dark:border-gray-700 backdrop-blur-md">
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your health stats..."
            disabled={!socket?.connected}
            className="flex-1 p-4 pr-12 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4EC5C1] transition-all text-gray-800 dark:text-white placeholder-gray-400 disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={isTyping || !input.trim() || !socket?.connected}
            className="absolute right-2 p-2 bg-[#4EC5C1] text-[#1A3C40] rounded-xl hover:bg-[#3daea9] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md transform active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;