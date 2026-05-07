import { useState } from 'react';
import {
  Plus,
  Search,
  FileText,
  Globe,
  Table,
  Code,
  Edit3,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Source } from '@/context/SourceContext';
import { useSources } from '@/context/SourceContext';
import AddSourceModal from '@/components/AddSourceModal';

const typeIcons = {
  pdf: FileText,
  doc: FileText,
  csv: Table,
  website: Globe,
  integration: Code,
};

const statusConfig = {
  synced: { icon: CheckCircle2, color: 'text-bc-success', label: 'Synced' },
  syncing: { icon: RefreshCw, color: 'text-bc-warning', label: 'Syncing' },
  error: { icon: AlertCircle, color: 'text-bc-error', label: 'Error' },
};

const filters = ['All', 'Files', 'Websites', 'Integrations'];

export default function DataSources() {
  const { sources, deleteSource, syncSource } = useSources();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = sources.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === 'All'
        ? true
        : activeFilter === 'Files'
          ? s.type === 'pdf' || s.type === 'doc' || s.type === 'csv'
          : activeFilter === 'Websites'
            ? s.type === 'website'
            : s.type === 'integration';
    return matchesSearch && matchesFilter;
  });

  const totalChars = sources.reduce((acc, s) => acc + (s.pages ? s.pages * 2500 : 10000), 0);

  return (
    <div className="space-y-6 pb-8">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Sources', value: sources.length, icon: Database, color: 'text-bc-accent' },
          { label: 'Synced', value: sources.filter(s => s.status === 'synced').length, icon: CheckCircle2, color: 'text-bc-success' },
          { label: 'Syncing', value: sources.filter(s => s.status === 'syncing').length, icon: RefreshCw, color: 'text-bc-warning' },
          { label: 'Characters', value: `${(totalChars / 1000).toFixed(0)}K`, icon: FileText, color: 'text-bc-text-secondary' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-bc-surface border border-bc-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-bc-surface-light flex items-center justify-center shrink-0">
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-bc-text">{stat.value}</p>
                <p className="text-[11px] text-bc-text-muted">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-bc-accent hover:bg-bc-accent-hover text-white gap-1.5 text-[13px] h-9 px-4 shadow-glow"
        >
          <Plus className="w-4 h-4" />
          Add Source
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted" />
          <Input
            placeholder="Search sources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-bc-surface-light border-bc-border text-bc-text text-[13px] placeholder:text-bc-text-muted h-9 w-56"
          />
        </div>
        <div className="flex gap-1 p-1 bg-bc-surface-light border border-bc-border rounded-lg ml-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                activeFilter === f
                  ? 'bg-bc-surface text-bc-text shadow-sm'
                  : 'text-bc-text-muted hover:text-bc-text-secondary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Sources Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-bc-surface-light flex items-center justify-center mb-4">
            <Database className="w-8 h-8 text-bc-text-muted" />
          </div>
          <p className="text-bc-text font-semibold">No sources yet</p>
          <p className="text-bc-text-muted text-sm mt-1">
            Add files, websites, or text to train your chatbot
          </p>
          <Button
            onClick={() => setModalOpen(true)}
            className="mt-6 bg-bc-accent hover:bg-bc-accent-hover text-white gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add your first source
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((source) => {
            const Icon = typeIcons[source.type];
            const status = statusConfig[source.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={source.id}
                className="group bg-bc-surface border border-bc-border rounded-xl p-5 hover:border-bc-accent/30 hover:shadow-card transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-bc-surface-light flex items-center justify-center">
                      <Icon className="w-5 h-5 text-bc-accent" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-bc-text truncate max-w-[160px]">
                        {source.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`flex items-center gap-1 text-[11px] font-medium ${status.color}`}>
                          <StatusIcon
                            className={`w-3 h-3 ${source.status === 'syncing' ? 'animate-spin' : ''}`}
                          />
                          {status.label}
                        </span>
                        {source.size && (
                          <span className="text-[11px] text-bc-text-muted">• {source.size}</span>
                        )}
                        {source.pages && (
                          <span className="text-[11px] text-bc-text-muted">• {source.pages}p</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bot tags */}
                {source.bots.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {source.bots.map((bot) => (
                      <span
                        key={bot}
                        className="text-[11px] text-bc-text-secondary bg-bc-surface-light border border-bc-border rounded-full px-2.5 py-0.5"
                      >
                        {bot}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-bc-border-subtle">
                  <span className="text-[11px] text-bc-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {source.lastSynced}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-md hover:bg-bc-surface-light text-bc-text-muted transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => syncSource(source.id)}
                      className="p-1.5 rounded-md hover:bg-bc-surface-light text-bc-text-muted transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteSource(source.id)}
                      className="p-1.5 rounded-md hover:bg-bc-surface-light text-bc-text-muted hover:text-bc-error transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Source Modal */}
      <AddSourceModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
