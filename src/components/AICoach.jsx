import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { chatWithCoach } from '../services/aiService';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AICoach() {
  const { state } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Seed initial message based on user state only when opened the first time
    if (isOpen && messages.length === 0 && state.idea) {
      setMessages([
        {
          role: 'model',
          content: `Namaste ${state.user?.name || 'Founder'}! I know building "${state.idea}" is tough, and your biggest fear is **${state.user?.fear || 'Failure'}**. Don't worry, I am here to guide you through the Indian market realities. What do you need help with right now?`
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await chatWithCoach({
        messages: newMessages,
        startup: state,
        language: state.language
      });
      setMessages([...newMessages, { role: 'model', content: response }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'model', content: "I'm having trouble connecting to my knowledge base. Please check your connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!state.idea) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-[#FF6B35] text-white p-4 rounded-full shadow-[0_8px_30px_rgba(255,107,53,0.4)] hover:scale-110 active:scale-95 transition-all ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Slide-out Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-[#16213e] border-l-2 border-[#1a1a2e] z-50 transform transition-transform duration-300 ease-out flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-4 border-b-2 border-white/5 flex items-center justify-between bg-[#1a1a2e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF6B35]/20 flex items-center justify-center border border-[#FF6B35]/50">
              <Bot className="w-6 h-6 text-[#FF6B35]" />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-lg leading-tight">Udyam Guru</h3>
              <p className="text-[#0f9b58] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0f9b58] animate-pulse"></span> Online
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#1a1a2e]/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 shadow-md ${
                msg.role === 'user' 
                  ? 'bg-[#FF6B35] text-white rounded-tr-none' 
                  : 'bg-[#202f36] text-white/90 border border-white/10 rounded-tl-none'
              }`}>
                 <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                   {msg.content}
                 </ReactMarkdown>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#202f36] border border-white/10 rounded-2xl rounded-tl-none p-4 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#1a1a2e] border-t-2 border-white/5">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 rounded-xl text-[#FF6B35] disabled:text-white/20 transition-colors"
            >
              {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
      
      {/* Overlay */}
      {isOpen && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
