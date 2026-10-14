import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ArrowDownCircle } from 'lucide-react';

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookGenius: () => void;
  onRequestCall: () => void;
}

interface Message {
  id: string;
  sender: 'specialist' | 'user';
  text: string;
  timestamp: string;
}

export const LiveChatModal: React.FC<LiveChatModalProps> = ({
  isOpen,
  onClose,
  onBookGenius,
  onRequestCall,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'specialist',
      text: 'Hello! Thanks for reaching out to Apple Support. My name is Sarah. How can I assist you with your Apple devices or services today?',
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Check iPhone Battery Health',
    'Reset Apple ID Password',
    'Check AppleCare+ Status',
    'Trade In My Device',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Simulate smart Apple Specialist reply
    setTimeout(() => {
      let replyText = "I understand. Let me help you troubleshoot that right away. You can also run our remote hardware diagnostic directly through Settings > General > Diagnostics.";
      
      const lower = text.toLowerCase();
      if (lower.includes('battery')) {
        replyText = "For battery performance, check Settings > Battery > Battery Health & Charging. If Maximum Capacity is below 80%, our Genius Bar can replace it under AppleCare+ or out-of-warranty service.";
      } else if (lower.includes('password') || lower.includes('apple id')) {
        replyText = "To securely reset your Apple ID password, visit iforgot.apple.com on any browser, or open Settings > [Your Name] > Sign-In & Security on a trusted Apple device.";
      } else if (lower.includes('applecare')) {
        replyText = "You can view your exact AppleCare+ expiration date and claim history at mysupport.apple.com by signing in with your Apple ID.";
      } else if (lower.includes('trade')) {
        replyText = "Apple Trade In gives you credit toward a new device or an Apple Gift Card. You can get an instant estimate online or visit any Apple Store!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `spec-${Date.now()}`,
          sender: 'specialist',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-black/[0.08] flex flex-col h-[580px] overflow-hidden">
        {/* Apple Messages Style Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200/80 bg-zinc-50/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-medium flex items-center justify-center text-sm">
                
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900 flex items-center gap-1.5">
                <span>Apple Support</span>
                <span className="text-[11px] font-normal text-zinc-500">· Messages</span>
              </div>
              <div className="text-xs text-zinc-500">Specialist Sarah · Online</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-200/60 transition-colors cursor-pointer"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action ribbon */}
        <div className="px-4 py-1.5 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between text-xs text-[#0071e3]">
          <span className="font-medium">Need immediate hands-on service?</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onBookGenius();
              }}
              className="hover:underline font-medium cursor-pointer"
            >
              Book Genius Bar
            </button>
            <span className="text-zinc-300">|</span>
            <button
              onClick={() => {
                onClose();
                onRequestCall();
              }}
              className="hover:underline font-medium cursor-pointer"
            >
              Request Call
            </button>
          </div>
        </div>

        {/* Message stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f5f5f7]/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0071e3] text-white rounded-br-xs'
                    : 'bg-white text-zinc-900 border border-zinc-200/70 shadow-xs rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 bg-white border border-zinc-200/70 px-3.5 py-2 rounded-2xl w-fit shadow-xs">
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-3 py-2 bg-white border-t border-zinc-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message to Apple Specialist..."
            className="flex-1 text-sm bg-zinc-100 px-3.5 py-2 rounded-full border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-40 text-white rounded-full transition-colors cursor-pointer shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
