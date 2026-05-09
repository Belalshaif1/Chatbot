import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Bot,
  Send,
  Paperclip,
  Mic,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  MessageSquare,
  Trash2,
  Check,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useChat, type Conversation } from '@/context/ChatContext';
import { useBots } from '@/context/BotContext';
import { useSources } from '@/context/SourceContext';
import { sendMessageToGemini, hasApiKey, type GeminiMessage } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';

const statusOptions = [
  { value: 'active', label: 'Active', icon: Clock, color: 'text-bc-accent' },
  { value: 'resolved', label: 'Resolved', icon: CheckCircle2, color: 'text-bc-success' },
  { value: 'escalated', label: 'Escalated', icon: AlertTriangle, color: 'text-bc-warning' },
];

// -- Props --
interface ChatInterfaceProps {
  isEmbedded?: boolean;
  botId?: string;
}

function MarkdownMessage({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed prose-chat">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="text-bc-text-secondary mb-1 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-bc-text">{children}</strong>,
          ul: ({ children }) => <ul className="list-disc ml-4 space-y-0.5 my-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-4 space-y-0.5 my-1">{children}</ol>,
          li: ({ children }) => <li className="text-bc-text-secondary">{children}</li>,
          code: ({ children }) => (
            <code className="bg-bc-surface-light px-1.5 py-0.5 rounded text-xs font-mono text-bc-accent">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-bc-surface-light border border-bc-border rounded-lg p-3 text-xs font-mono overflow-x-auto my-2">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default function ChatInterface({ isEmbedded = false, botId }: ChatInterfaceProps) {
  const { getConversationsForBot, createConversation, addMessage, deleteConversation } = useChat();
  const { bots, getBot } = useBots();
  const { getTrainingContext } = useSources();

  // Determine active bot
  const [activeBotId, setActiveBotId] = useState<string>(
    botId || bots[0]?.id || ''
  );

  const activeBot = getBot(activeBotId);
  const botConversations = getConversationsForBot(activeBotId);

  const [selectedConvId, setSelectedConvId] = useState<string>('');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState('active');
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [likedMsgId, setLikedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-select first conversation or create one
  useEffect(() => {
    if (activeBotId) {
      const convs = getConversationsForBot(activeBotId);
      if (convs.length === 0) {
        const newConv = createConversation(activeBotId);
        setSelectedConvId(newConv.id);
      } else if (!selectedConvId || !convs.find((c) => c.id === selectedConvId)) {
        setSelectedConvId(convs[0].id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBotId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConvId, isTyping, botConversations]);

  const selectedConv: Conversation | undefined = botConversations.find((c) => c.id === selectedConvId);

  const handleNewConversation = () => {
    const newConv = createConversation(activeBotId);
    setSelectedConvId(newConv.id);
    setMobileListOpen(false);
  };

  const buildHistory = (conv: Conversation): GeminiMessage[] => {
    return conv.messages
      .filter((m) => m.type === 'user' || m.type === 'bot')
      .map((m) => ({
        role: m.type === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));
  };

  const getSystemPrompt = () => {
    if (!activeBot) return 'You are a helpful AI assistant.';
    const hasData = getTrainingContext(activeBotId).length > 50;
    return [
      `You are "${activeBot.name}", a professional and highly accurate AI assistant.`,
      activeBot.description ? `Your purpose: ${activeBot.description}.` : '',
      activeBot.welcomeMessage ? `Greeting style: "${activeBot.welcomeMessage}".` : '',
      hasData ? 'You have a specialized knowledge base. ALWAYS use it as your primary source of truth.' : '',
      'STRICT RULES:',
      '• Respond in the EXACT same language the user writes in (Arabic → reply in Arabic, English → English).',
      '• Be precise, factual, and professional.',
      '• Use markdown: **bold** for key info, bullet points for lists, code blocks for code.',
      '• Give complete answers — do not truncate or summarize unnecessarily.',
      '• Do NOT start with disclaimers like "I am an AI".',
      '• If unsure, say so clearly rather than guessing.',
    ].filter(Boolean).join('\n');
  };

  const aiMode = hasApiKey() ? 'gemini' : 'local';

  const handleSend = async () => {
    if (!input.trim() || !selectedConv || isTyping) return;

    const userText = input.trim();
    setInput('');
    setIsTyping(true);

    // Add user message
    addMessage(selectedConvId, {
      type: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    try {
      // Build history excluding the just-added message (it's not yet in state)
      const history = buildHistory(selectedConv);

      // Get training context for this bot (RAG)
      const trainingContext = getTrainingContext(activeBotId);

      // Call Gemini with training data
      const response = await sendMessageToGemini(history, getSystemPrompt(), userText, trainingContext);

      addMessage(selectedConvId, {
        type: 'bot',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (err) {
      addMessage(selectedConvId, {
        type: 'bot',
        content: "I apologize, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleLike = (msgId: string) => {
    setLikedMsgId(msgId);
    setTimeout(() => setLikedMsgId(null), 2000);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div
      className={`flex ${
        isEmbedded
          ? 'h-full'
          : 'h-[calc(100vh-140px)] lg:h-[calc(100vh-128px)] -mx-4 lg:-mx-8 -mt-4 lg:-mt-8 mb-[-32px]'
      } bg-bc-surface border border-bc-border rounded-xl overflow-hidden`}
    >
      {/* ── Conversation List ── */}
      <div
        className={`${
          mobileListOpen ? 'fixed inset-0 z-40 w-[300px]' : 'hidden md:flex'
        } md:relative md:w-[300px] flex-col border-r border-bc-border bg-bc-surface shrink-0`}
      >
        {/* Header */}
        <div className="p-4 border-b border-bc-border space-y-3">
          {/* Bot selector — only show when not embedded with a fixed bot */}
          {!botId && bots.length > 1 && (
            <div className="mb-1">
              <select
                value={activeBotId}
                onChange={(e) => {
                  setActiveBotId(e.target.value);
                  setSelectedConvId('');
                }}
                className="w-full bg-bc-surface-light border border-bc-border rounded-lg px-3 py-1.5 text-xs text-bc-text focus:outline-none focus:ring-1 focus:ring-bc-accent"
              >
                {bots.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 bg-bc-surface-light border-bc-border text-bc-text text-[13px] placeholder:text-bc-text-muted h-9"
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-bc-border-subtle">
            {botConversations.length === 0 && (
              <div className="py-10 text-center text-bc-text-muted text-sm px-4">
                No conversations yet. Start a new one!
              </div>
            )}
            {botConversations.map((conv) => {
              const lastMsg = conv.messages.filter((m) => m.type !== 'system').slice(-1)[0];
              const isSelected = selectedConvId === conv.id;
              return (
                <div key={conv.id} className="relative group">
                  <button
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      setMobileListOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-4 text-left transition-colors ${
                      isSelected
                        ? 'bg-bc-surface-light border-l-[3px] border-bc-accent'
                        : 'hover:bg-bc-surface-elevated/50 border-l-[3px] border-transparent'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-bc-accent/20 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-bc-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-medium text-bc-text truncate max-w-[140px]">
                          {conv.title}
                        </p>
                        <span className="text-[11px] text-bc-text-muted shrink-0">
                          {formatTime(conv.updatedAt)}
                        </span>
                      </div>
                      <p className="text-[12px] text-bc-text-muted truncate mt-0.5">
                        {lastMsg ? lastMsg.content.substring(0, 50) : 'No messages yet'}
                      </p>
                      <p className="text-[11px] text-bc-accent mt-1">{activeBot?.name}</p>
                    </div>
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                      if (isSelected) setSelectedConvId('');
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-bc-text-muted hover:text-bc-error hover:bg-bc-error/10 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* New Conversation */}
        <div className="p-4 border-t border-bc-border">
          <Button
            onClick={handleNewConversation}
            className="w-full bg-bc-accent hover:bg-bc-accent-hover text-white gap-1 text-[13px]"
          >
            <Plus className="w-4 h-4" />
            New Conversation
          </Button>
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-bc-border shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1 text-bc-text-secondary"
              onClick={() => setMobileListOpen(true)}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-bc-accent/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-bc-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-bc-text">{activeBot?.name || 'AI Assistant'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-bc-accent border border-bc-accent/30 rounded-full px-2 py-0.5">
                  {activeBot?.model || 'Gemini 1.5 Flash'}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                  aiMode === 'gemini'
                    ? 'text-bc-success border-bc-success/40 bg-bc-success/10'
                    : 'text-amber-400 border-amber-400/40 bg-amber-400/10'
                }`}>
                  {aiMode === 'gemini' ? '✦ GEMINI AI' : '⚡ LOCAL RAG'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Status dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bc-surface-light border border-bc-border text-[12px]">
                {(() => {
                  const s = statusOptions.find((o) => o.value === status);
                  const Icon = s?.icon || Clock;
                  return (
                    <>
                      <Icon className={`w-3 h-3 ${s?.color}`} />
                      <span className="text-bc-text-secondary">{s?.label}</span>
                      <ChevronDown className="w-3 h-3 text-bc-text-muted" />
                    </>
                  );
                })()}
              </button>
              <div className="absolute right-0 top-full mt-1 w-40 bg-bc-surface-elevated border border-bc-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                {statusOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setStatus(opt.value)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-[12px] hover:bg-bc-surface-light transition-colors"
                    >
                      <Icon className={`w-3.5 h-3.5 ${opt.color}`} />
                      <span className="text-bc-text-secondary">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-bc-surface-light text-bc-text-muted">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 lg:p-6">
          {selectedConv && selectedConv.messages.length > 0 ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              {selectedConv.messages.map((msg) => {
                if (msg.type === 'system') {
                  return (
                    <div key={msg.id} className="text-center py-2">
                      <span className="text-[11px] text-bc-text-muted italic">{msg.content}</span>
                    </div>
                  );
                }

                if (msg.type === 'user') {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[80%] lg:max-w-[70%]">
                        <div className="bg-bc-accent rounded-2xl rounded-tr-sm px-4 py-3">
                          <p className="text-sm text-white">{msg.content}</p>
                        </div>
                        <span className="text-[10px] text-bc-text-muted mt-1 block text-right">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="flex gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-bc-accent/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-bc-accent" />
                    </div>
                    <div className="max-w-[85%] lg:max-w-[75%]">
                      <div className="bg-bc-surface-elevated border border-bc-border rounded-2xl rounded-tl-sm px-4 py-3">
                        <MarkdownMessage content={msg.content} />
                        {msg.sources && (
                          <div className="mt-3 pt-3 border-t border-bc-border-subtle">
                            <p className="text-[10px] text-bc-text-muted uppercase tracking-wider mb-1">
                              Sources
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {msg.sources.map((s) => (
                                <span
                                  key={s}
                                  className="inline-flex items-center gap-1 text-[11px] text-bc-text-secondary bg-bc-surface-light border border-bc-border rounded-full px-2 py-0.5"
                                >
                                  <Bot className="w-2.5 h-2.5" />
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-bc-text-muted">{msg.timestamp}</span>
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className={`transition-colors ${copiedMsgId === msg.id ? 'text-bc-success' : 'text-bc-text-muted hover:text-bc-text'}`}
                          title="Copy"
                        >
                          {copiedMsgId === msg.id ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          onClick={() => handleLike(msg.id)}
                          className={`transition-colors ${likedMsgId === msg.id ? 'text-bc-success' : 'text-bc-text-muted hover:text-bc-success'}`}
                          title="Like"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          className="text-bc-text-muted hover:text-bc-error transition-colors"
                          title="Dislike"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-bc-accent/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-bc-accent" />
                  </div>
                  <div className="bg-bc-surface-elevated border border-bc-border rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <div className="w-2 h-2 rounded-full bg-bc-accent animate-typing-dot" />
                      <div
                        className="w-2 h-2 rounded-full bg-bc-accent animate-typing-dot"
                        style={{ animationDelay: '0.15s' }}
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-bc-accent animate-typing-dot"
                        style={{ animationDelay: '0.3s' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full text-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-bc-accent/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-bc-accent" />
              </div>
              <div>
                <p className="text-bc-text font-medium text-base">
                  {activeBot?.welcomeMessage || `Hello! I'm ${activeBot?.name || 'your AI assistant'}`}
                </p>
                <p className="text-bc-text-muted text-sm mt-1">
                  Ask me anything — I'm ready to help!
                </p>
              </div>
              {/* Starter questions */}
              <div className="flex flex-wrap gap-2 justify-center mt-2 max-w-md">
                {['What can you help me with?', 'Tell me about your features', 'How do I get started?'].map(
                  (q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="text-[12px] text-bc-text-secondary bg-bc-surface-light border border-bc-border rounded-full px-3 py-1.5 hover:border-bc-accent hover:text-bc-accent transition-colors"
                    >
                      {q}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 lg:px-6 py-3 border-t border-bc-border shrink-0">
          <div className="flex items-end gap-2 bg-bc-surface-light border border-bc-border rounded-2xl px-4 py-2 focus-within:border-bc-accent transition-colors max-w-3xl mx-auto">
            <button className="p-2 text-bc-text-muted hover:text-bc-text transition-colors shrink-0">
              <Paperclip className="w-[18px] h-[18px]" />
            </button>
            <button className="p-2 text-bc-text-muted hover:text-bc-text transition-colors shrink-0">
              <Mic className="w-[18px] h-[18px]" />
            </button>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 bg-transparent border-0 text-sm text-bc-text placeholder:text-bc-text-muted resize-none min-h-[36px] max-h-[120px] focus-visible:ring-0 focus-visible:ring-offset-0 py-2"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                input.trim() && !isTyping
                  ? 'bg-bc-accent text-white hover:bg-bc-accent-hover scale-100'
                  : 'bg-bc-surface text-bc-text-muted scale-95'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-bc-text-muted mt-1.5 text-center">
            {isTyping ? (
              <span className="text-bc-accent animate-pulse">AI is thinking...</span>
            ) : input.length > 0 ? (
              `${input.length} chars · Press Enter to send`
            ) : (
              'Press Enter to send · Shift+Enter for new line'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
