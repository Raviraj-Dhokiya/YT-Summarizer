import { useState, useRef, useEffect } from 'react';
import { chatWithVideoApi } from '../api';

const BotIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <line x1="9" y1="10" x2="9" y2="10" strokeWidth="3"/>
    <line x1="12" y1="10" x2="12" y2="10" strokeWidth="3"/>
    <line x1="15" y1="10" x2="15" y2="10" strokeWidth="3"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5Z"/>
  </svg>
);

export default function ChatBot({ videoId, videoTitle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: `👋 Hi! I've analyzed this video. Ask me anything about "${videoTitle}" and I'll answer based on its content!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = updatedMessages
        .slice(1)
        .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));

      const res = await chatWithVideoApi(videoId, trimmed, chatHistory.slice(0, -1));
      const answer = res.data.answer || 'Sorry, I could not get a response.';
      setMessages((prev) => [...prev, { role: 'bot', content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: '❌ Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const SUGGESTED = ['What is this video about?', 'Key takeaways?', 'Who is the speaker?'];

  return (
    <>
      {/* Floating Chat Button — fixed bottom-right */}
      <button
        id="chatbot-toggle-btn"
        onClick={() => setIsOpen((p) => !p)}
        title="Chat with AI about this video"
        className={`
          fixed bottom-6 right-6 z-[1000]
          w-[54px] h-[54px]
          flex items-center justify-center
          rounded-full shadow-lg
          transition-all duration-300 ease-out
          ${isOpen
            ? 'bg-[#2563eb] dark:bg-[#60a5fa] text-white scale-95'
            : 'bg-[#2563eb] dark:bg-[#60a5fa] text-white hover:scale-110 hover:shadow-xl hover:shadow-blue-500/30'
          }
        `}
      >
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
          {isOpen ? <CloseIcon /> : <BotIcon />}
        </span>
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#2563eb] dark:bg-[#60a5fa] animate-ping opacity-25" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`
          fixed bottom-[78px] right-6 z-[999]
          w-[360px] max-h-[520px]
          bg-white dark:bg-[#1a1a1a]
          border border-[#e0e0e0] dark:border-[#2e2e2e]
          rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40
          flex flex-col overflow-hidden
          transition-all duration-300 ease-out origin-bottom-right
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="
          flex items-center gap-2.5 px-4 py-3
          border-b border-[#e0e0e0] dark:border-[#2e2e2e]
          bg-[#f8f8f8] dark:bg-[#242424]
        ">
          <div className="w-8 h-8 rounded-full bg-[#2563eb]/10 dark:bg-[#60a5fa]/10 flex items-center justify-center text-[#2563eb] dark:text-[#60a5fa]">
            <BotIcon />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#111] dark:text-[#f0f0f0]">Video AI Assistant</p>
            <p className="text-[11px] text-[#999] dark:text-[#555] truncate">Asking about: {videoTitle}</p>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-green-600 dark:text-[#34d058] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-[#34d058]" />
            Online
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 scroll-smooth" style={{ maxHeight: 320 }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-[#2563eb]/10 dark:bg-[#60a5fa]/10 flex items-center justify-center flex-shrink-0 mt-1 mr-2 text-[#2563eb] dark:text-[#60a5fa]">
                  <SparkleIcon />
                </div>
              )}
              <div className={`
                max-w-[82%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-[#2563eb] dark:bg-[#60a5fa] text-white rounded-br-sm'
                  : 'bg-[#f0f0f0] dark:bg-[#2a2a2a] text-[#111] dark:text-[#f0f0f0] rounded-bl-sm'
                }
              `}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-6 h-6 rounded-full bg-[#2563eb]/10 dark:bg-[#60a5fa]/10 flex items-center justify-center flex-shrink-0 mt-1 mr-2 text-[#2563eb] dark:text-[#60a5fa]">
                <SparkleIcon />
              </div>
              <div className="bg-[#f0f0f0] dark:bg-[#2a2a2a] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#999] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#999] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#999] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {SUGGESTED.map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); inputRef.current?.focus(); }}
                className="
                  text-[11px] px-2.5 py-1 rounded-full
                  bg-[#f0f0f0] dark:bg-[#242424]
                  border border-[#e0e0e0] dark:border-[#2e2e2e]
                  text-[#555] dark:text-[#909090]
                  hover:border-[#2563eb] dark:hover:border-[#60a5fa]
                  hover:text-[#2563eb] dark:hover:text-[#60a5fa]
                  transition-colors cursor-pointer
                "
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 px-3 py-3 border-t border-[#e0e0e0] dark:border-[#2e2e2e] bg-[#fafafa] dark:bg-[#1a1a1a]">
          <input
            ref={inputRef}
            id="chatbot-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this video..."
            disabled={loading}
            className="
              flex-1 bg-[#f0f0f0] dark:bg-[#242424]
              border border-[#e0e0e0] dark:border-[#2e2e2e]
              rounded-xl px-3 py-2
              text-[13px] text-[#111] dark:text-[#f0f0f0]
              placeholder-[#999] dark:placeholder-[#555]
              outline-none
              focus:border-[#2563eb] dark:focus:border-[#60a5fa]
              transition-colors disabled:opacity-50
            "
          />
          <button
            id="chatbot-send-btn"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="
              w-9 h-9 rounded-xl flex-shrink-0
              bg-[#2563eb] dark:bg-[#60a5fa] text-white
              flex items-center justify-center
              hover:opacity-85 transition-opacity
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </>
  );
}
