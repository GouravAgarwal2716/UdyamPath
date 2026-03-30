import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialModuleProgressEntry = {
  attempts: 0,
  lastScore: 0,
  lastDifficulty: 'beginner',
  scenariosUsed: [],
  completedAt: [],
  answerHistory: [],
  masteryLevel: 0
};

const defaultInitialState = {
  user: null, // { name, age, college, city, stage, teamSize, fear }
  idea: '',
  language: 'en',
  validationReport: null,
  moduleProgress: {},
  currentModule: null,
  currentAnswers: [],
  report: null,
  learningPath: [],
  continuousInsights: [],
  streak: 0,
  lastActiveDate: null
};

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('udyampath_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Date diff for streak checking
        if (parsed.lastActiveDate) {
          const lastActive = new Date(parsed.lastActiveDate).setHours(0, 0, 0, 0);
          const today = new Date().setHours(0, 0, 0, 0);
          const diffDays = Math.round((today - lastActive) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
             // Kept streak
          } else if (diffDays > 1) {
             parsed.streak = 0; // Lost streak
          }
          parsed.lastActiveDate = new Date().toISOString();
        } else {
          parsed.lastActiveDate = new Date().toISOString();
          parsed.streak = 1;
        }
        return parsed;
      } catch (e) {
        console.error("Error parsing state", e);
      }
    }
    return {
      ...defaultInitialState,
      lastActiveDate: new Date().toISOString(),
      streak: 1
    };
  });

  useEffect(() => {
    localStorage.setItem('udyampath_state', JSON.stringify(state));
  }, [state]);

  const updateState = (updates) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const updateUser = (userData) => {
    updateState({ user: { ...state.user, ...userData } });
  };

  const updateModuleProgress = (moduleName, updates) => {
    setState((prev) => {
      const currentProgress = prev.moduleProgress[moduleName] || { ...initialModuleProgressEntry };
      return {
        ...prev,
        moduleProgress: {
          ...prev.moduleProgress,
          [moduleName]: { ...currentProgress, ...updates }
        }
      };
    });
  };

  const resetState = () => {
    setState({
      ...defaultInitialState,
      lastActiveDate: new Date().toISOString(),
      streak: 1
    });
    localStorage.removeItem('udyampath_state');
  };

  return (
    <AppContext.Provider value={{ state, updateState, updateUser, updateModuleProgress, resetState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
