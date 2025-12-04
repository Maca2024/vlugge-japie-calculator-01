import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToJapie } from '../services/geminiService';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose, projectName }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hoi! Ik heb ${projectName} volledig geanalyseerd. Vraag me alles over maten, materialen of zaaglijsten.`, timestamp: Date.now() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const stream = await sendMessageToJapie(userMsg.text);
      let fullResponse = "";
      
      // Add placeholder for streaming message
      const botMsgId = Date.now();
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: botMsgId }]);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => 
          prev.map(msg => msg.timestamp === botMsgId ? { ...msg, text: fullResponse } : msg)
        );
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, mijn verbinding met de werkplaats is even verbroken. Probeer het opnieuw.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full md:w-[450px] bg-[#1a1a1a] border-l border-white/10 h-full flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-brand-black">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div>
            <div>
              <h3 className="font-bold text-white">JAPIE LIVE</h3>
              <p className="text-[10px] text-brand-accent uppercase tracking-widest">Quantum Analysis Active</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'model' ? 'bg-brand-accent text-white' : 'bg-white/10 text-gray-300'}`}>
                {msg.role === 'model' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'model' 
                  ? 'bg-white/5 text-gray-200 rounded-tl-none border border-white/5' 
                  : 'bg-brand-accent text-white rounded-tr-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center h-10">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
             </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-brand-black border-t border-white/10">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Vraag Japie over dit project..."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-white focus:outline-none focus:border-brand-accent/50 focus:bg-white/10 transition-all placeholder:text-gray-600"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-2 top-2 p-1.5 bg-brand-accent text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-brand-accent transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
