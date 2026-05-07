import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: string;
  sources?: string[];
}

interface Conversation {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: boolean;
  bot: string;
  messages: Message[];
}

const initialConversations: Conversation[] = [
  {
    id: '1',
    name: 'User #2847',
    preview: 'What are your shipping options?',
    time: '5m ago',
    unread: true,
    bot: 'Sales Assistant',
    messages: [
      {
        id: 'm1',
        type: 'system',
        content: 'Conversation started',
        timestamp: '10:20 AM',
      },
      {
        id: 'm2',
        type: 'user',
        content: 'What are your shipping options?',
        timestamp: '10:21 AM',
      },
      {
        id: 'm3',
        type: 'bot',
        content:
          'We offer several shipping options:\n\n• **Standard Shipping** (5-7 business days) — Free on orders over $50\n• **Express Shipping** (2-3 business days) — $9.99\n• **Next Day Delivery** — $19.99\n\nAll orders are trackable via your account dashboard. Would you like help with anything else?',
        timestamp: '10:21 AM',
        sources: ['shipping-policy.pdf'],
      },
      {
        id: 'm4',
        type: 'user',
        content: 'Do you ship internationally?',
        timestamp: '10:23 AM',
      },
      {
        id: 'm5',
        type: 'bot',
        content:
          'Yes, we ship to over 50 countries worldwide! International shipping rates vary by destination:\n\n• **Canada & Mexico**: $14.99 (5-10 days)\n• **Europe**: $19.99 (7-14 days)\n• **Asia-Pacific**: $24.99 (10-18 days)\n\nCustoms duties may apply depending on your country.',
        timestamp: '10:23 AM',
        sources: ['international-shipping.pdf'],
      },
    ],
  },
  {
    id: '2',
    name: 'User #1852',
    preview: 'I need help with my refund',
    time: '12m ago',
    unread: true,
    bot: 'Support Bot',
    messages: [
      {
        id: 'm1',
        type: 'system',
        content: 'Conversation started',
        timestamp: '9:45 AM',
      },
      {
        id: 'm2',
        type: 'user',
        content: 'I need help with my refund for order #4821',
        timestamp: '9:46 AM',
      },
      {
        id: 'm3',
        type: 'bot',
        content:
          'I\'d be happy to help with your refund request. I can see that order #4821 is eligible for our 30-day return policy.\n\nTo process your refund, I\'ll need to confirm a few details. Could you please provide the email address associated with the order?',
        timestamp: '9:46 AM',
      },
    ],
  },
  {
    id: '3',
    name: 'User #3105',
    preview: 'Thanks for the help!',
    time: '1h ago',
    unread: false,
    bot: 'Sales Assistant',
    messages: [
      {
        id: 'm1',
        type: 'system',
        content: 'Conversation started',
        timestamp: '8:30 AM',
      },
      {
        id: 'm2',
        type: 'user',
        content: 'What payment methods do you accept?',
        timestamp: '8:31 AM',
      },
      {
        id: 'm3',
        type: 'bot',
        content:
          'We accept all major payment methods:\n\n• Credit/Debit Cards (Visa, Mastercard, Amex)\n• PayPal\n• Apple Pay & Google Pay\n• Bank Transfer (for Business accounts)',
        timestamp: '8:31 AM',
      },
      {
        id: 'm4',
        type: 'user',
        content: 'Thanks for the help!',
        timestamp: '8:33 AM',
      },
      {
        id: 'm5',
        type: 'bot',
        content: 'You\'re welcome! If you have any other questions, feel free to ask. Have a great day!',
        timestamp: '8:33 AM',
      },
    ],
  },
  {
    id: '4',
    name: 'User #1249',
    preview: 'Is there a student discount?',
    time: '2h ago',
    unread: false,
    bot: 'Sales Assistant',
    messages: [],
  },
  {
    id: '5',
    name: 'User #5621',
    preview: 'My account got locked',
    time: '3h ago',
    unread: false,
    bot: 'Support Bot',
    messages: [],
  },
];

const statusOptions = [
  { value: 'active', label: 'Active', icon: Clock, color: 'text-bc-accent' },
  { value: 'resolved', label: 'Resolved', icon: CheckCircle2, color: 'text-bc-success' },
  { value: 'escalated', label: 'Escalated', icon: AlertTriangle, color: 'text-bc-warning' },
];

const suggestedReplies = [
  'Tell me more',
  'That helps, thanks!',
  'I have another question',
];

