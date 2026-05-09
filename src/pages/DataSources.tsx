import { useState, useRef, useEffect } from 'react';
import {
  Upload, Globe, FileText, Plus, Trash2, RefreshCw,
  CheckCircle2, AlertCircle, Loader2, Database, X,
  FileCode, FileSpreadsheet, File, ChevronDown, MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSources } from '@/context/SourceContext';
import { useBots } from '@/context/BotContext';
import { useAuth } from '@/context/UserContext';
import { extractTextFromFile, extractTextFromUrl, formatFileSize, estimateTokens } from '@/lib/extractor';

const FILE_TYPES = ['.pdf', '.txt', '.md', '.csv', '.docx', '.doc', '.html', '.json'];

function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <File className="w-4 h-4 text-red-400" />;
  if (ext === 'csv') return <FileSpreadsheet className="w-4 h-4 text-green-400" />;
  if (['json', 'html', 'xml'].includes(ext || '')) return <FileCode className="w-4 h-4 text-blue-400" />;
  return <FileText className="w-4 h-4 text-bc-accent" />;
}

type TabId = 'file' | 'website' | 'text' | 'qa';

export default function DataSources() {
  const { sources, addSource, deleteSource, updateSourceStatus, getSourcesForBot } = useSources();
  const { bots } = useBots();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<TabId>('file');
  const [selectedBotId, setSelectedBotId] = useState<string>('');
  const [url, setUrl] = useState('');
  const [customText, setCustomText] = useState('');
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auto-select first bot
  useEffect(() => {
    if (!selectedBotId && bots.length > 0) {
      setSelectedBotId(bots[0].id);
    }
  }, [bots, selectedBotId]);

  const botSources = selectedBotId ? getSourcesForBot(selectedBotId) : [];
  const allBotSources = selectedBotId
    ? sources.filter(s => s.botId === selectedBotId)
    : [];

  // ── File upload ────────────────────────────────────────────
  const processFiles = async (files: FileList | File[]) => {
    if (!selectedBotId) return alert('Please select a bot first.');
    setIsProcessing(true);

    for (const file of Array.from(files)) {
      const id = addSource({
        botId: selectedBotId,
        name: file.name,
        type: 'file',
        content: '',
        sizeLabel: formatFileSize(file.size),
        charCount: 0,
        status: 'processing',
      });

      try {
        const text = await extractTextFromFile(file);
        updateSourceStatus(id, 'ready', text);
      } catch (err) {
        updateSourceStatus(id, 'error', '', String(err));
      }
    }
    setIsProcessing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };

  // ── URL fetch ──────────────────────────────────────────────
  const handleAddUrl = async () => {
    if (!url.trim() || !selectedBotId) return;
    const urlStr = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;

    setIsProcessing(true);
    const id = addSource({
      botId: selectedBotId,
      name: urlStr,
      type: 'website',
      content: '',
      sizeLabel: '…',
      charCount: 0,
      status: 'processing',
    });

    try {
      const text = await extractTextFromUrl(urlStr);
      updateSourceStatus(id, 'ready', text);
    } catch (err) {
      updateSourceStatus(id, 'error', '', String(err));
    }

    setUrl('');
    setIsProcessing(false);
  };

  // ── Custom text ────────────────────────────────────────────
  const handleAddText = () => {
    if (!customText.trim() || !selectedBotId) return;
    addSource({
      botId: selectedBotId,
      name: `Custom Text (${new Date().toLocaleDateString()})`,
      type: 'text',
      content: customText.trim(),
      sizeLabel: formatFileSize(customText.length),
      charCount: customText.length,
      status: 'ready',
    });
    setCustomText('');
  };

  // ── Q&A pair ───────────────────────────────────────────────
  const handleAddQA = () => {
    if (!qaQuestion.trim() || !qaAnswer.trim() || !selectedBotId) return;
    const content = `Q: ${qaQuestion.trim()}\nA: ${qaAnswer.trim()}`;
    addSource({
      botId: selectedBotId,
      name: `Q&A: ${qaQuestion.trim().slice(0, 50)}`,
      type: 'qa',
      content,
      sizeLabel: formatFileSize(content.length),
      charCount: content.length,
      status: 'ready',
    });
    setQaQuestion('');
    setQaAnswer('');
  };

  const tabs: { id: TabId; label: string; icon: typeof Upload }[] = [
    { id: 'file', label: 'Upload Files', icon: Upload },
    { id: 'website', label: 'Website URL', icon: Globe },
    { id: 'text', label: 'Paste Text', icon: FileText },
    { id: 'qa', label: 'Q&A Pairs', icon: MessageSquare },
  ];

  const totalChars = botSources.reduce((a, s) => a + s.charCount, 0);
  const totalTokens = estimateTokens(totalChars.toString().padEnd(totalChars, 'x'));

  return (
    <div className="space-y-6 max-w-[900px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-bc-text-secondary text-sm">Train your bots with files, websites, or custom text</p>
        </div>
        {/* Bot selector */}
        <div className="relative">
          <select
            value={selectedBotId}
            onChange={e => setSelectedBotId(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-[13px] bg-bc-surface border border-bc-border rounded-lg text-bc-text cursor-pointer focus:outline-none focus:ring-2 focus:ring-bc-accent/30"
          >
            <option value="">— Select Bot —</option>
            {bots.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-bc-text-muted pointer-events-none" />
        </div>
      </div>

      {/* Stats bar */}
      {selectedBotId && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Training Sources', value: botSources.length },
            { label: 'Total Characters', value: totalChars.toLocaleString() },
            { label: '≈ Tokens', value: estimateTokens('x'.repeat(totalChars)).toLocaleString() },
          ].map(stat => (
            <div key={stat.label} className="bg-bc-surface border border-bc-border rounded-xl p-4">
              <p className="text-[11px] text-bc-text-muted uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-bc-text mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add new source */}
        <div className="bg-bc-surface border border-bc-border rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-bc-border">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-all ${
                    activeTab === tab.id
                      ? 'text-bc-accent border-b-2 border-bc-accent bg-bc-accent/5'
                      : 'text-bc-text-muted hover:text-bc-text-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-5 space-y-4">
            {/* ── FILE UPLOAD ── */}
            {activeTab === 'file' && (
              <div className="space-y-4">
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    dragOver
                      ? 'border-bc-accent bg-bc-accent/5'
                      : 'border-bc-border hover:border-bc-accent/50 hover:bg-bc-surface-light'
                  }`}
                >
                  <Upload className="w-10 h-10 text-bc-text-muted mx-auto mb-3" />
                  <p className="text-sm font-medium text-bc-text">Drop files here or click to browse</p>
                  <p className="text-[11px] text-bc-text-muted mt-1.5">
                    PDF, TXT, MD, CSV, DOCX, HTML, JSON
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept={FILE_TYPES.join(',')}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <p className="text-[11px] text-bc-text-muted text-center">
                  Text is extracted and stored locally. PDFs are parsed page-by-page.
                </p>
              </div>
            )}

            {/* ── WEBSITE URL ── */}
            {activeTab === 'website' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-bc-text-secondary text-[13px]">Website URL</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted" />
                      <Input
                        placeholder="https://your-website.com"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddUrl()}
                        className="pl-10 bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted"
                      />
                    </div>
                    <Button
                      onClick={handleAddUrl}
                      disabled={!url.trim() || !selectedBotId || isProcessing}
                      className="bg-bc-accent hover:bg-bc-accent-hover text-white"
                    >
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="p-3 bg-bc-surface-light rounded-lg border border-bc-border">
                  <p className="text-[12px] text-bc-text-secondary">
                    📝 We'll fetch and extract all visible text from this URL. For private sites or login-protected pages, use <strong>Paste Text</strong> instead.
                  </p>
                </div>
              </div>
            )}

            {/* ── PASTE TEXT ── */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-bc-text-secondary text-[13px]">
                    Training Content
                    {customText && (
                      <span className="ml-2 text-[10px] text-bc-text-muted">
                        ({customText.length.toLocaleString()} chars)
                      </span>
                    )}
                  </Label>
                  <Textarea
                    placeholder="Paste product descriptions, FAQs, policies, or any text you want the bot to learn from..."
                    rows={8}
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    className="bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted resize-none text-[13px]"
                  />
                </div>
                <Button
                  onClick={handleAddText}
                  disabled={!customText.trim() || !selectedBotId}
                  className="w-full bg-bc-accent hover:bg-bc-accent-hover text-white"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Add to Knowledge Base
                </Button>
              </div>
            )}

            {/* ── Q&A PAIRS ── */}
            {activeTab === 'qa' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-bc-text-secondary text-[13px]">Question</Label>
                  <Input
                    placeholder="e.g. What are your working hours?"
                    value={qaQuestion}
                    onChange={e => setQaQuestion(e.target.value)}
                    className="bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-bc-text-secondary text-[13px]">Answer</Label>
                  <Textarea
                    placeholder="e.g. We're open Monday–Friday, 9am–6pm GMT."
                    rows={4}
                    value={qaAnswer}
                    onChange={e => setQaAnswer(e.target.value)}
                    className="bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted resize-none text-[13px]"
                  />
                </div>
                <Button
                  onClick={handleAddQA}
                  disabled={!qaQuestion.trim() || !qaAnswer.trim() || !selectedBotId}
                  className="w-full bg-bc-accent hover:bg-bc-accent-hover text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Q&A Pair
                </Button>
              </div>
            )}

            {!selectedBotId && (
              <p className="text-[12px] text-bc-warning text-center pt-2">
                ⚠️ Please select a bot from the top to add training data.
              </p>
            )}
          </div>
        </div>

        {/* Sources list */}
        <div className="bg-bc-surface border border-bc-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-bc-border">
            <h3 className="text-sm font-semibold text-bc-text">
              {selectedBotId
                ? `Knowledge Base — ${bots.find(b => b.id === selectedBotId)?.name || ''}`
                : 'Select a bot to view sources'}
            </h3>
          </div>

          <div className="divide-y divide-bc-border-subtle max-h-[480px] overflow-y-auto">
            {allBotSources.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <Database className="w-10 h-10 text-bc-text-muted/40 mb-3" />
                <p className="text-bc-text-muted text-sm">No training data yet</p>
                <p className="text-bc-text-muted text-[12px] mt-1">Upload files, add URLs, or paste text to start training</p>
              </div>
            ) : (
              allBotSources.map(source => (
                <div key={source.id} className="flex items-start gap-3 p-4 hover:bg-bc-surface-light/50 transition-colors group">
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-lg bg-bc-surface flex items-center justify-center shrink-0 mt-0.5">
                    {source.type === 'website' ? <Globe className="w-4 h-4 text-blue-400" /> :
                     source.type === 'qa' ? <MessageSquare className="w-4 h-4 text-purple-400" /> :
                     source.type === 'text' ? <FileText className="w-4 h-4 text-bc-accent" /> :
                     fileIcon(source.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-bc-text truncate">{source.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {source.status === 'processing' && (
                        <span className="flex items-center gap-1 text-[11px] text-bc-warning">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Processing…
                        </span>
                      )}
                      {source.status === 'ready' && (
                        <span className="flex items-center gap-1 text-[11px] text-bc-success">
                          <CheckCircle2 className="w-3 h-3" />
                          Ready
                        </span>
                      )}
                      {source.status === 'error' && (
                        <span className="flex items-center gap-1 text-[11px] text-bc-error" title={source.errorMsg}>
                          <AlertCircle className="w-3 h-3" />
                          Error
                        </span>
                      )}
                      {source.charCount > 0 && (
                        <span className="text-[11px] text-bc-text-muted">
                          {source.charCount.toLocaleString()} chars
                        </span>
                      )}
                      <span className="text-[11px] text-bc-text-muted capitalize">{source.type}</span>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteSource(source.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-bc-error/10 text-bc-text-muted hover:text-bc-error transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {allBotSources.length > 0 && (
            <div className="p-3 border-t border-bc-border">
              <p className="text-[11px] text-bc-text-muted text-center">
                {botSources.length} ready source{botSources.length !== 1 ? 's' : ''} · {totalChars.toLocaleString()} characters total
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
