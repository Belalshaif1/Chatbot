import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Bot } from '../types/bot';

interface BotContextType {
  bots: Bot[];
  addBot: (bot: Omit<Bot, 'id' | 'createdAt' | 'conversations'>) => void;
  updateBot: (id: string, bot: Partial<Bot>) => void;
  deleteBot: (id: string) => void;
  getBot: (id: string) => Bot | undefined;
}

const BotContext = createContext<BotContextType | undefined>(undefined);

const initialBots: Bot[] = [
  {
    id: '1',
    name: 'Sales Assistant',
    description: 'Help customers with sales queries',
    welcomeMessage: 'Hello! How can I help you today?',
    model: 'GPT-4 Turbo',
    status: 'live',
    conversations: 847,
    initial: 'SA',
    gradient: 'from-bc-accent to-purple-600',
    accentColor: '#2E5BFF',
    avatar: 0,
    darkTheme: true,
    widgetPosition: 'right',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Support Bot',
    description: 'Technical support assistant',
    welcomeMessage: 'Welcome to support! How can I assist you?',
    model: 'Claude 3 Sonnet',
    status: 'live',
    conversations: 532,
    initial: 'SB',
    gradient: 'from-emerald-500 to-teal-600',
    accentColor: '#10B981',
    avatar: 1,
    darkTheme: true,
    widgetPosition: 'right',
    createdAt: new Date().toISOString(),
  },
];

export const BotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bots, setBots] = useState<Bot[]>(() => {
    const saved = localStorage.getItem('bc_bots');
    return saved ? JSON.parse(saved) : initialBots;
  });

  useEffect(() => {
    localStorage.setItem('bc_bots', JSON.stringify(bots));
  }, [bots]);

  const addBot = (botData: Omit<Bot, 'id' | 'createdAt' | 'conversations'>) => {
    const newBot: Bot = {
      ...botData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      conversations: 0,
      initial: botData.name.substring(0, 2).toUpperCase(),
      gradient: 'from-bc-accent to-blue-600', // Default gradient
    };
    setBots((prev) => [...prev, newBot]);
  };

  const updateBot = (id: string, botData: Partial<Bot>) => {
    setBots((prev) => prev.map((b) => (b.id === id ? { ...b, ...botData } : b)));
  };

  const deleteBot = (id: string) => {
    setBots((prev) => prev.filter((b) => b.id !== id));
  };

  const getBot = (id: string) => bots.find((b) => b.id === id);

  return (
    <BotContext.Provider value={{ bots, addBot, updateBot, deleteBot, getBot }}>
      {children}
    </BotContext.Provider>
  );
};

export const useBots = () => {
  const context = useContext(BotContext);
  if (context === undefined) {
    throw new Error('useBots must be used within a BotProvider');
  }
  return context;
};
