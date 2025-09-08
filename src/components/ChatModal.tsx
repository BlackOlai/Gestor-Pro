import React, { useState, useRef, useEffect } from 'react';
import { Expert, Company, ChatMessage, ChatSession } from '../types';
import { X, Send, User, Bot, Trash2 } from 'lucide-react';
import { useAIConfig } from '../hooks/useAIConfig';
import { useAuth } from '../contexts/AuthContext';

interface ChatModalProps {
  expert: Expert;
  company: Company;
  isOpen: boolean;
  onClose: () => void;
  chatSession: ChatSession | null;
  onSaveSession: (session: ChatSession) => void;
}

export default function ChatModal({ 
  expert, 
  company, 
  isOpen, 
  onClose, 
  chatSession,
  onSaveSession 
}: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(chatSession?.messages || []);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { getService, isConfigured } = useAIConfig();
  const { user } = useAuth();
  const [serverChatId, setServerChatId] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting from expert
      const greeting = generateGreeting(expert, company);
      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'expert',
        content: greeting,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
    }
  }, [isOpen, expert, company]);

  const generateGreeting = (expert: Expert, company: Company) => {
    const companyInfo = company.name ? `da ${company.name}` : '';
    return `Olá! Sou ${expert.name}, ${expert.specialty.toLowerCase()}. É um prazer ajudar você ${companyInfo}! Como posso contribuir hoje para o crescimento da sua empresa?`;
  };

  const generateResponse = async (userMessage: string): Promise<string> => {
    if (!isConfigured) {
      return 'Por favor, configure sua API key do Groq nas configurações para ativar a IA.';
    }

    try {
      const aiService = getService();
      
      // Criar mensagens no formato correto
      const chatMessages = [
        ...messages.map(msg => ({
          id: msg.id,
          sender: msg.sender,
          content: msg.content,
          timestamp: msg.timestamp
        })),
        {
          id: `msg_${Date.now()}`,
          sender: 'user' as const,
          content: userMessage,
          timestamp: new Date()
        }
      ];

      const extras = user ? { authUser: { id: user.id, email: user.email, name: user.name }, chatId: serverChatId } : { chatId: serverChatId };
      const { message, chatId } = await aiService.sendMessage(chatMessages, expert, extras);
      if (chatId && chatId !== serverChatId) setServerChatId(chatId);
      return message;
    } catch (error) {
      console.error('Error generating AI response:', error);
      console.error('Error details:', error);
      return `Erro na API: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Verifique o console para mais detalhes.`;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    // Generate AI response
    try {
      const responseContent = await generateResponse(inputValue);
      
      // Create placeholder message for typing effect
      const expertResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'expert',
        content: '',
        timestamp: new Date()
      };

      const updatedMessages = [...newMessages, expertResponse];
      setMessages(updatedMessages);
      setIsTyping(false);

      // Simulate typing effect
      let currentText = '';
      const words = responseContent.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        currentText += (i > 0 ? ' ' : '') + words[i];
        
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === expertResponse.id 
              ? { ...msg, content: currentText }
              : msg
          )
        );
        
        // Delay between words (adjust speed here)
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Save session after typing is complete
      const finalMessages = updatedMessages.map(msg => 
        msg.id === expertResponse.id 
          ? { ...msg, content: responseContent }
          : msg
      );
      
      const session: ChatSession = {
        expertId: expert.id,
        messages: finalMessages
      };
      onSaveSession(session);
    } catch (error) {
      console.error('Error in chat:', error);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Tem certeza que deseja limpar toda a conversa? Esta ação não pode ser desfeita.')) {
      // Reset messages to initial greeting
      const greeting = generateGreeting(expert, company);
      const initialMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'expert',
        content: greeting,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      setServerChatId(null);
      
      // Save cleared session
      const session: ChatSession = {
        expertId: expert.id,
        messages: [initialMessage]
      };
      onSaveSession(session);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl h-[90vh] sm:h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <img
              src={expert.avatar}
              alt={expert.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{expert.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{expert.specialty}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearChat}
              className="p-2 hover:bg-red-50 rounded-full transition-colors group"
              title="Limpar conversa"
            >
              <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-blue-500' 
                    : 'bg-gray-200'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 sm:p-6 border-t border-gray-200">
          <div className="flex space-x-2 sm:space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="px-3 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Enviar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}