import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, Loader2, MessageSquareText, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import useOpenAI from '../hooks/useOpenAI';
import useSarvam from '../hooks/useSarvam';

const LANGUAGES = [
  { code: 'en', label: 'EN', flag: '🇮🇳', sarvamCode: 'en-IN', name: 'English' },
  { code: 'hi', label: 'हि', flag: '🇮🇳', sarvamCode: 'hi-IN', name: 'Hindi' },
  { code: 'te', label: 'తె', flag: '🇮🇳', sarvamCode: 'te-IN', name: 'Telugu' },
  { code: 'ta', label: 'த', flag: '🇮🇳', sarvamCode: 'ta-IN', name: 'Tamil' },
];

export default function AICoach() {
  const { state, updateState } = useAppContext();
  const { streamText } = useOpenAI();
  const { generateSpeech } = useSarvam();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const currentLang = LANGUAGES.find(l => l.code === state.language) || LANGUAGES[0];

  // Global open listener
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-udyampath-coach', handleOpen);
    return () => window.removeEventListener('open-udyampath-coach', handleOpen);
  }, []);

  // Intro message (reset when language changes)
  useEffect(() => {
    if (isOpen && state.user) {
      const langName = currentLang.name;
      setMessages([{
        role: 'ai',
        content: `Namaste ${state.user.name.split(' ')[0]}! I'm Udyam Guru, your personal startup mentor. I know you're worried about ${state.user.fear?.toLowerCase()} — that's one of the most common challenges for first-time founders in India. I'll speak to you in ${langName}. What's on your mind today?`,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [isOpen, state.language]); // eslint-disable-line

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Speak AI message via Sarvam TTS
  const speakText = useCallback(async (text) => {
    if (!voiceEnabled || !text || isSpeaking) return;
    try {
      setIsSpeaking(true);
      const dataUri = await generateSpeech(text, currentLang.sarvamCode);
      if (dataUri) {
        // Sarvam returns a base64 data URI string directly
        if (audioRef.current) { audioRef.current.pause(); }
        const audio = new Audio(dataUri);
        audioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => {
          setIsSpeaking(false);
          // fallback to browser TTS if Sarvam audio fails
          const utt = new SpeechSynthesisUtterance(text);
          utt.lang = currentLang.sarvamCode;
          utt.rate = 0.9;
          utt.onend = () => setIsSpeaking(false);
          speechSynthesis.speak(utt);
        };
        await audio.play();
      } else {
        // Fallback: browser native TTS
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLang.sarvamCode;
        utterance.rate = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('TTS error:', err);
      setIsSpeaking(false);
    }
  }, [voiceEnabled, isSpeaking, currentLang, generateSpeech]);

  // Stop speaking
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Voice Input (Chrome Web Speech API)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is only supported in Google Chrome. Please type your message instead.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentLang.sarvamCode;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-send after voice input
      setTimeout(() => handleSend(transcript), 300);
    };

    recognition.onerror = (e) => {
      console.error('Speech recognition error', e);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const handleSend = async (forcedText = null) => {
    const textToSend = forcedText || input;
    if (!textToSend.trim() || isTyping) return;

    if (!forcedText) setInput('');
    stopSpeaking();

    const newMsg = { role: 'user', content: textToSend, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    const historyText = messages.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
    const lowerText = textToSend.toLowerCase();

    let triggerContext = '';
    if (lowerText.includes('quit') || lowerText.includes('give up') || lowerText.includes('chod')) {
      triggerContext = 'CRITICAL: Validate their feeling first. 90% of founders feel this. Give ONE extremely simple action for TODAY only.';
    } else if (lowerText.includes('scheme') || lowerText.includes('government') || lowerText.includes('funding')) {
      triggerContext = 'CRITICAL: Mention they can check the Founder Hub panel for personalized govt schemes. Give brief framing.';
    }

    const langMap = { te: 'Telugu', hi: 'Hindi', ta: 'Tamil', en: 'English' };
    const langName = langMap[state.language] || 'English';

    const prompt = `System: You are Udyam Guru, a warm experienced Indian startup mentor. Speak like a supportive elder brother. 
Founder: ${state.user?.name}. Their idea: "${state.idea}". Their biggest fear: "${state.user?.fear}".
Rules: 
- Use simple language, relatable Indian examples (chai, cricket, kirana stores, auto-rickshaw).  
- Keep responses under 120 words unless they ask for more.
- Never say "I am an AI". 
- Always give India-specific, actionable advice.
- ALWAYS end with one specific question or action step.
- Respond ENTIRELY in ${langName}. Do not mix languages unless user does so.

${triggerContext ? `Special context: ${triggerContext}` : ''}

Recent conversation:
${historyText}

user: ${textToSend}
ai:`;

    // Add empty AI bubble to stream into
    setMessages(prev => [...prev, { role: 'ai', content: '', timestamp: new Date().toISOString() }]);

    let finalResponse = '';
    try {
      finalResponse = await streamText(prompt, (chunkText) => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...updated[updated.length - 1], content: chunkText };
          return updated;
        });
      });
    } catch (err) {
      console.error(err);
      finalResponse = 'My network dropped for a moment. Please try again!';
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'ai', content: finalResponse, timestamp: new Date().toISOString() }
      ]);
    } finally {
      setIsTyping(false);
      // Auto-speak the AI response
      if (finalResponse && voiceEnabled) {
        setTimeout(() => speakText(finalResponse), 400);
      }
    }
  };

  const handleLanguageChange = (langCode) => {
    updateState({ language: langCode });
    // Clear messages to restart in new language
    setMessages([]);
  };

  const starterChips = [
    'How do I validate my idea?',
    'I feel like giving up',
    'What govt schemes apply to me?',
    'How do I find my first customer?',
    'What did I get wrong in my module?'
  ];

  if (!state.user) return null;

  return (
    <>
      {/* FAB trigger */}
      {!isOpen && state.idea && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-40 bg-navy border-2 border-saffron text-white p-4 rounded-full shadow-[0_0_20px_rgba(255,107,53,0.4)] hover:scale-110 transition-transform flex items-center gap-2 group"
        >
          <MessageSquareText className="w-6 h-6 text-saffron" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold text-saffron ml-1">
            Ask Udyam Guru
          </span>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setIsOpen(false); stopSpeaking(); }}
              className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 cursor-pointer"
            />

            <motion.div
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-4xl bg-navy border-l border-white/10 shadow-2xl z-50 flex"
            >
              {/* LEFT SIDEBAR */}
              <div className="w-[260px] bg-surface/50 border-r border-white/10 p-6 hidden md:flex flex-col">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-8 pt-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron to-accentRed flex items-center justify-center text-2xl font-bold mb-3 shadow-saffron-glow relative">
                    UG
                    <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-surface ${isSpeaking ? 'bg-saffron animate-pulse' : 'bg-successGreen'}`}></span>
                  </div>
                  <h2 className="text-lg font-poppins font-bold text-white mb-0.5">Udyam Guru</h2>
                  <p className="text-xs text-muted">{isSpeaking ? '🔊 Speaking...' : 'Your Startup Mentor'}</p>
                </div>

                {/* Quick Questions */}
                <div className="flex-1 overflow-y-auto">
                  <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Quick Questions</h3>
                  <div className="flex flex-col gap-2">
                    {starterChips.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(chip)}
                        disabled={isTyping}
                        className="text-left text-xs text-saffron bg-saffron/10 border border-saffron/20 hover:bg-saffron/20 hover:border-saffron/50 px-3 py-2.5 rounded-lg transition-colors leading-tight disabled:opacity-40"
                      >
                        "{chip}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Switcher */}
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="text-xs text-muted mb-3 text-center font-bold uppercase tracking-widest">Language</p>
                  <div className="grid grid-cols-4 gap-1">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                          state.language === lang.code
                            ? 'bg-saffron text-white shadow-saffron-glow'
                            : 'bg-surface text-muted hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted text-center mt-2">
                    Speaking in {currentLang.name}
                  </p>
                </div>

                {/* Voice Toggle */}
                <div className="mt-4">
                  <button
                    onClick={() => { voiceEnabled ? stopSpeaking() : null; setVoiceEnabled(v => !v); }}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      voiceEnabled ? 'bg-saffron/20 text-saffron border border-saffron/40' : 'bg-surface text-muted border border-white/10'
                    }`}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    Voice {voiceEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* MAIN CHAT */}
              <div className="flex-1 flex flex-col h-full bg-navy relative">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-surface/30">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-saffron/20 rounded-full flex items-center justify-center text-saffron font-bold text-sm">UG</div>
                    <div>
                      <span className="font-bold text-white text-sm block">Udyam Guru</span>
                      <span className="text-xs text-muted">{currentLang.name} • {isSpeaking ? '🔊 Speaking' : isTyping ? 'Thinking...' : 'Online'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSpeaking && (
                      <button onClick={stopSpeaking} className="text-saffron hover:text-white transition-colors bg-saffron/10 p-2 rounded-full">
                        <VolumeX className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => { setIsOpen(false); stopSpeaking(); }} className="text-muted hover:text-white transition-colors bg-surface/50 p-2 rounded-full">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-4 custom-scrollbar">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                        msg.role === 'ai' ? 'bg-saffron/20 text-saffron' : 'bg-white/10 text-white'
                      }`}>
                        {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : '👤'}
                      </div>
                      <div className={`max-w-[75%] p-4 rounded-2xl text-[14px] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-saffron text-white rounded-br-none'
                          : 'bg-surface/80 border border-white/10 text-white rounded-bl-none'
                      }`}>
                        {msg.content}
                        {msg.role === 'ai' && msg.content === '' && isTyping && (
                          <div className="flex items-center gap-1 h-4">
                            {[0, 150, 300].map(d => (
                              <div key={d} className="w-2 h-2 bg-saffron rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                            ))}
                          </div>
                        )}
                        {/* Speaker button on AI messages */}
                        {msg.role === 'ai' && msg.content && (
                          <button
                            onClick={() => speakText(msg.content)}
                            className="mt-2 flex items-center gap-1 text-[10px] text-muted hover:text-saffron transition-colors"
                          >
                            <Volume2 className="w-3 h-3" /> Play
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="p-4 bg-surface/30 border-t border-white/10">
                  {/* Mobile language switcher */}
                  <div className="flex gap-2 mb-3 md:hidden">
                    {LANGUAGES.map(lang => (
                      <button key={lang.code} onClick={() => handleLanguageChange(lang.code)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${state.language === lang.code ? 'bg-saffron text-white' : 'bg-surface text-muted'}`}>
                        {lang.label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-2">
                    {/* Mic button */}
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        isListening
                          ? 'bg-accentRed text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                          : 'bg-surface border border-white/20 text-muted hover:text-saffron hover:border-saffron'
                      }`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>

                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={isListening ? '🎤 Listening...' : 'Type or speak your challenge...'}
                      className="flex-1 bg-surface border border-white/20 rounded-xl pl-5 pr-5 py-3.5 text-white focus:border-saffron focus:ring-1 focus:ring-saffron outline-none font-inter text-sm"
                      disabled={isTyping || isListening}
                    />

                    <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="flex-shrink-0 w-12 h-12 bg-saffron hover:bg-saffron/80 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                    >
                      {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  </form>

                  <p className="text-[10px] text-muted text-center mt-2">
                    🎤 Click mic to speak • 🔊 AI responds in {currentLang.name}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
