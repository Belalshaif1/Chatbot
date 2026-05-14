import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Bot } from '../types/bot';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './UserContext';

interface BotContextType {
  allBots: Bot[];
  bots: Bot[];
  isLoading: boolean;

  addBot: (botData: Omit<Bot, 'id' | 'createdAt' | 'conversations' | 'userId' | 'initial' | 'gradient'>, userId: string) => Promise<Bot>;
  updateBot: (id: string, bot: Partial<Bot>) => Promise<void>;
  deleteBot: (id: string) => Promise<void>;
  suspendBot: (id: string) => Promise<void>;
  activateBot: (id: string) => Promise<void>;
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

export const BotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isSuperAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [allBots, setAllBots] = useState<Bot[]>([]);

  // ── Sync with Supabase or LocalStorage ───────────────────
  useEffect(() => {
    const fetchBots = async () => {
      setIsLoading(true);
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('bots').select('*');
        if (data) setAllBots(data);
        else if (error) console.error('Error fetching bots:', error);
      } else {
        const saved = localStorage.getItem('bc_all_bots');
        if (saved) {
          const parsed: Bot[] = JSON.parse(saved);
          setAllBots(parsed);
        } else {
          setAllBots(seedBots);
        }
      }
      setIsLoading(false);
    };

    fetchBots();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured() && !isLoading && allBots.length > 0) {
      localStorage.setItem('bc_all_bots', JSON.stringify(allBots));
    }
  }, [allBots, isLoading]);

  // Filtered bots for current session
  const bots = isSuperAdmin
    ? allBots
    : allBots.filter((b) => b.userId === currentUser?.id && b.status !== 'suspended');

  const getBotsForUser = (uid: string) => allBots.filter((b) => b.userId === uid);

  const addBot = async (botData: any, uid: string): Promise<Bot> => {
    const newBot: Bot = {
      ...botData,
      userId: uid,
      id: 'bot-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      conversations: 0,
      initial: botData.name.substring(0, 2).toUpperCase(),
      gradient: 'from-bc-accent to-blue-600',
    };

    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('bots').insert(newBot);
      if (error) console.error('Supabase insert error:', error);
    }

    setAllBots((prev) => [...prev, newBot]);
    return newBot;
  };

  const updateBot = async (id: string, botData: Partial<Bot>) => {
    if (isSupabaseConfigured()) {
      await supabase.from('bots').update(botData).eq('id', id);
    }
    setAllBots((prev) => prev.map((b) => (b.id === id ? { ...b, ...botData } : b)));
  };

  const deleteBot = async (id: string) => {
    if (isSupabaseConfigured()) {
      await supabase.from('bots').delete().eq('id', id);
    }
    setAllBots((prev) => prev.filter((b) => b.id !== id));
  };

  const suspendBot = async (id: string) => {
    await updateBot(id, { status: 'suspended' });
  };

  const activateBot = async (id: string) => {
    await updateBot(id, { status: 'live' });
  };

  const getBot = (id: string) => allBots.find((b) => b.id === id);

  return (
    <BotContext.Provider
      value={{ allBots, bots, isLoading, addBot, updateBot, deleteBot, suspendBot, activateBot, getBot, getBotsForUser }}
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
