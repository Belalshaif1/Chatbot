import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: string;
  sources?: string[];
}

export interface Conversation {
  id: string;
  botId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ChatContextType {
  conversations: Conversation[];
  getConversationsForBot: (botId: string) => Conversation[];
  createConversation: (botId: string) => Conversation;
  addMessage: (conversationId: string, message: Omit<Message, 'id'>) => void;
  deleteConversation: (conversationId: string) => void;
  clearMessages: (conversationId: string) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('bc_conversations');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bc_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const getConversationsForBot = (botId: string) =>
    conversations.filter((c) => c.botId === botId).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  const createConversation = (botId: string): Conversation => {
    const newConv: Conversation = {
      id: Math.random().toString(36).substr(2, 9),
      botId,
      title: `New Conversation`,
      messages: [
        {
          id: 'sys-1',
          type: 'system',
          content: 'Conversation started',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConversations((prev) => [newConv, ...prev]);
    return newConv;
  };

  const addMessage = (conversationId: string, message: Omit<Message, 'id'>) => {
    const newMsg: Message = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    };
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const updatedMessages = [...c.messages, newMsg];
        // Update title from first user message
        const firstUserMsg = updatedMessages.find((m) => m.type === 'user');
        const title = firstUserMsg
          ? firstUserMsg.content.substring(0, 40) + (firstUserMsg.content.length > 40 ? '...' : '')
          : c.title;
        return {
          ...c,
          messages: updatedMessages,
          title,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const deleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
  };

  const clearMessages = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          messages: [
            {
              id: 'sys-' + Date.now(),
              type: 'system',
              content: 'Chat cleared',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const deleteMessage = (conversationId: string, messageId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          messages: c.messages.filter((m) => m.id !== messageId),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  return (
    <ChatContext.Provider
      value={{ conversations, getConversationsForBot, createConversation, addMessage, deleteConversation, clearMessages, deleteMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
