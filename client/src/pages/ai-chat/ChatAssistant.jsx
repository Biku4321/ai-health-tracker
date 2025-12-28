// import { useState, useRef, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../services/api';
// import DOMPurify from 'dompurify';
// const ChatAssistant = () => {
//   const { user } = useAuth();
//   const [messages, setMessages] = useState([
//     {
//       role: 'assistant',
//       content: `Hello ${user?.name || 'there'}! I'm your AI Health Assistant. I've reviewed your recent logs. How can I help you today?`
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(scrollToBottom, [messages]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     // Add User Message
//     const userMsg = { role: 'user', content: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput('');
//     setLoading(true);

//     try {
//       // API Call (Replace with your actual API utility)
//       // const { data } = await axios.post('/api/ai/chat', { message: input }, headers...);
      
//       // Simulating API response for this code block to work standalone:
//       const response = await fetch('http://localhost:5000/api/ai/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${user.token}` // Assuming user object has token
//         },
//         body: JSON.stringify({ message: input })
//       });
//       const data = await response.json();

//       // Add AI Response
//       setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
//     } catch (error) {
//       setMessages((prev) => [...prev, { role: 'assistant', content: "I'm having trouble connecting right now." }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-[85vh] bg-white rounded-2xl shadow-xl overflow-hidden m-4 max-w-4xl mx-auto border border-gray-100">
      
//       {/* Header */}
//       <div className="bg-[#1A3C40] p-4 text-white flex items-center shadow-md">
//         <div className="w-10 h-10 rounded-full bg-[#4EC5C1] flex items-center justify-center mr-3 text-xl">
//           🤖
//         </div>
//         <div>
//           <h2 className="font-poppins font-bold">AI Health Assistant</h2>
//           <p className="text-xs text-[#4EC5C1] opacity-80">Powered by Gemini</p>
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F4F7F8]">
//         {messages.map((msg, idx) => (
//           <div
//             key={idx}
//             className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             <div
//               className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
//                 msg.role === 'user'
//                   ? 'bg-[#1A3C40] text-white rounded-tr-none'
//                   : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
//               }`}
//             >
//               {/* Simple Markdown rendering for AI responses */}
//               <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
//             </div>
//           </div>
//         ))}
//         {loading && (
//           <div className="flex justify-start">
//             <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex space-x-2">
//               <div className="w-2 h-2 bg-[#4EC5C1] rounded-full animate-bounce"></div>
//               <div className="w-2 h-2 bg-[#4EC5C1] rounded-full animate-bounce delay-75"></div>
//               <div className="w-2 h-2 bg-[#4EC5C1] rounded-full animate-bounce delay-150"></div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
//         <div className="flex space-x-2">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask about your diet, sleep, or mood..."
//             className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4EC5C1] focus:ring-1 focus:ring-[#4EC5C1] bg-gray-50"
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="px-6 py-3 bg-[#4EC5C1] text-[#1A3C40] font-bold rounded-xl hover:bg-[#3daea9] disabled:opacity-50 transition-colors"
//           >
//             Send
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ChatAssistant;
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import DOMPurify from 'dompurify';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const ChatAssistant = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
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
    socket.on('ai_stream_chunk', (chunk) => {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        // If last message is assistant, append to it. If user, create new assistant msg.
        if (lastMsg.role === 'assistant' && !lastMsg.isComplete) {
          const updatedMsg = { ...lastMsg, content: lastMsg.content + chunk };
          return [...prev.slice(0, -1), updatedMsg];
        } else {
          return [...prev, { role: 'assistant', content: chunk, isComplete: false }];
        }
      });
      setIsTyping(false);
    });

    // Listen for stream end
    socket.on('ai_stream_end', () => {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg.role === 'assistant') {
          return [...prev.slice(0, -1), { ...lastMsg, isComplete: true }];
        }
        return prev;
      });
    });

    return () => {
      socket.off('ai_stream_chunk');
      socket.off('ai_stream_end');
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

    // 2. Add placeholder for AI (if using streaming, this might be overwritten by the event listener above)
    // For socket io, we emit the message
    if (socket) {
      socket.emit('chat_message', { message: messageToSend, userId: user._id });
    } else {
      // Fallback if socket fails (HTTP)
      // Implementation omitted for brevity, but you'd use the api.post call here
      setIsTyping(false);
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
    <div className="flex flex-col h-[85vh] m-4 max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/50 dark:bg-[#1E293B]/50 backdrop-blur-xl">
      
      {/* Glassmorphic Header */}
      <div className="bg-gradient-to-r from-[#1A3C40] to-[#2D5C63] p-5 flex items-center shadow-lg z-10">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4 border border-white/20 backdrop-blur-md">
          <Sparkles className="text-[#4EC5C1]" size={24} />
        </div>
        <div>
          <h2 className="font-poppins font-bold text-white text-lg">AI Health Coach</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <p className="text-xs text-gray-300 font-medium">Online & Ready</p>
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
            <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-2xl rounded-tl-none flex space-x-1">
              <div className="w-2 h-2 bg-[#4EC5C1] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#4EC5C1] rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-[#4EC5C1] rounded-full animate-bounce delay-150"></div>
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
            aria-label="Chat input"
            className="flex-1 p-4 pr-12 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4EC5C1] transition-all text-gray-800 dark:text-white placeholder-gray-400"
          />
          <button 
            type="submit" 
            disabled={isTyping || !input.trim()}
            aria-label="Send Message"
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