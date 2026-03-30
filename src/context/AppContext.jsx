import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  language: 'en',
  idea: '',
  user: {
    name: '',
    age: '',
    college: '',
    city: '',
    stage: 'Idea',
    teamSize: 'Solo',
    fear: 'Failure'
  },
  validationReport: null,
  currentModule: null,
  moduleHistory: {},
  currentAnswers: [],
  report: null
};

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('udyampath_state');
      if (saved) return JSON.parse(saved);
      return initialState;
    } catch (e) {
      console.error("Failed to parse local storage", e);
      return initialState;
    }
  });

  // Sync to localStorage on every state change
  useEffect(() => {
    localStorage.setItem('udyampath_state', JSON.stringify(state));
  }, [state]);

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const updateUser = (updates) => {
    setState(prev => ({ ...prev, user: { ...prev.user, ...updates } }));
  };

  const clearSession = () => {
    setState(initialState);
    localStorage.removeItem('udyampath_state');
  };

  return (
    <AppContext.Provider value={{ state, updateState, updateUser, clearSession }}>
       {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
