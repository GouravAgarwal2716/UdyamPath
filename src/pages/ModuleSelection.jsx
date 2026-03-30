import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { X, ArrowRight, Play, ShieldAlert, Users, Landmark, Megaphone, Repeat, IndianRupee, Target } from 'lucide-react';

const MODULES = [
  { id: 'm1', icon: <Target className="w-8 h-8 text-[#0f9b58]"/>, category: 'Sales & Growth', title: 'Finding First Customers', desc: 'Customer discovery, early traction, and sales pipelines tailored for Tier-2.' },
  { id: 'm2', icon: <IndianRupee className="w-8 h-8 text-[#FFD700]"/>, category: 'Fundraising', title: 'Seed Investment', desc: 'How to approach impact investors, understand term sheets, and manage dilution.' },
  { id: 'm3', icon: <Landmark className="w-8 h-8 text-blue-400"/>, category: 'Legal & Regulatory', title: 'Govt & Compliance', desc: 'Licenses, schemes, GST registration, and avoiding red tape.' },
  { id: 'm4', icon: <ShieldAlert className="w-8 h-8 text-[#e94560]"/>, category: 'Crisis Management', title: 'Worst Case Scenarios', desc: 'Handling severe failure, aggressive pivots, and rural legal trouble.' },
  { id: 'm5', icon: <Users className="w-8 h-8 text-purple-400"/>, category: 'HR & Leadership', title: 'Building a Team', desc: 'Hiring with no money, community culture, and finding aligned co-founders.' },
  { id: 'm6', icon: <Megaphone className="w-8 h-8 text-[#FF6B35]"/>, category: 'Growth Hacking', title: 'Marketing on Zero Budget', desc: 'Guerrilla marketing, WhatsApp sequences, and local social media reach.' },
  { id: 'm7', icon: <Repeat className="w-8 h-8 text-indigo-400"/>, category: 'Strategy', title: 'Pivot Decisions', desc: 'When to change direction, navigating the sunk cost fallacy cleanly.' },
  { id: 'm8', icon: <span className="text-3xl">💰</span>, category: 'Business Model', title: 'Revenue & Pricing', desc: 'Pricing psychology in Bharat, revenue modeling, and sustainable margins.' }
];

export default function ModuleSelection() {
  const navigate = useNavigate();
  const { state, updateState } = useAppContext();
  const [selectedModule, setSelectedModule] = useState(null);
  
  const history = state.moduleHistory || {};

  const handleStart = (difficulty) => {
    updateState({
      currentModule: {
        id: selectedModule.id,
        name: selectedModule.title,
        category: selectedModule.category,
        difficulty
      }
    });
    navigate('/scenario');
  };

  const getScoreBadge = (modId) => {
    const data = history[modId];
    if (!data || !data.attempts) return null;
    const s = data.lastScore;
    let color = 'text-[#e94560] border-[#e94560]/30 bg-[#e94560]/10';
    if (s >= 70) color = 'text-[#0f9b58] border-[#0f9b58]/30 bg-[#0f9b58]/10';
    else if (s >= 40) color = 'text-[#FFD700] border-[#FFD700]/30 bg-[#FFD700]/10';

    return (
      <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest ${color}`}>
        Score: {s}/100
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] pt-24 pb-24 px-4 font-inter text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
           <h1 className="text-4xl md:text-5xl font-poppins font-black mb-4">Select Your Module</h1>
           <p className="text-white/60 text-lg max-w-2xl mx-auto">Target your weakest areas with scenario-based challenges tailored to your stage and budget.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MODULES.map((mod, i) => (
            <button
              key={mod.id}
              onClick={() => setSelectedModule(mod)}
              className="card glass flex flex-col items-start text-left relative overflow-hidden group hover:border-[#FF6B35]/50 hover:shadow-[0_0_20px_rgba(255,107,53,0.15)] animate-slide-up hover:-translate-y-2 transition-all duration-300 h-full"
              style={{ animationDelay: `${i * 50}ms` }}
            >
               {getScoreBadge(mod.id)}
               <div className="p-3 bg-white/5 rounded-xl mb-4 group-hover:scale-110 transition-transform">{mod.icon}</div>
               <span className="text-[#FF6B35] text-[10px] font-bold uppercase tracking-widest mb-2">{mod.category}</span>
               <h3 className="font-poppins font-bold text-xl mb-2">{mod.title}</h3>
               <p className="text-white/50 text-sm leading-relaxed flex-1">{mod.desc}</p>
            </button>
          ))}
        </div>

        {selectedModule && (
          <div className="fixed inset-0 bg-[#1a1a2e]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
             <div className="w-full max-w-xl glass-strong border border-white/20 p-8 rounded-3xl relative shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-slide-up" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setSelectedModule(null)} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors bg-white/5 p-2 rounded-full"><X className="w-5 h-5"/></button>
                
                <span className="text-[#FF6B35] font-bold text-xs uppercase tracking-widest block mb-2">{selectedModule.category}</span>
                <h2 className="text-3xl font-poppins font-black mb-6 pr-10">{selectedModule.title}</h2>
                <p className="text-white/70 mb-8 font-medium">Select your difficulty. Every attempt dynamically generates a fresh real-world scenario specifically for your startup.</p>

                <div className="space-y-4 mb-8">
                  <button onClick={() => handleStart('Beginner')} className="w-full p-6 glass rounded-2xl border-white/10 hover:border-[#0f9b58] hover:bg-[#0f9b58]/10 text-left transition-all group flex items-center justify-between">
                     <div>
                        <h4 className="font-poppins font-bold text-lg text-[#0f9b58] mb-1">Beginner</h4>
                        <p className="text-sm text-white/50">Foundational concepts, simpler scenarios with minor consequences.</p>
                     </div>
                     <Play className="w-6 h-6 text-[#0f9b58] opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0" />
                  </button>

                  <button onClick={() => handleStart('Intermediate')} className="w-full p-6 glass rounded-2xl border-white/10 hover:border-[#FFD700] hover:bg-[#FFD700]/10 text-left transition-all group flex items-center justify-between shadow-[0_0_20px_rgba(255,215,0,0.05)] border-l-4 border-l-[#FFD700]">
                     <div>
                        <h4 className="font-poppins font-bold text-lg text-[#FFD700] mb-1">Intermediate (Recommended)</h4>
                        <p className="text-sm text-white/50">Real-world complexity, multiple variables and stakeholder impact.</p>
                     </div>
                     <Play className="w-6 h-6 text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0" />
                  </button>

                  <button onClick={() => handleStart('Expert')} className="w-full p-6 glass rounded-2xl border-white/10 hover:border-[#e94560] hover:bg-[#e94560]/10 text-left transition-all group flex items-center justify-between">
                     <div>
                        <h4 className="font-poppins font-bold text-lg text-[#e94560] mb-1">Expert</h4>
                        <p className="text-sm text-white/50">High-stakes decisions, ambiguous situations where rules don't apply.</p>
                     </div>
                     <Play className="w-6 h-6 text-[#e94560] opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0" />
                  </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}