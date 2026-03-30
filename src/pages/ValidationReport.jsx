import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { validateIdea } from '../services/aiService';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Target, Users, Globe, Settings, ArrowRight, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';

export default function ValidationReport() {
  const navigate = useNavigate();
  const { state, updateState } = useAppContext();
  const [report, setReport] = useState(state.validationReport);
  const [loading, setLoading] = useState(!state.validationReport);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!state.idea) {
      navigate('/onboarding');
      return;
    }

    if (!report) {
      generateReport();
    }
  }, []);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await validateIdea({
        idea: state.idea,
        language: state.language,
        location: state.user.city || 'India',
        budget: state.user.budget || 100000,
        sector: 'Social Enterprise',
        stage: state.user.stage
      });
      // the new prompt returns { problemValidity, targetAudience, marketSize, ...}
      // exactly as specified
      setReport(data);
      updateState({ validationReport: data });
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the idea. Please verify your Gemini API key in the .env file and your internet connection.');
    } finally {
       setLoading(false);
    }
  };

  const getBadgeColor = (score) => {
    if (score >= 80) return 'text-[#0f9b58] bg-[#0f9b58]/10 border-[#0f9b58]/30';
    if (score >= 50) return 'text-[#FFD700] bg-[#FFD700]/10 border-[#FFD700]/30';
    return 'text-[#e94560] bg-[#e94560]/10 border-[#e94560]/30';
  };

  const ScoreRing = ({ score, label, color }) => (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl glass border-white/10 hover:border-white/30 transition-all duration-300">
      <div className="w-32 h-32 relative mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={10} data={[{ name: 'L1', value: score, fill: color }]} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: 'rgba(255,255,255,0.05)' }} clockWise dataKey="value" cornerRadius={10} animationDuration={1000} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center font-poppins font-black text-3xl text-white drop-shadow-lg">
          {score}
        </div>
      </div>
      <span className="font-bold text-sm text-white/70 uppercase tracking-widest">{label}</span>
      <span className="text-[10px] text-white/40 mt-1 pb-1">out of 100</span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-12 h-12 text-[#FF6B35] animate-spin mb-4" />
        <h2 className="text-2xl font-poppins font-bold">Structuring the AI Report...</h2>
        <p className="text-white/50 mt-2">Checking feasibility and uniqueness across India.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center px-4">
         <AlertTriangle className="w-16 h-16 text-[#e94560] mb-4" />
         <p className="text-xl mb-6 text-center max-w-md">{error}</p>
         <button onClick={generateReport} className="btn-primary flex items-center gap-2">
           <RefreshCw className="w-5 h-5"/> Retry Connection
         </button>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-[100vh] bg-[#1a1a2e] pt-24 pb-24 px-4 font-inter text-white overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* Emotional Impact Hero */}
        <div className="gradient-primary p-6 md:p-8 rounded-3xl shadow-[0_10px_40px_rgba(255,107,53,0.2)] mb-8 relative overflow-hidden animate-slide-up" style={{animationDelay: '100ms'}}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <h1 className="text-3xl md:text-5xl font-poppins font-black mb-4 tracking-tight drop-shadow-md relative z-10 leading-tight">
            {report.emotionalImpact?.message || "Your idea can change lives."}
          </h1>
          <p className="text-white/90 text-sm md:text-lg font-medium max-w-2xl relative z-10 uppercase tracking-widest bg-black/20 inline-block px-4 py-1.5 rounded-full">
            Potential Audience: {report.emotionalImpact?.comparison || report.targetAudience?.size}
          </p>
        </div>

        {/* The 6 Information Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* Card 1: Problem Validation */}
          <div className="glass p-6 rounded-2xl border-white/10 animate-slide-up flex flex-col" style={{animationDelay: '150ms'}}>
             <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/5 rounded-xl"><Target className="w-6 h-6 text-[#1cb0f6]"/></div>
                <h3 className="font-poppins font-bold text-xl">Problem Validity</h3>
             </div>
             <p className="text-white/80 flex-1 leading-relaxed mb-4">{report.problemValidity?.description}</p>
             <div className={`mt-auto w-fit px-4 py-1.5 rounded-lg border font-bold text-sm ${getBadgeColor(report.problemValidity?.score || 0)}`}>
               Score: {report.problemValidity?.score}/100
             </div>
          </div>

          {/* Card 2: Target Audience */}
          <div className="glass p-6 rounded-2xl border-white/10 animate-slide-up flex flex-col" style={{animationDelay: '200ms'}}>
             <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/5 rounded-xl"><Users className="w-6 h-6 text-[#FFD700]"/></div>
                <h3 className="font-poppins font-bold text-xl">Target Audience</h3>
             </div>
             <div className="space-y-4">
               <div>
                 <span className="text-[#FFD700] text-xs font-bold uppercase tracking-widest block mb-1">Primary</span>
                 <p className="text-white/90 text-sm">{report.targetAudience?.primary}</p>
               </div>
               <div>
                 <span className="text-white/40 text-xs font-bold uppercase tracking-widest block mb-1">Secondary</span>
                 <p className="text-white/70 text-sm">{report.targetAudience?.secondary}</p>
               </div>
             </div>
          </div>

          {/* Card 3: Market Size */}
          <div className="glass p-6 rounded-2xl border-white/10 animate-slide-up flex flex-col" style={{animationDelay: '250ms'}}>
             <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/5 rounded-xl"><Globe className="w-6 h-6 text-[#0f9b58]"/></div>
                <h3 className="font-poppins font-bold text-xl">Market Size</h3>
             </div>
             <div className="grid grid-cols-2 gap-4 mb-4">
                 <div className="bg-white/5 p-3 rounded-lg border border-white/5"><span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">TAM</span><br/><span className="font-bold text-lg">{report.marketSize?.tam}</span></div>
                 <div className="bg-white/5 p-3 rounded-lg border border-white/5"><span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">SAM</span><br/><span className="font-bold text-lg">{report.marketSize?.sam}</span></div>
             </div>
             <p className="text-white/60 text-xs leading-relaxed">{report.marketSize?.description}</p>
          </div>

          {/* Card 4: Existing Solutions */}
          <div className="glass p-6 rounded-2xl border-white/10 animate-slide-up flex flex-col" style={{animationDelay: '300ms'}}>
             <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/5 rounded-xl"><Settings className="w-6 h-6 text-[#e94560]"/></div>
                <h3 className="font-poppins font-bold text-xl">Existing Landscape</h3>
             </div>
             <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {report.existingSolutions?.map((sol, i) => (
                  <div key={i} className="pb-3 border-b border-white/5 last:border-0 last:pb-0">
                     <span className="font-bold text-[#e94560] block mb-1 text-sm">{sol.name}</span>
                     <p className="text-white/70 text-xs leading-relaxed">Gap: {sol.gap}</p>
                  </div>
                ))}
                {(!report.existingSolutions || report.existingSolutions.length === 0) && <p className="text-white/50 text-sm">No direct dominant alternatives identified.</p>}
             </div>
          </div>

        </div>

        {/* Card 5 & 6: Score Rings */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-12 animate-slide-up" style={{animationDelay: '350ms'}}>
           <ScoreRing score={report.uniquenessScore} label="Uniqueness" color="#FF6B35" />
           <ScoreRing score={report.overallScore || 80} label="Feasibility" color="#0f9b58" />
        </div>

        {/* CTA */}
        <div className="flex justify-center animate-slide-up" style={{animationDelay: '400ms'}}>
          <button 
            onClick={() => navigate('/modules')}
            className="btn-primary flex items-center gap-3 text-xl px-12 py-5 rounded-2xl shadow-[0_0_30px_rgba(255,107,53,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            Start Your Simulation <ArrowRight className="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  );
}
