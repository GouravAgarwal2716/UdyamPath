import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { strings } from '../utils/langStrings';
import { ChevronRight, ChevronLeft, MapPin, Building2, Users, IndianRupee, Loader2 } from 'lucide-react';

const FEAR_OPTIONS = [
  'Failure',
  'Running out of money',
  'Family pressure',
  'Not knowing enough',
  'Competition'
];

const STAGES = ['Idea', 'Validation', 'MVP', 'Growth'];
const TEAM_SIZES = ['Solo', '2-3', '4-5', '6+'];

const LANGUAGES = [
  { code: 'en', native: 'English', desc: 'Proceed in English', flag: '🇬🇧' },
  { code: 'hi', native: 'हिंदी', desc: 'हिंदी में आगे बढ़ें', flag: '🇮🇳' },
  { code: 'te', native: 'తెలుగు', desc: 'తెలుగులో కొనసాగండి', flag: '🇮🇳' },
  { code: 'ta', native: 'தமிழ்', desc: 'தமிழில் தொடரவும்', flag: '🇮🇳' }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { state, updateState, updateUser } = useAppContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  const t = strings[state.language] || strings['en'];
  const loadingMessages = [t.analyzing, t.checking, t.preparing];

  // Local drafted state before saving to global (or save to global continuously)
  const [localIdea, setIdea] = useState(state.idea || '');
  const [localUser, setLocalUser] = useState(state.user || {});
  const [budget, setBudget] = useState(100000);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    updateState({ idea: localIdea });
    updateUser({ ...localUser, budget });
    
    setLoading(true);
    let msgInterval = setInterval(() => {
      setLoadingMsgIdx(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    setTimeout(() => {
      clearInterval(msgInterval);
      navigate('/validate');
    }, 6000);
  };

  const renderLoading = () => (
    <div className="absolute inset-0 bg-[#1a1a2e] z-50 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-white/5 mx-auto"></div>
        <div className="absolute inset-0 rounded-full border-4 border-[#FF6B35] border-t-transparent animate-spin glow-saffron"></div>
        <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#FF6B35]" />
      </div>
      <h2 className="text-2xl font-poppins font-bold text-white mb-2 tracking-wide transition-opacity duration-500">
        {loadingMessages[loadingMsgIdx]}
      </h2>
      <div className="flex gap-2 mt-4 justify-center">
        {loadingMessages.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === loadingMsgIdx ? 'w-8 bg-[#FF6B35]' : 'w-4 bg-white/20'}`} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a2e] pt-24 pb-12 px-4 relative overflow-hidden font-inter flex flex-col items-center">
      {loading && renderLoading()}

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto mb-12">
        <div className="flex justify-between mb-2">
          {[1,2,3,4].map(s => (
            <div key={s} className="flex-1 flex flex-col items-center relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 font-bold transition-all duration-500 ${
                step >= s ? 'bg-[#FF6B35] text-white shadow-[0_0_15px_rgba(255,107,53,0.4)]' : 'bg-[#16213e] text-white/40 border-2 border-white/10'
              }`}>
                {s}
              </div>
              {s !== 4 && <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-0 transition-all duration-500 ${step > s ? 'bg-[#FF6B35]' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto">
        {/* Step 1: Language */}
        {step === 1 && (
          <div className="animate-slide-up">
            <h2 className="text-3xl font-poppins font-bold text-white mb-2 text-center textShadow">Choose Your Language</h2>
            <p className="text-white/60 text-center mb-8">UdyamPath adapts completely to how you speak.</p>
            <div className="grid grid-cols-2 gap-4">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { updateState({ language: lang.code }); handleNext(); }}
                  className={`p-6 rounded-2xl glass transition-all border-2 text-left group ${state.language === lang.code ? 'border-[#FF6B35] bg-[#FF6B35]/10 shadow-[0_0_20px_rgba(255,107,53,0.3)]' : 'border-white/10 hover:border-white/30'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold font-poppins text-white">{lang.native}</h3>
                      <p className="text-sm text-white/50">{lang.desc}</p>
                    </div>
                    <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{lang.flag}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Idea */}
        {step === 2 && (
          <div className="animate-slide-up">
            <h2 className="text-3xl font-poppins font-bold text-white mb-6 text-center">{t.idea} Phase</h2>
            <textarea
              value={localIdea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your social startup idea... Why does India need this? (e.g., A Whatsapp bot helping farmers get organic soil deals)"
              className="w-full h-48 bg-[#16213e] border border-white/10 rounded-xl p-6 text-lg text-white placeholder-white/30 focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] resize-none shadow-inner transition-all"
            />
            <div className={`mt-3 text-right text-sm ${localIdea.length < 50 ? 'text-[#e94560]' : 'text-[#0f9b58]'}`}>
              {localIdea.length} / 50 min chars
            </div>
            
            <div className="flex justify-between mt-8">
              <button onClick={handleBack} className="btn-secondary flex items-center gap-2"><ChevronLeft className="w-5 h-5"/> Back</button>
              <button 
                onClick={handleNext} 
                disabled={localIdea.length < 50}
                className="btn-primary flex items-center gap-2 disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(255,107,53,0.3)]"
              >
                Next <ChevronRight className="w-5 h-5"/>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Context */}
        {step === 3 && (
          <div className="animate-slide-up space-y-8">
            <h2 className="text-3xl font-poppins font-bold text-white mb-6 text-center">{t.context}</h2>
            
            <div>
              <label className="flex items-center gap-2 text-white/80 font-bold mb-3"><MapPin className="w-4 h-4"/> Target City / Town</label>
              <input type="text" value={localUser.city || ''} onChange={e => setLocalUser({...localUser, city: e.target.value})} placeholder="e.g., Warangal, Tier-2" className="input-primary" />
            </div>

            <div className="glass-strong p-6 rounded-2xl border-white/10">
              <label className="flex justify-between text-white/80 font-bold mb-4">
                <span className="flex items-center gap-2"><IndianRupee className="w-4 h-4"/> Starting Budget</span>
                <span className="text-[#FF6B35] text-xl font-poppins">₹{(budget).toLocaleString('en-IN')}</span>
              </label>
              <input 
                type="range" min="0" max="500000" step="5000" 
                value={budget} onChange={e => setBudget(Number(e.target.value))} 
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-white/80 font-bold mb-3"><Building2 className="w-4 h-4"/> Current Stage</label>
                <select value={localUser.stage || 'Idea'} onChange={e => setLocalUser({...localUser, stage: e.target.value})} className="input-primary appearance-none">
                  {STAGES.map(s => <option key={s} value={s} className="bg-[#1a1a2e]">{s}</option>)}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-white/80 font-bold mb-3"><Users className="w-4 h-4"/> Team Size</label>
                <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden p-1">
                   {TEAM_SIZES.map(s => (
                     <button key={s} onClick={() => setLocalUser({...localUser, teamSize: s})} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${localUser.teamSize === s ? 'bg-[#FF6B35] text-white shadow-md' : 'text-white/50 hover:text-white'}`}>{s}</button>
                   ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={handleBack} className="btn-secondary flex items-center gap-2"><ChevronLeft className="w-5 h-5"/> Back</button>
              <button onClick={handleNext} className="btn-primary flex items-center gap-2">Next <ChevronRight className="w-5 h-5"/></button>
            </div>
          </div>
        )}

        {/* Step 4: Profile */}
        {step === 4 && (
          <div className="animate-slide-up space-y-6">
             <h2 className="text-3xl font-poppins font-bold text-white mb-6 text-center">{t.profile}</h2>
             
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-white/80 font-bold mb-2 text-sm">Your Name</label>
                  <input type="text" value={localUser.name || ''} onChange={e => setLocalUser({...localUser, name: e.target.value})} placeholder="e.g., Rahul" className="input-primary" />
               </div>
               <div>
                  <label className="block text-white/80 font-bold mb-2 text-sm">Age</label>
                  <input type="number" value={localUser.age || ''} onChange={e => setLocalUser({...localUser, age: e.target.value})} placeholder="21" className="input-primary" />
               </div>
             </div>

             <div>
                <label className="block text-white/80 font-bold mb-2 text-sm">College / Organization</label>
                <input type="text" value={localUser.college || ''} onChange={e => setLocalUser({...localUser, college: e.target.value})} placeholder="NIT Warangal" className="input-primary" />
             </div>

             <div className="pt-4">
                <label className="block text-white/80 font-bold mb-2 text-sm text-[#FF6B35]">Your Biggest Fear</label>
                <p className="text-white/40 text-xs mb-4">Udyam Guru will tailor mentorship to help you overcome this.</p>
                <select value={localUser.fear || 'Failure'} onChange={e => setLocalUser({...localUser, fear: e.target.value})} className="input-primary border-[#FF6B35]/30">
                  {FEAR_OPTIONS.map(f => <option key={f} value={f} className="bg-[#1a1a2e]">{f}</option>)}
                </select>
             </div>

             <div className="flex justify-between mt-12">
              <button onClick={handleBack} className="btn-secondary flex items-center gap-2"><ChevronLeft className="w-5 h-5"/> Back</button>
              <button onClick={handleNext} disabled={!localUser.name || !localUser.fear} className="btn-primary flex items-center gap-2 glow-saffron shadow-[0_8px_32px_rgba(255,107,53,0.4)] px-8">Complete Setup <ChevronRight className="w-5 h-5"/></button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
