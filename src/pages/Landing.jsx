import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { strings } from '../utils/langStrings';
import { Play, TrendingUp, Globe, HeartPulse, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const t = strings[state.language] || strings['en'];

  // Particles animation
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = 40;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * -1 - 0.5;
        this.color = Math.random() > 0.5 ? 'rgba(255, 107, 53, 0.4)' : 'rgba(255, 255, 255, 0.2)';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Counter animation
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    const duration = 2000;
    const finalValue = 40000000;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * finalValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a2e] relative overflow-hidden flex flex-col pt-16 text-white font-inter">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-80" />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="mb-6 inline-block glass-strong px-6 py-2 rounded-full border border-white/10 glow-saffron-text">
            <span className="text-saffron-500 font-bold text-lg">
              {count.toLocaleString('en-IN')} students.
            </span>
            <span className="text-white/60 ml-2">Less than 1% get real guidance.</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-poppins font-black mb-6 leading-tight max-w-4xl mx-auto tracking-tight drop-shadow-lg">
            Your Startup Journey <span className="gradient-text glow-saffron-text">Starts Here</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto font-medium">
            UdyamPath acts as your AI co-founder, combining the experiential learning of Monopoly with personalized mentorship in 4 Indian languages.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/onboarding')}
              className="btn-primary flex items-center gap-2 text-lg hover:scale-105 active:scale-95 group relative shadow-[0_0_20px_rgba(255,107,53,0.4)]"
            >
              <span className="absolute inset-0 w-full h-full rounded-xl bg-white/20 animate-ping opacity-20"></span>
              {t.startButton}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-secondary flex items-center gap-2 text-lg border-[#FF6B35]/50 text-[#FF6B35] hover:bg-[#FF6B35]/10">
              <Play className="w-5 h-5 fill-current" />
              {t.watchDemo}
            </button>
          </div>
        </div>

        {/* Problem Cards */}
        <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card glass-strong hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#e94560]/20 flex items-center justify-center mb-4 text-[#e94560]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-poppins font-bold text-2xl mb-2">78%</h3>
            <p className="text-white/70 text-sm">Of founders launch without proper validation guidance.</p>
          </div>
          
          <div className="card glass-strong hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-poppins font-bold text-2xl mb-2">60%</h3>
            <p className="text-white/70 text-sm">Struggle with English-only resources and language barriers.</p>
          </div>
          
          <div className="card glass-strong hover:-translate-y-2 transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="font-poppins font-bold text-2xl mb-2">72%</h3>
            <p className="text-white/70 text-sm">Experience early burnout due to lack of emotional support.</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-poppins font-bold text-center mb-16">How It Works</h2>
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 hidden md:block rounded-full">
              <div className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FFD700] rounded-full w-3/4 animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { step: 1, title: 'Validate Option', desc: 'Describe your idea and get an AI validation report.' },
                { step: 2, title: 'Choose Module', desc: 'Target your weakest areas with tailored modules.' },
                { step: 3, title: 'Simulate Strategy', desc: 'Interact with dynamic, gamified real-world scenarios.' },
                { step: 4, title: 'Review Report', desc: 'Get deep insights and a personalized PDF report.' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center bg-[#1a1a2e] p-4 rounded-xl shadow-2xl border border-white/5">
                  <div className="w-14 h-14 rounded-full bg-[#16213e] flex items-center justify-center font-poppins font-bold text-xl mb-4 border-2 border-[#FF6B35] shadow-[0_0_15px_rgba(255,107,53,0.3)] text-[#FF6B35]">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-white/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-white/40 text-sm relative z-10">
        <p>Built for Bharat. Built with ❤️ at GDG Hackathon.</p>
      </footer>
    </div>
  );
}
