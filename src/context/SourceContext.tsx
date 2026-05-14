import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type SourceType = 'file' | 'website' | 'text' | 'qa';
export type SourceStatus = 'processing' | 'ready' | 'error';

export interface TrainingSource {
  id: string;
  botId: string;             // Which bot this belongs to
  name: string;              // Display name (filename / URL / "Custom Text")
  type: SourceType;
  content: string;           // Extracted text content (the training data)
  sizeLabel: string;         // Human-readable size
  charCount: number;         // Character count of content
  status: SourceStatus;
  errorMsg?: string;
  createdAt: string;
}

interface SourceContextType {
  sources: TrainingSource[];
  isLoading: boolean;
  getSourcesForBot: (botId: string) => TrainingSource[];
  getTrainingContext: (botId: string) => string;
  addSource: (source: Omit<TrainingSource, 'id' | 'createdAt'>) => Promise<string>;
  deleteSource: (id: string) => Promise<void>;
  updateSourceStatus: (id: string, status: SourceStatus, content?: string, error?: string) => Promise<void>;
}

const SourceContext = createContext<SourceContextType | undefined>(undefined);

export const SourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sources, setSources] = useState<TrainingSource[]>([]);

  useEffect(() => {
    const fetchSources = async () => {
      setIsLoading(true);
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('sources').select('*');
        if (data) setSources(data);
        else if (error) console.error('Error fetching sources:', error);
      } else {
        const saved = localStorage.getItem('bc_training_sources');
        if (saved) setSources(JSON.parse(saved));
      }
      setIsLoading(false);
    };

    fetchSources();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured() && !isLoading && sources.length > 0) {
      // Only persist metadata + first 100KB of content per source to avoid quota issues
      const toSave = sources.map(s => ({
        ...s,
        content: s.content.slice(0, 100_000),
      }));
      try {
        localStorage.setItem('bc_training_sources', JSON.stringify(toSave));
      } catch {
        console.warn('localStorage quota exceeded — training sources not fully persisted');
      }
    }
  }, [sources, isLoading]);

  const getSourcesForBot = (botId: string) =>
    sources.filter(s => s.botId === botId && s.status === 'ready');

  const getTrainingContext = (botId: string): string => {
    const botSources = getSourcesForBot(botId);
    if (botSources.length === 0) return '';

    const parts = botSources.map(s => {
      const label = s.type === 'website' ? `🌐 Website: ${s.name}` :
                    s.type === 'file' ? `📄 File: ${s.name}` :
                    s.type === 'qa' ? `❓ Q&A` : `📝 Text`;
      return `=== ${label} ===\n${s.content}`;
    });

    return parts.join('\n\n');
  };

  const addSource = async (sourceData: Omit<TrainingSource, 'id' | 'createdAt'>): Promise<string> => {
    const id = 'src-' + Math.random().toString(36).substr(2, 9);
    const newSource: TrainingSource = {
      ...sourceData,
      id,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      await supabase.from('sources').insert(newSource);
    }

    setSources(prev => [newSource, ...prev]);
    return id;
  };

  const deleteSource = async (id: string) => {
    if (isSupabaseConfigured()) {
      await supabase.from('sources').delete().eq('id', id);
    }
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const updateSourceStatus = async (id: string, status: SourceStatus, content?: string, error?: string) => {
    const updates = { status, ...(content !== undefined ? { content, charCount: content.length } : {}), ...(error ? { errorMsg: error } : {}) };
    
    if (isSupabaseConfigured()) {
      await supabase.from('sources').update(updates).eq('id', id);
    }

    setSources(prev => prev.map(s =>
      s.id === id
        ? { ...s, ...updates }
        : s
    ));
  };

  return (
    <SourceContext.Provider value={{ sources, isLoading, getSourcesForBot, getTrainingContext, addSource, deleteSource, updateSourceStatus }}>
      {children}
    </SourceContext.Provider>
  );
};

export const useSources = () => {
  const ctx = useContext(SourceContext);
  if (!ctx) throw new Error('useSources must be used within SourceProvider');
  return ctx;
};
