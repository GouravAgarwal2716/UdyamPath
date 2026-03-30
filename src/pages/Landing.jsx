import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, Award, Target, BookOpen, TrendingUp, Download } from 'lucide-react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 1,
            speedY: (Math.random() - 0.5) * 1,
            color: Math.random() > 0.5 ? 'rgba(255, 107, 53, 0.4)' : 'rgba(255, 255, 255, 0.2)',
        });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
          p.x += p.speedX;
          p.y += p.speedY;

          if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
          if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
      });
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40 z-0" />;
};

const AnimatedCounter = ({ end, duration, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const ratio = Math.min(progress / duration, 1);
      
      // Ease out quad
      const easeOut = ratio * (2 - ratio);
      setCount(Math.floor(easeOut * end));
      
      if (ratio < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    requestAnimationFrame(animateCount);
  }, [end, duration]);

  // Indian number format (1,00,000)
  const formattedCount = count.toLocaleString('en-IN');
  return <span className="font-bold text-saffron">{prefix}{formattedCount}{suffix}</span>;
};

export default function Landing() {
  const navigate = useNavigate();

  const problemCards = [
    { stat: "90%", desc: "of social initiatives fail due to execution gaps", icon: Target },
    { stat: "85%", desc: "of affected youth receive no mentorship", icon: BookOpen },
    { stat: "₹25L", desc: "IIM costs ₹25 lakhs. UdyamPath costs ₹0.", icon: Award }
  ];

  const steps = [
    { title: "Validate Idea", desc: "Get an AI feasibility score map" },
    { title: "Case Study Room", desc: "Enter realistic startup scenarios" },
    { title: "Learn & Improve", desc: "Build strategic thinking skills" },
    { title: "Track Growth", desc: "Download action-oriented reports" }
  ];

  return (
    <div className="relative min-h-screen bg-navy overflow-hidden">
      <ParticleBackground />
      
      {/* HERO SECTION */}
      <section className="relative z-10 pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-surface/50 border border-saffron/20 rounded-full px-6 py-2 mb-8 backdrop-blur-md"
        >
          <p className="text-muted text-sm md:text-base font-inter">
            <AnimatedCounter end={40000000} duration={2500} /> students. Less than 1% get real guidance.
          </p>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-poppins font-extrabold text-white leading-tight mb-6 max-w-5xl tracking-tight"
        >
          The <span className="text-saffron">IIM Case Study Room</span>.<br />For Every Indian Entrepreneur.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted font-inter max-w-3xl mb-12"
        >
          Real-world challenges. Personalized guidance. Your language. Free.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
        >
          <button onClick={() => navigate('/onboarding')} className="btn-primary text-lg flex items-center justify-center gap-2 group">
            Start My Journey
            <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="btn-ghost flex items-center justify-center gap-2 group text-lg bg-surface/30 backdrop-blur-md">
            <PlayCircle className="w-5 h-5" />
            Watch Demo
          </button>
        </motion.div>
      </section>

      {/* PROBLEM CARDS */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problemCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="glass-card p-8 hover-glow group"
              >
                <div className="w-14 h-14 rounded-full bg-saffron/10 flex items-center justify-center mb-6 group-hover:bg-saffron/20 transition-colors">
                  <Icon className="w-7 h-7 text-saffron" />
                </div>
                <h3 className="text-4xl font-poppins font-bold text-white mb-2">{card.stat}</h3>
                <p className="text-muted font-inter leading-relaxed">{card.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-white mb-4">How UdyamPath Works</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">A completely personalized journey mimicking the intensity of real-world incubators.</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-white/10 z-0">
             <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: '100%' }}
               viewport={{ once: true }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
               className="h-full bg-saffron origin-left"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-surface border-2 border-saffron flex items-center justify-center text-saffron font-bold text-xl mb-6 shadow-saffron-glow">
                  {idx + 1}
                </div>
                <h4 className="text-xl font-poppins font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-muted">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 mt-12 py-8 text-center text-muted font-inter text-sm bg-surface/50">
        <p>Built for Bharat. Built with ❤️ at GDG on Campus CVR</p>
      </footer>
    </div>
  );
}
