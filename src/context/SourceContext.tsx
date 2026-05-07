import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Source {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'csv' | 'website' | 'integration';
  size?: string;
  pages?: number;
  status: 'synced' | 'syncing' | 'error';
  bots: string[];
  lastSynced: string;
}

interface SourceContextType {
  sources: Source[];
  addSource: (source: Omit<Source, 'id' | 'lastSynced' | 'status'>) => void;
  deleteSource: (id: string) => void;
  syncSource: (id: string) => void;
}

const SourceContext = createContext<SourceContextType | undefined>(undefined);

const initialSources: Source[] = [
  {
    id: '1',
    name: 'product-docs.pdf',
    type: 'pdf',
    size: '12.4 MB',
    pages: 156,
    status: 'synced',
    bots: ['Sales Assistant', 'Support Bot'],
    lastSynced: '2 hours ago',
  },
  {
    id: '2',
    name: 'pricing-sheet.csv',
    type: 'csv',
    size: '245 KB',
    status: 'synced',
    bots: ['Sales Assistant'],
    lastSynced: '1 day ago',
  },
];

export const SourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sources, setSources] = useState<Source[]>(() => {
    const saved = localStorage.getItem('bc_sources');
    return saved ? JSON.parse(saved) : initialSources;
  });

  useEffect(() => {
    localStorage.setItem('bc_sources', JSON.stringify(sources));
  }, [sources]);

  const addSource = (sourceData: Omit<Source, 'id' | 'lastSynced' | 'status'>) => {
    const newSource: Source = {
      ...sourceData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'syncing',
      lastSynced: 'Just now',
    };
    setSources((prev) => [newSource, ...prev]);
    
    // Simulate sync completion
    setTimeout(() => {
      setSources((prev) => 
        prev.map(s => s.id === newSource.id ? { ...s, status: 'synced' } : s)
      );
    }, 3000);
  };

  const deleteSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  const syncSource = (id: string) => {
    setSources((prev) => 
      prev.map(s => s.id === id ? { ...s, status: 'syncing' } : s)
    );
    setTimeout(() => {
      setSources((prev) => 
        prev.map(s => s.id === id ? { ...s, status: 'synced', lastSynced: 'Just now' } : s)
      );
    }, 2000);
  };

  return (
    <SourceContext.Provider value={{ sources, addSource, deleteSource, syncSource }}>
      {children}
    </SourceContext.Provider>
  );
};

export const useSources = () => {
  const context = useContext(SourceContext);
  if (context === undefined) {
    throw new Error('useSources must be used within a SourceProvider');
  }
  return context;
};
