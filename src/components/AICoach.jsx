import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { chatWithCoach } from '../services/aiService';
import { MessageSquare, X, Send, Bot, Loader2, ImagePlus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const PRE_PROMPTS = [
  "How can I better understand my local competition in India?",
  "What are some low-cost marketing strategies for rural areas?",
  "Help me calculate my unit economics.",
  "Show me some government schemes for MSMEs."
];

export default function AICoach() {
  const { state } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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
  }, [isOpen, messages.length, state.idea, state.user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result.split(',')[1];
      setSelectedImage({
        data: base64Data,
        mimeType: file.type,
        previewUrl: e.target.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (e, textOverride = null) => {
    e?.preventDefault();
    const textToSend = textOverride || input;
    
    if ((!textToSend.trim() && !selectedImage) || isTyping) return;

    setInput('');
    const imageToSend = selectedImage;
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const newMessages = [...messages, { role: 'user', content: textToSend, image: imageToSend }];
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
                 {msg.image?.previewUrl && (
                   <img src={msg.image.previewUrl} alt="uploaded" className="max-w-full rounded-lg mb-3 shadow-sm border border-black/10" />
                 )}
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

        {/* Pre-prompts & Image Preview Area */}
        <div className="bg-[#1a1a2e] px-4 pt-3 border-t-2 border-white/5">
          {/* Pre-prompts - show mainly when less messages */}
          {messages.length <= 3 && !selectedImage && (
            <div className="flex flex-wrap gap-2 mb-3">
              {PRE_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(null, prompt)}
                  disabled={isTyping}
                  className="text-[11px] bg-white/5 border border-white/10 text-white/70 px-3 py-1.5 rounded-full hover:bg-[#FF6B35]/20 hover:text-[#FF6B35] transition-colors text-left disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Image Preview */}
          {selectedImage && (
            <div className="relative inline-block mb-3">
              <img src={selectedImage.previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded-xl border-2 border-white/20 shadow-lg" />
              <button 
                onClick={() => { setSelectedImage(null); if(fileInputRef.current) fileInputRef.current.value='' }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 pt-0 bg-[#1a1a2e] pb-6">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageSelect} 
              className="hidden" 
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isTyping}
              className="absolute left-2 p-2 rounded-xl text-white/50 hover:text-[#FF6B35] transition-colors z-10 disabled:opacity-50 hover:bg-white/5"
            >
              <ImagePlus className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-12 text-white placeholder-white/40 focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all text-sm"
            />
            <button
              type="submit"
              disabled={(!input.trim() && !selectedImage) || isTyping}
              className="absolute right-2 p-2 rounded-xl text-[#FF6B35] disabled:text-white/20 transition-colors"
            >
              {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
      
      {/* Overlay */}
      {isOpen && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
