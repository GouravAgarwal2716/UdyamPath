import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { strings } from '../utils/langStrings';
import { Globe, Zap, Menu, X, ChevronDown } from 'lucide-react';

export const LANGUAGE_FLAGS = {
  en: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  hi: { name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  te: { name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  ta: { name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
};

export default function Navbar() {
  const { state, updateState } = useAppContext();
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const t = strings[state.language] || strings['en'];
  const currentLang = LANGUAGE_FLAGS[state.language];

  const setLanguage = (code) => {
    updateState({ language: code });
    setLangOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/modules', label: 'Modules' },
    { href: '/validate', label: 'Validation' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center glow-saffron">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-poppins font-bold text-white text-lg">
              Udyam<span className="gradient-text">Path</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.href
                    ? 'text-[#FF6B35] bg-[#FF6B35]/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLang?.nativeName}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-xl glass-strong border border-white/10 overflow-hidden shadow-2xl">
                  {Object.entries(LANGUAGE_FLAGS).map(([code, lang]) => (
                    <button
                      key={code}
                      onClick={() => setLanguage(code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-white/5 ${
                        state.language === code ? 'text-[#FF6B35] bg-[#FF6B35]/10' : 'text-white/80'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <div className="text-left">
                        <div className="font-medium">{lang.nativeName}</div>
                        <div className="text-xs text-white/40">{lang.name}</div>
                      </div>
                      {state.language === code && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/onboarding')}
              className="hidden sm:flex btn-primary text-white text-sm items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {t.startButton}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg glass text-white/80"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass-strong border-t border-white/5 px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { navigate('/onboarding'); setMenuOpen(false); }}
            className="w-full mt-2 btn-primary text-white text-sm"
          >
            {t.startButton}
          </button>
        </div>
      )}

      {/* Backdrop for lang dropdown */}
      {langOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setLangOpen(false)} />}
    </nav>
  );
}
