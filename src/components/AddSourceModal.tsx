import { useState, useRef } from 'react';
import {
  X,
  Upload,
  Globe,
  FileText,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  File,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSources } from '@/context/SourceContext';

interface QAPair {
  question: string;
  answer: string;
}

interface AddSourceModalProps {
  open: boolean;
  onClose: () => void;
}

type TabType = 'file' | 'website' | 'text' | 'qa';

const tabs: { id: TabType; label: string; icon: typeof Upload; desc: string }[] = [
  { id: 'file', label: 'Files', icon: Upload, desc: 'PDF, DOCX, TXT, CSV' },
  { id: 'website', label: 'Website', icon: Globe, desc: 'Crawl any URL' },
  { id: 'text', label: 'Text', icon: FileText, desc: 'Paste raw content' },
  { id: 'qa', label: 'Q&A', icon: HelpCircle, desc: 'Custom pairs' },
];

export default function AddSourceModal({ open, onClose }: AddSourceModalProps) {
  const { addSource } = useSources();
  const [activeTab, setActiveTab] = useState<TabType>('file');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [qaPairs, setQaPairs] = useState<QAPair[]>([{ question: '', answer: '' }]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleAddQA = () => {
    setQaPairs((prev) => [...prev, { question: '', answer: '' }]);
  };

  const handleRemoveQA = (i: number) => {
    setQaPairs((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    const delay = activeTab === 'file' ? 3000 : activeTab === 'website' ? 4000 : 2000;

    setTimeout(() => {
      if (activeTab === 'file' && selectedFile) {
        addSource({
          name: selectedFile.name,
          type: selectedFile.name.endsWith('.pdf')
            ? 'pdf'
            : selectedFile.name.endsWith('.csv')
            ? 'csv'
            : 'doc',
          size: `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`,
          bots: [],
        });
      } else if (activeTab === 'website') {
        addSource({ name: url, type: 'website', bots: [] });
      } else if (activeTab === 'text') {
        addSource({
          name: `Text Content (${textContent.length} chars)`,
          type: 'doc',
          bots: [],
        });
      } else if (activeTab === 'qa') {
        addSource({
          name: `Q&A Set (${qaPairs.length} pairs)`,
          type: 'doc',
          bots: [],
        });
      }

      setIsProcessing(false);
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
        setSelectedFile(null);
        setUrl('');
        setTextContent('');
        setQaPairs([{ question: '', answer: '' }]);
        onClose();
      }, 1500);
    }, delay);
  };

  const canSubmit =
    (activeTab === 'file' && !!selectedFile) ||
    (activeTab === 'website' && url.trim().length > 5) ||
    (activeTab === 'text' && textContent.trim().length > 20) ||
    (activeTab === 'qa' && qaPairs.some((p) => p.question && p.answer));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-bc-surface border border-bc-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-bc-border">
          <div>
            <h2 className="text-lg font-bold text-bc-text">Add Data Source</h2>
            <p className="text-[13px] text-bc-text-muted mt-0.5">
              Train your bot with your data
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bc-surface-light text-bc-text-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-bc-border px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-[13px] font-medium border-b-2 transition-all mr-1 ${
                  activeTab === tab.id
                    ? 'border-bc-accent text-bc-accent'
                    : 'border-transparent text-bc-text-muted hover:text-bc-text-secondary'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 min-h-[300px]">
          {/* File Upload */}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-bc-accent bg-bc-accent/10'
                    : selectedFile
                    ? 'border-bc-success bg-bc-success/5'
                    : 'border-bc-border hover:border-bc-accent/50 hover:bg-bc-surface-light'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.txt,.csv"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-bc-success/20 flex items-center justify-center">
                      <File className="w-6 h-6 text-bc-success" />
                    </div>
                    <div>
                      <p className="font-semibold text-bc-text">{selectedFile.name}</p>
                      <p className="text-[12px] text-bc-text-muted mt-0.5">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                      className="text-[12px] text-bc-error hover:underline"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-bc-surface-light flex items-center justify-center">
                      <Upload className="w-7 h-7 text-bc-text-muted" />
                    </div>
                    <div>
                      <p className="font-semibold text-bc-text">
                        Drop files here or <span className="text-bc-accent">browse</span>
                      </p>
                      <p className="text-[12px] text-bc-text-muted mt-1">
                        PDF, DOCX, TXT, CSV · Max 50MB per file
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {['PDF', 'DOCX', 'TXT', 'CSV', 'XLSX'].map((ext) => (
                  <span
                    key={ext}
                    className="text-[11px] font-medium text-bc-text-secondary bg-bc-surface-light border border-bc-border rounded-full px-2.5 py-1"
                  >
                    .{ext.toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Website URL */}
          {activeTab === 'website' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-bc-text-secondary text-[13px]">Website URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted" />
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/docs"
                    className="pl-10 bg-bc-surface-light border-bc-border text-bc-text placeholder:text-bc-text-muted h-11"
                  />
                </div>
                <p className="text-[12px] text-bc-text-muted">
                  We'll crawl this URL and extract all text content for training.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-bc-text-secondary text-[13px]">Crawl Depth</Label>
                <div className="flex gap-2">
                  {[
                    { val: '1', label: 'This page only' },
                    { val: '2', label: 'This page + links' },
                    { val: '3', label: 'Entire site (sitemap)' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      className="flex-1 py-2.5 px-3 text-[12px] font-medium rounded-lg border border-bc-border text-bc-text-secondary hover:border-bc-accent hover:text-bc-accent transition-colors"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-bc-surface-light rounded-xl border border-bc-border">
                <p className="text-[12px] text-bc-text-secondary">
                  💡 Make sure the URL is publicly accessible. Private pages behind login walls cannot be crawled.
                </p>
              </div>
            </div>
          )}

          {/* Raw Text */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-bc-text-secondary text-[13px]">Paste your content</Label>
                <span className="text-[11px] text-bc-text-muted">
                  {textContent.length.toLocaleString()} chars
                  {textContent.length > 0 && (
                    <span className="ml-1 text-bc-success">
                      (~{Math.ceil(textContent.split(/\s+/).length / 750)} pages)
                    </span>
                  )}
                </span>
              </div>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste your content here — product descriptions, FAQs, help articles, terms of service, etc."
                rows={10}
                className="w-full bg-bc-surface-light border border-bc-border rounded-xl p-4 text-[13px] text-bc-text placeholder:text-bc-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-bc-accent/30 font-mono leading-relaxed"
              />
            </div>
          )}

          {/* Q&A Pairs */}
          {activeTab === 'qa' && (
            <div className="space-y-4">
              <p className="text-[13px] text-bc-text-secondary">
                Add specific question and answer pairs to give your bot precise answers.
              </p>
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {qaPairs.map((pair, i) => (
                  <div
                    key={i}
                    className="p-4 bg-bc-surface-light border border-bc-border rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-bc-accent uppercase tracking-wider">
                        Pair {i + 1}
                      </span>
                      {qaPairs.length > 1 && (
                        <button
                          onClick={() => handleRemoveQA(i)}
                          className="text-bc-text-muted hover:text-bc-error transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <Input
                      value={pair.question}
                      onChange={(e) =>
                        setQaPairs((prev) =>
                          prev.map((p, idx) => (idx === i ? { ...p, question: e.target.value } : p))
                        )
                      }
                      placeholder="Question: What are your business hours?"
                      className="bg-bc-surface border-bc-border text-bc-text text-[13px] placeholder:text-bc-text-muted"
                    />
                    <Input
                      value={pair.answer}
                      onChange={(e) =>
                        setQaPairs((prev) =>
                          prev.map((p, idx) => (idx === i ? { ...p, answer: e.target.value } : p))
                        )
                      }
                      placeholder="Answer: We're open Mon-Fri, 9am to 6pm EST."
                      className="bg-bc-surface border-bc-border text-bc-text text-[13px] placeholder:text-bc-text-muted"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddQA}
                className="flex items-center gap-2 text-[13px] font-semibold text-bc-accent hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add another pair
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-bc-border bg-bc-surface-elevated/30">
          <p className="text-[12px] text-bc-text-muted">
            Data is processed securely and never used to train external models.
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-bc-border text-bc-text-secondary text-[13px] h-9"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isProcessing || isDone}
              className="bg-bc-accent hover:bg-bc-accent-hover text-white text-[13px] h-9 min-w-[120px]"
            >
              {isDone ? (
                <><CheckCircle2 className="w-4 h-4 mr-1.5" /> Added!</>
              ) : isProcessing ? (
                <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Processing...</>
              ) : (
                'Add Source'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
