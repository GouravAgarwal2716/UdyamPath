import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { state, updateState } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'HI' },
    { code: 'te', label: 'TE' },
    { code: 'ta', label: 'TA' }
  ];

  const handleLanguageChange = (e) => {
    updateState({ language: e.target.value });
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-card py-3 border-b-0' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between pointer-events-auto">
        
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <Flame className="w-8 h-8 text-saffron group-hover:animate-pulse-slow" />
          <span className="text-2xl font-poppins font-bold text-saffron tracking-tight">UdyamPath</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <select 
            value={state.language}
            onChange={handleLanguageChange}
            className="bg-surface border border-saffron/30 text-white text-sm rounded-lg focus:ring-saffron focus:border-saffron p-2 cursor-pointer outline-none"
          >
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
          
          {state.user ? (
            <button onClick={() => navigate('/dashboard')} className="btn-ghost text-sm py-2 px-4 shadow-saffron-glow">
              Dashboard
            </button>
          ) : (
            <button onClick={() => navigate('/onboarding')} className="btn-primary text-sm py-2 px-4 animate-pulse-slow shadow-saffron-glow">
              Start Journey
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}