export default function ChatInterface({ isEmbedded = false }: { isEmbedded?: boolean }) {
  const [allConversations, setAllConversations] = useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<string>('1');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState('active');
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selected = allConversations.find((c) => c.id === selectedId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || !selected) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedConversations = allConversations.map((c) => {
      if (c.id === selectedId) {
        return {
          ...c,
          preview: input,
          messages: [...c.messages, userMessage],
        };
      }
      return c;
    });

    setAllConversations(updatedConversations);
    setInput('');
    setIsTyping(true);

    // Mock bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `I understand you're asking about "${input}". As your AI assistant, I'm here to help with any information based on the data sources provided for this bot.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setAllConversations((prev) =>
        prev.map((c) => {
          if (c.id === selectedId) {
            return {
              ...c,
              messages: [...c.messages, botMessage],
            };
          }
          return c;
        })
      );
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('• ')) {
        return (
          <li key={i} className="ml-4 text-bc-text-secondary">
            {line.replace('• ', '').replace(/\*\*(.*?)\*\*/, '<strong>$1</strong>')}
          </li>
        );
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={i} className="font-semibold text-bc-text mt-2">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return (
        <p key={i} className="text-bc-text-secondary">
          {line.replace(/\*\*(.*?)\*\*/, '<strong>$1</strong>')}
        </p>
      );
    });
  };

  return (
    <div className={`flex ${isEmbedded ? 'h-full' : 'h-[calc(100vh-140px)] lg:h-[calc(100vh-128px)] -mx-4 lg:-mx-8 -mt-4 lg:-mt-8 mb-[-32px]'} bg-bc-surface border border-bc-border rounded-xl overflow-hidden`}>
      {/* Conversation List */}
      <div
        className={`${
          mobileListOpen ? 'fixed inset-0 z-40 w-[280px]' : 'hidden md:flex'
        } md:relative md:w-[320px] flex-col border-r border-bc-border bg-bc-surface`}
      >
        {/* List Header */}
        <div className="p-4 border-b border-bc-border space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bc-text-muted" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 bg-bc-surface-light border-bc-border text-bc-text text-[13px] placeholder:text-bc-text-muted h-9"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-bc-surface-light text-bc-text-muted">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-bc-border-subtle">
            {allConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  setSelectedId(conv.id);
                  setMobileListOpen(false);
                }}
                className={`w-full flex items-start gap-3 p-4 text-left transition-colors ${
                  selectedId === conv.id
                    ? 'bg-bc-surface-light border-l-[3px] border-bc-accent'
                    : 'hover:bg-bc-surface-elevated/50 border-l-[3px] border-transparent'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-bc-accent/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-bc-accent" />
                  </div>
                  {conv.unread && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-bc-accent border-2 border-bc-surface" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-bc-text truncate">
                      {conv.name}
                    </p>
                    <span className="text-[11px] text-bc-text-muted shrink-0">
                      {conv.time}
                    </span>
                  </div>
                  <p className="text-[12px] text-bc-text-muted truncate mt-0.5">
                    {conv.preview}
                  </p>
                  <p className="text-[11px] text-bc-accent mt-1">{conv.bot}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* New Conversation */}
        <div className="p-4 border-t border-bc-border">
          <Button className="w-full bg-bc-accent hover:bg-bc-accent-hover text-white gap-1 text-[13px]">
            <Plus className="w-4 h-4" />
            New Conversation
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-bc-border">
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
              <p className="text-sm font-medium text-bc-text">
                {selected?.bot || 'Bot'}
              </p>
              <span className="text-[10px] text-bc-accent border border-bc-accent/30 rounded-full px-2 py-0.5">
                GPT-4 Turbo
              </span>
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
        <ScrollArea className="flex-1 p-4 lg:p-6">
          {selected && selected.messages.length > 0 ? (
            <div className="space-y-4">
              {selected.messages.map((msg) => {
                if (msg.type === 'system') {
                  return (
                    <div key={msg.id} className="text-center py-2">
                      <span className="text-[11px] text-bc-text-muted italic">
                        {msg.content}
                      </span>
                    </div>
                  );
                }

                if (msg.type === 'user') {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[80%] lg:max-w-[70%]">
                        <div className="bg-bc-surface-light rounded-2xl rounded-tr-sm px-4 py-3">
                          <p className="text-sm text-bc-text">{msg.content}</p>
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
                        <div className="text-sm leading-relaxed space-y-1">
                          {formatMessage(msg.content)}
                        </div>
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
                        <span className="text-[10px] text-bc-text-muted">
                          {msg.timestamp}
                        </span>
                        <button className="text-bc-text-muted hover:text-bc-text transition-colors">
                          <Copy className="w-3 h-3" />
                        </button>
                        <button className="text-bc-text-muted hover:text-bc-success transition-colors">
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button className="text-bc-text-muted hover:text-bc-error transition-colors">
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
                    <div className="flex gap-1">
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

              {/* Suggested replies */}
              {!isTyping && selected.messages.length > 0 && (
                <div className="flex flex-wrap gap-2 ml-10">
                  {suggestedReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => setInput(reply)}
                      className="text-[12px] text-bc-text-secondary bg-bc-surface-light border border-bc-border rounded-full px-3 py-1.5 hover:border-bc-accent hover:text-bc-accent transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-bc-surface-light flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-bc-text-muted" />
              </div>
              <p className="text-bc-text-secondary text-sm">
                Select a conversation or start a new one
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="px-4 lg:px-6 py-3 border-t border-bc-border">
          <div className="flex items-end gap-2 bg-bc-surface-light border border-bc-border rounded-2xl px-4 py-2">
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
              disabled={!input.trim()}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                input.trim()
                  ? 'bg-bc-accent text-white hover:bg-bc-accent-hover'
                  : 'bg-bc-surface text-bc-text-muted'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-bc-text-muted mt-1.5 text-center">
            {input.length > 0 ? `${input.length} characters` : 'Press Enter to send'}
          </p>
        </div>
      </div>
    </div>
  );
}
