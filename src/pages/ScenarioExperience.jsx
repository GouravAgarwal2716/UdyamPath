import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { fetchNews } from '../services/newsService';
import { generateScenario } from '../services/aiService';
import { generateSpeech } from '../services/sarvamService';
import { IndianRupee, Users, Target, X, Loader2, Volume2, AlertTriangle, CheckCircle, RefreshCcw } from 'lucide-react';

export default function ScenarioExperience() {
  const navigate = useNavigate();
  const { state, updateState, updateUser } = useAppContext();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [scenarioData, setScenarioData] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  
  const [budget, setBudget] = useState(state.user?.budget || 100000);
  const [trust, setTrust] = useState(50);
  const [impact, setImpact] = useState(50);

  const [attempts, setAttempts] = useState([]); // tracks { optionId, optionText, consequence }
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!state.currentModule || !state.idea) {
      navigate('/modules');
      return;
    }
    initScenario();
  }, []);

  const initScenario = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch News Context
      const newsArticles = await fetchNews(`${state.idea} ${state.currentModule.name} India startup`);
      const newsContext = newsArticles && newsArticles.length > 0 
        ? `${newsArticles[0].title}. ${newsArticles[0].description}`
        : 'The Indian startup market is becoming highly competitive with tightening budgets.';

      // 2. Generate Scenario
      const data = await generateScenario({
        startup: { idea: state.idea, city: state.user?.city },
        module: state.currentModule,
        language: state.language,
        newsContext
      });
      setScenarioData(data);

      // 3. Generate Audio asynchronously (don't block render)
      generateSpeech(data.scenario.context + " " + data.scenario.question, state.language)
        .then(base64Audio => {
          if (base64Audio) {
            setAudioUrl(`data:audio/wav;base64,${base64Audio}`);
          }
        })
        .catch(console.error);

    } catch (err) {
      console.error(err);
      setError('Failed to load scenario. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  const handleOptionClick = (opt) => {
    if (isSuccess) return; // Prevent clicks after success
    
    // Check if already attempted
    if (attempts.find(a => a.optionId === opt.id)) return;

    const consequence = scenarioData.consequences[opt.id];
    
    // Append attempt
    const newAttempts = [...attempts, { optionId: opt.id, optionText: opt.text, consequence }];
    setAttempts(newAttempts);

    // Apply consequences purely to local state
    setBudget(prev => prev + (consequence.budget || 0));
    setTrust(prev => prev + (consequence.trust || 0));
    setImpact(prev => prev + (consequence.impact || 0)); // prompt might omit this, but it's safe

    // If it's the optimal answer, sequence is complete
    if (consequence.isOptimal) {
      setIsSuccess(true);
      
      // Save to AppContext
      const score = Math.max(0, 100 - (newAttempts.length - 1) * 25); // subtract 25 for every mistake
      
      const historyUpdate = { ...state.moduleHistory };
      const modId = state.currentModule.id;
      historyUpdate[modId] = {
        attempts: (historyUpdate[modId]?.attempts || 0) + 1,
        lastScore: score,
        lastDifficulty: state.currentModule.difficulty
      };

      updateState({
        moduleHistory: historyUpdate,
        currentAnswers: [
           ...state.currentAnswers,
           {
             moduleContent: state.currentModule,
             scenario: scenarioData.scenario,
             attempts: newAttempts,
             finalScore: score
           }
        ]
      });
      
      // Persist the budget change to the user
      updateUser({ budget: budget + (consequence.budget || 0) });
    }
  };

  if (loading) {
     return (
        <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-4">
           <Loader2 className="w-16 h-16 text-[#FF6B35] animate-spin mb-6" />
           <p className="text-white/80 animate-pulse font-poppins font-bold text-xl text-center">
             Generating interactive sandbox...<br/>
             <span className="text-sm text-white/50 font-inter">Fetching live news & preparing voice acting</span>
           </p>
        </div>
     );
  }

  if (error) {
     return (
        <div className="min-h-screen bg-[#1a1a2e] flex flex-col items-center justify-center p-4">
           <AlertTriangle className="w-16 h-16 text-[#e94560] mb-6" />
           <p className="text-white mb-6 text-xl">{error}</p>
           <button onClick={initScenario} className="btn-primary flex items-center gap-2">
              <RefreshCcw className="w-5 h-5"/> Try Again
           </button>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-[#111b21] flex flex-col font-inter">
      {/* Top Navbar */}
      <div className="bg-[#202f36] border-b-2 border-[#111b21] p-4 flex justify-between items-center sticky top-0 z-50">
         <button onClick={() => navigate('/modules')} className="text-white/50 hover:text-white flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition-colors">
            <X className="w-5 h-5" /> Exit Challenge
         </button>
         
         <div className="flex gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border transition-all ${budget < 10000 ? 'text-[#e94560] border-[#e94560]/50' : 'text-white border-white/10'}`}>
               <IndianRupee className="w-4 h-4"/>
               <span className="font-bold font-poppins">{(budget).toLocaleString('en-IN')}</span>
            </div>
            <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border transition-all ${trust < 30 ? 'text-[#e94560] border-[#e94560]/50' : 'text-blue-400 border-[#blue-400]/20'}`}>
               <Users className="w-4 h-4"/>
               <span className="font-bold font-poppins">{trust} Trust</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#0f9b58]">
               <Target className="w-4 h-4"/>
               <span className="font-bold font-poppins">{impact} Impact</span>
            </div>
         </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
         
         {/* Left Side: Empty block where Lottie Avatar *would* go (Mocked with CSS for now as we don't have the distinct json) */}
         <div className="w-full md:w-1/3 bg-[#111b21] border-r-2 border-[#202f36] flex flex-col items-center justify-center p-8 relative">
            
            {/* Pseudo Avatar Box */}
            <div className="w-48 h-48 rounded-3xl bg-[#202f36] shadow-xl border-4 border-[#2b3e47] relative mb-8 flex items-center justify-center overflow-hidden">
               {isSuccess ? (
                  <div className="text-8xl animate-bounce">🥳</div>
               ) : attempts.length > 0 ? (
                  <div className="text-8xl animate-pulse">🤔</div>
               ) : (
                  <div className="text-8xl">😐</div>
               )}
            </div>
            <h3 className="font-poppins font-black text-white/50 text-xl tracking-widest uppercase">CEO View</h3>
         </div>

         {/* Right Side: Scenario & Options */}
         <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-2xl mx-auto">
               
               <div className="mb-8 p-6 bg-[#202f36] border-2 border-[#2b3e47] rounded-3xl relative shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                  <span className="text-[#FF6B35] font-bold uppercase tracking-widest text-xs mb-2 block">{state.currentModule.category}</span>
                  <p className="text-white text-lg font-medium leading-relaxed mb-6">{scenarioData.scenario.context}</p>
                  <h2 className="text-2xl font-poppins font-black text-[#FFD700] mb-2">{scenarioData.scenario.question}</h2>

                  {audioUrl && (
                     <>
                        <audio src={audioUrl} ref={audioRef} />
                        <button 
                          onClick={playAudio} 
                          disabled={isPlaying}
                          className="absolute right-6 top-6 w-12 h-12 rounded-xl bg-[#FF6B35] flex items-center justify-center text-white shadow-[0_4px_0_#d15122] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
                        >
                           {isPlaying ? <div className="w-4 h-4 rounded-full border-2 border-white/50 border-t-white animate-spin"></div> : <Volume2 className="w-6 h-6"/>}
                        </button>
                     </>
                  )}
               </div>

               {/* Options Grid */}
               <div className="space-y-4 mb-24">
                  {scenarioData.options.map(opt => {
                     const isAttempted = attempts.find(a => a.optionId === opt.id);
                     const isWinningOpt = isAttempted && isAttempted.consequence.isOptimal;
                     const isLosingOpt = isAttempted && !isAttempted.consequence.isOptimal;

                     let btnStyle = "bg-[#202f36] border-[#111b21] hover:bg-[#2b3e47] text-white";
                     if (isWinningOpt) btnStyle = "bg-[#d7ffb8] border-[#58cc02] text-[#58cc02] scale-[1.02]";
                     else if (isLosingOpt) btnStyle = "bg-[#ffdfe0] border-[#ea2b2b] text-[#ea2b2b] opacity-70";

                     return (
                        <div key={opt.id} className="relative">
                           <button
                             onClick={() => handleOptionClick(opt)}
                             disabled={isAttempted || isSuccess}
                             className={`w-full p-5 rounded-3xl border-b-4 text-left transition-all ${btnStyle}`}
                           >
                              <span className="font-poppins font-bold text-lg">{opt.text}</span>
                           </button>

                           {/* Insight Reveal Dropdown */}
                           {isAttempted && (
                              <div className={`mt-2 p-5 rounded-2xl border ${isWinningOpt ? 'bg-[#f1ffde] border-[#58cc02]/30 text-[#4da803]' : 'bg-[#fff0f1] border-[#ea2b2b]/30 text-[#d32424]'}`}>
                                 <h4 className="font-black text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                                    {isWinningOpt ? <><CheckCircle className="w-4 h-4"/> Golden Strategy</> : <><AlertTriangle className="w-4 h-4"/> Critical Insight</>}
                                 </h4>
                                 <p className="font-medium text-sm leading-relaxed">{isAttempted.consequence.insight}</p>
                                 <div className="mt-3 flex flex-wrap gap-2">
                                    {isAttempted.consequence.budget !== 0 && (
                                       <span className="px-2 py-1 rounded-md bg-black/5 text-xs font-bold uppercase">
                                          Budget {isAttempted.consequence.budget > 0 ? '+' : ''}{isAttempted.consequence.budget}
                                       </span>
                                    )}
                                    {isAttempted.consequence.trust !== 0 && (
                                       <span className="px-2 py-1 rounded-md bg-black/5 text-xs font-bold uppercase">
                                          Trust {isAttempted.consequence.trust > 0 ? '+' : ''}{isAttempted.consequence.trust}
                                       </span>
                                    )}
                                 </div>
                              </div>
                           )}
                        </div>
                     );
                  })}
               </div>

            </div>
         </div>
      </div>

      {/* Footer Success Action */}
      {isSuccess && (
         <div className="fixed bottom-0 left-0 right-0 p-4 border-t-2 border-[#58cc02]/20 bg-[#f1ffde] z-50 animate-slide-up flex justify-center shadow-[0_-20px_50px_rgba(88,204,2,0.15)]">
            <div className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-4">
               <div>
                  <h3 className="font-poppins font-black text-2xl text-[#4da803]">Scenario Passed!</h3>
                  <p className="text-[#4da803]/80 font-bold">You've unlocked the real-world strategy.</p>
               </div>
               <button 
                 onClick={() => navigate('/report')}
                 className="btn-primary w-full md:w-auto px-12 py-4 rounded-2xl bg-[#58cc02] hover:bg-[#4ba802] shadow-[0_4px_0_#439103] active:translate-y-1 active:shadow-none border-none text-white text-xl uppercase tracking-widest"
               >
                  Generate Report
               </button>
            </div>
         </div>
      )}

    </div>
  );
}