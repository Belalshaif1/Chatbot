import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Bot } from '../types/bot';

interface BotContextType {
  // All bots (admin use)
  allBots: Bot[];

  // Current user's bots (or all if superadmin)
  bots: Bot[];

  addBot: (bot: Omit<Bot, 'id' | 'createdAt' | 'conversations' | 'userId' | 'initial' | 'gradient'>, userId: string) => Bot;
  updateBot: (id: string, bot: Partial<Bot>) => void;
  deleteBot: (id: string) => void;
  suspendBot: (id: string) => void;
  activateBot: (id: string) => void;
  getBot: (id: string) => Bot | undefined;
  getBotsForUser: (userId: string) => Bot[];
}

const BotContext = createContext<BotContextType | undefined>(undefined);

const seedBots: Bot[] = [
  {
    id: 'bot-seed-1',
    userId: 'superadmin-1',
    name: 'Sales Assistant',
    description: 'Help customers with sales queries',
    welcomeMessage: 'Hello! How can I help you today?',
    model: 'Gemini 1.5 Flash',
    status: 'live',
    conversations: 847,
    initial: 'SA',
    gradient: 'from-bc-accent to-purple-600',
    accentColor: '#2E5BFF',
    avatar: 0,
    darkTheme: true,
    widgetPosition: 'right',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'bot-seed-2',
    userId: 'superadmin-1',
    name: 'Support Bot',
    description: 'Technical support assistant',
    welcomeMessage: 'Welcome to support! How can I assist you?',
    model: 'Gemini 1.5 Flash',
    status: 'live',
    conversations: 532,
    initial: 'SB',
    gradient: 'from-emerald-500 to-teal-600',
    accentColor: '#10B981',
    avatar: 1,
    darkTheme: true,
    widgetPosition: 'right',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const BotProvider: React.FC<{ children: React.ReactNode; userId?: string; isSuperAdmin?: boolean }> = ({
  children,
  userId,
  isSuperAdmin,
}) => {
  const [allBots, setAllBots] = useState<Bot[]>(() => {
    const saved = localStorage.getItem('bc_all_bots');
    if (saved) {
      const parsed: Bot[] = JSON.parse(saved);
      // Ensure seed bots exist for superadmin
      const seedIds = seedBots.map((b) => b.id);
      const missingSeeds = seedBots.filter((sb) => !parsed.find((b) => b.id === sb.id));
      return [...parsed.filter((b) => !seedIds.includes(b.id)), ...seedBots, ...missingSeeds];
    }
    return seedBots;
  });

  useEffect(() => {
    localStorage.setItem('bc_all_bots', JSON.stringify(allBots));
  }, [allBots]);

  // Filtered bots for current session
  const bots = isSuperAdmin
    ? allBots
    : allBots.filter((b) => b.userId === userId && b.status !== 'suspended');

  const getBotsForUser = (uid: string) => allBots.filter((b) => b.userId === uid);

  const addBot = (botData: Omit<Bot, 'id' | 'createdAt' | 'conversations' | 'userId' | 'initial' | 'gradient'>, uid: string): Bot => {
    const newBot: Bot = {
      ...botData,
      userId: uid,
      id: 'bot-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      conversations: 0,
      initial: botData.name.substring(0, 2).toUpperCase(),
      gradient: 'from-bc-accent to-blue-600',
    };
    setAllBots((prev) => [...prev, newBot]);
    return newBot;
  };

  const updateBot = (id: string, botData: Partial<Bot>) => {
    setAllBots((prev) => prev.map((b) => (b.id === id ? { ...b, ...botData } : b)));
  };

  const deleteBot = (id: string) => {
    setAllBots((prev) => prev.filter((b) => b.id !== id));
  };

  const suspendBot = (id: string) => {
    setAllBots((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'suspended' } : b)));
  };

  const activateBot = (id: string) => {
    setAllBots((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'live' } : b)));
  };

  const getBot = (id: string) => allBots.find((b) => b.id === id);

  return (
    <BotContext.Provider
      value={{ allBots, bots, addBot, updateBot, deleteBot, suspendBot, activateBot, getBot, getBotsForUser }}
    >
      {children}
    </BotContext.Provider>
  );
};

export const useBots = () => {
  const context = useContext(BotContext);
  if (!context) throw new Error('useBots must be used within a BotProvider');
  return context;
};
