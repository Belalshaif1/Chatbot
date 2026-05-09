import React, { createContext, useContext, useState, useEffect } from 'react';

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
  getSourcesForBot: (botId: string) => TrainingSource[];
  getTrainingContext: (botId: string) => string;   // Combined training text for Gemini
  addSource: (source: Omit<TrainingSource, 'id' | 'createdAt'>) => string;
  deleteSource: (id: string) => void;
  updateSourceStatus: (id: string, status: SourceStatus, content?: string, error?: string) => void;
}

const SourceContext = createContext<SourceContextType | undefined>(undefined);

export const SourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sources, setSources] = useState<TrainingSource[]>(() => {
    const saved = localStorage.getItem('bc_training_sources');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
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
  }, [sources]);

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

    return `KNOWLEDGE BASE (use this to answer questions accurately):\n\n${parts.join('\n\n')}`;
  };

  const addSource = (sourceData: Omit<TrainingSource, 'id' | 'createdAt'>): string => {
    const id = 'src-' + Math.random().toString(36).substr(2, 9);
    const newSource: TrainingSource = {
      ...sourceData,
      id,
      createdAt: new Date().toISOString(),
    };
    setSources(prev => [newSource, ...prev]);
    return id;
  };

  const deleteSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const updateSourceStatus = (id: string, status: SourceStatus, content?: string, error?: string) => {
    setSources(prev => prev.map(s =>
      s.id === id
        ? { ...s, status, ...(content !== undefined ? { content, charCount: content.length } : {}), ...(error ? { errorMsg: error } : {}) }
        : s
    ));
  };

  return (
    <SourceContext.Provider value={{ sources, getSourcesForBot, getTrainingContext, addSource, deleteSource, updateSourceStatus }}>
      {children}
    </SourceContext.Provider>
  );
};

export const useSources = () => {
  const ctx = useContext(SourceContext);
  if (!ctx) throw new Error('useSources must be used within SourceProvider');
  return ctx;
};
