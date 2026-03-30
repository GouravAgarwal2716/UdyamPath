import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchNews } from '../services/newsService';
import { getRecommendedVideos } from '../services/youtubeService';
import { BookOpen, X, Video, FileText, Landmark, ExternalLink, Loader2 } from 'lucide-react';

export default function ResourcesPanel() {
  const { state } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('videos'); // videos | news | govt
  const [loading, setLoading] = useState(false);

  const [videos, setVideos] = useState([]);
  const [news, setNews] = useState([]);
  const [govtSchemes, setGovtSchemes] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadResources();
    }
  }, [isOpen, activeTab, state.currentModule?.name]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const topic = state.currentModule?.name || state.idea || 'Startup Basics';
      const sector = state.user?.stage || 'social enterprise';

      if (activeTab === 'videos' && videos.length === 0) {
        const res = await getRecommendedVideos([topic, sector]);
        setVideos(res || []);
      } else if (activeTab === 'news' && news.length === 0) {
        const res = await fetchNews(`${topic} startup India`);
        setNews(res || []);
      } else if (activeTab === 'govt' && govtSchemes.length === 0) {
        // Hardcoded dummy schemes adapted to sector
        setGovtSchemes([
          { title: "Startup India Seed Fund Scheme (SISFS)", link: "https://seedfund.startupindia.gov.in/", desc: "Financial assistance to startups for proof of concept, prototype development, product trials, market entry." },
          { title: "Credit Guarantee Scheme (CGTMSE)", link: "https://www.cgtmse.in/", desc: "Collateral-free credit to micro and small enterprises." },
          { title: "Stand-Up India Scheme", link: "https://www.standupmitra.in/", desc: "Bank loans between 10 Lakh and 1 Crore for greenfield enterprises for specific demographics." }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!state.idea) return null;

  return (
    <>
      {/* Floating Action Badge on Left Side */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-1/2 left-0 z-40 bg-[#0f9b58] text-white py-4 pl-2 pr-4 rounded-r-2xl shadow-[5px_0_20px_rgba(15,155,88,0.4)] hover:pr-6 active:translate-x-1 transition-all -translate-y-1/2 flex items-center gap-2 font-bold ${isOpen ? '-translate-x-full' : 'translate-x-0'}`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="[writing-mode:vertical-lr] rotate-180 tracking-widest uppercase text-sm -ml-1">Resources</span>
      </button>

      {/* Slide-out Drawer (Left Side) */}
      <div className={`fixed inset-y-0 left-0 w-full sm:w-[400px] bg-[#1a1a2e] border-r-2 border-white/5 z-50 transform transition-transform duration-300 ease-out flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b-2 border-white/5 flex items-center justify-between pb-4">
          <div>
            <h2 className="text-2xl font-poppins font-black text-white">Knowledge Hub</h2>
            <p className="text-[#0f9b58] text-xs font-bold uppercase tracking-widest mt-1 truncate max-w-[200px]">
              {state.currentModule?.name || 'General Context'}
            </p>
          </div>
          <button onClick={() => setIsOpen(false)} className="bg-white/5 p-2 rounded-xl text-white/50 hover:text-white hover:bg-[#e94560]/20 transition-all border border-transparent hover:border-[#e94560]/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 bg-[#16213e]">
           <button onClick={() => setActiveTab('videos')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'videos' ? 'bg-[#FF6B35] text-white shadow-md' : 'text-white/40 hover:text-white'}`}>
             <Video className="w-4 h-4"/> Videos
           </button>
           <button onClick={() => setActiveTab('news')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'news' ? 'bg-[#0f9b58] text-white shadow-md' : 'text-white/40 hover:text-white'}`}>
             <FileText className="w-4 h-4"/> Live News
           </button>
           <button onClick={() => setActiveTab('govt')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'govt' ? 'bg-[#e94560] text-white shadow-md' : 'text-white/40 hover:text-white'}`}>
             <Landmark className="w-4 h-4"/> Govt
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {loading && (
             <div className="flex flex-col items-center justify-center p-8 text-center h-48">
                <Loader2 className="w-10 h-10 text-white/40 animate-spin mb-4" />
                <p className="font-bold text-white/50 text-sm tracking-widest uppercase">Fetching Live Data...</p>
             </div>
          )}

          {/* Video Tab */}
          {!loading && activeTab === 'videos' && videos.length > 0 && videos.map((v, i) => (
             <a key={i} href={`https://youtube.com/watch?v=${v.id?.videoId || v.id}`} target="_blank" rel="noreferrer" className="block bg-[#202f36] border border-white/10 rounded-2xl overflow-hidden hover:border-[#FF6B35] transition-all group">
                <div className="h-40 bg-zinc-800 relative overflow-hidden">
                   <img src={v.snippet.thumbnails.high.url} alt="thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                   <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded">Watch</div>
                </div>
                <div className="p-4">
                   <h4 className="font-bold text-sm text-white line-clamp-2 leading-snug mb-2 group-hover:text-[#FF6B35] transition-colors">{v.snippet.title}</h4>
                   <p className="text-xs text-white/50 font-medium">{v.snippet.channelTitle}</p>
                </div>
             </a>
          ))}

          {/* News Tab */}
          {!loading && activeTab === 'news' && news.length > 0 && news.map((n, i) => (
             <a key={i} href={n.url} target="_blank" rel="noreferrer" className="block bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] font-black text-[#0f9b58] uppercase tracking-widest">{n.source.name}</span>
                   <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-[#0f9b58] transition-colors" />
                </div>
                <h4 className="font-bold text-white text-sm mb-2 leading-snug">{n.title}</h4>
                <p className="text-xs text-white/50 line-clamp-3">{n.description}</p>
             </a>
          ))}

          {/* Govt Tab */}
          {!loading && activeTab === 'govt' && govtSchemes.map((gov, i) => (
             <a key={i} href={gov.link} target="_blank" rel="noreferrer" className="block bg-[#e94560]/10 border border-[#e94560]/30 rounded-2xl p-4 hover:bg-[#e94560]/20 transition-colors group">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center text-[#e94560]"><Landmark className="w-4 h-4"/></div>
                   <h4 className="font-bold text-[#FFD700] text-sm leading-tight flex-1">{gov.title}</h4>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{gov.desc}</p>
             </a>
          ))}

          {!loading && ((activeTab === 'videos' && videos.length === 0) || (activeTab === 'news' && news.length === 0)) && (
             <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-white/40 text-sm font-medium">No direct active content found for this module right now. Checking archives...</p>
             </div>
          )}
        </div>
      </div>
      
      {/* Overlay */}
      {isOpen && (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 sm:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}