"use client";
import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  Send, Bot, User, Sparkles, Copy, Check, Trash2, 
  StopCircle, Plus, MessageSquare, Menu, X as CloseIcon, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { AuthContext } from '../components/AuthProvider';

// ─────────────────────────────────────────────────────────────────────────────
// Renders a message with inline markdown / code blocks
// ─────────────────────────────────────────────────────────────────────────────
function MessageRenderer({ text }) {
  if (!text) return null;
  const parts = String(text).split(/(```[\s\S]*?```)/g);
  return (
    <div className="text-[15px] leading-relaxed" style={{ wordBreak: 'break-word' }}>
      {parts.map((part, i) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const inner = part.slice(3, -3);
          const firstNewline = inner.indexOf('\n');
          const lang = firstNewline > -1 ? inner.slice(0, firstNewline).trim() : '';
          const code = firstNewline > -1 ? inner.slice(firstNewline + 1) : inner;
          return <CodeBlock key={i} code={code} lang={lang} />;
        }
        return <span key={i} className="whitespace-pre-wrap">{part}</span>;
      })}
    </div>
  );
}

function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-border bg-[#0d1117]">
      <div className="flex justify-between items-center px-4 py-2 bg-[#161b22] border-b border-white/5">
        <span className="text-xs font-mono text-muted-foreground capitalize">{lang || 'code'}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <><Check size={13} className="text-green-500" /> Copied!</> : <><Copy size={13} /> Copy</>}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] font-mono scrollbar-hide text-[#e6edf3] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHATBOT COMPONENT (Fully Integrated Board)
// ─────────────────────────────────────────────────────────────────────────────
export default function Chatbot() {
  const { user, token, isLoaded } = useContext(AuthContext);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('ngp_chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [{ id: '1', title: 'New Chat', messages: [{ role: 'ai', text: "Hello 👋 I am nextGenPrep AI. Ask me anything." }] }];
  });

  const [activeId, setActiveId] = useState(() => sessions[0]?.id || '1');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window !== 'undefined' && window.innerWidth > 1024));
  
  const messagesRef = useRef(null);
  const textareaRef = useRef(null);

  const activeSession = sessions.find(s => s.id === activeId) || sessions[0];

  useEffect(() => {
    // FIX: Manual container scroll prevents window jumping
    if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
    localStorage.setItem('ngp_chat_sessions', JSON.stringify(sessions));
  }, [sessions, isTyping, activeId]);

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + 'px';
  };

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newSession = {
      id: newId,
      title: 'New Chat',
      messages: [{ role: 'ai', text: "Hello 👋 I am nextGenPrep AI. Ask me anything." }]
    };
    setSessions([newSession, ...sessions]);
    setActiveId(newId);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    if (newSessions.length === 0) {
      const reset = [{ id: '1', title: 'New Chat', messages: [{ role: 'ai', text: "Hello 👋 I am nextGenPrep AI. Ask me anything." }] }];
      setSessions(reset);
      setActiveId('1');
    } else {
      setSessions(newSessions);
      if (activeId === id) setActiveId(newSessions[0].id);
    }
  };

  const sendMessage = async () => {
    const userMsg = input.trim();
    if (!userMsg || isTyping) return;

    let updatedSessions = sessions.map(s => {
      if (s.id === activeId) {
        const isFirstUserMsg = s.messages.length <= 1;
        return {
          ...s,
          title: isFirstUserMsg ? (userMsg.length > 25 ? userMsg.substring(0, 25) + '...' : userMsg) : s.title,
          messages: [...s.messages, { role: 'user', text: userMsg }]
        };
      }
      return s;
    });
    setSessions(updatedSessions);
    setInput('');
    setIsTyping(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setSessions(prev => prev.map(s => 
        s.id === activeId ? { ...s, messages: [...s.messages, { role: 'ai', text: data.reply }] } : s
      ));
    } catch (err) {
      setSessions(prev => prev.map(s => 
        s.id === activeId ? { ...s, messages: [...s.messages, { role: 'ai', text: "⚠️ Error connecting to server." }] } : s
      ));
    }
    setIsTyping(false);
    setTimeout(() => textareaRef.current?.focus(), 10);
  };

  const isSessionEmpty = activeSession.messages.length <= 1 && activeSession.messages[0].role === 'ai';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* ─── CHAT INTERFACE BOARD ─── */}
      <div className="flex bg-card border border-border rounded-[2rem] overflow-hidden shadow-2xl h-[750px] relative">
        
        {/* 1. SIDEBAR (Internal Scroll) */}
        <aside 
          className={`shrink-0 absolute lg:relative inset-y-0 left-0 z-50 w-72 bg-[#020617] lg:bg-card border-r border-border transition-all duration-300 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:w-0 lg:opacity-0 overflow-hidden border-none'}`}
        >
          <div className="p-5 shrink-0">
            <button onClick={createNewChat} className="flex items-center justify-center gap-3 w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 group">
              <Plus size={18} /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 space-y-1 py-4 scrollbar-hide border-t border-border/10">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 opacity-40">Previous History</p>
            {sessions.map(s => (
              <div 
                key={s.id} 
                onClick={() => { setActiveId(s.id); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                className={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all ${activeId === s.id ? 'bg-secondary ring-1 ring-border shadow-md' : 'hover:bg-secondary/40'}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare size={16} className={`shrink-0 ${activeId === s.id ? 'text-primary' : 'text-muted-foreground/50'}`} />
                  <span className={`text-[13.5px] font-medium truncate ${activeId === s.id ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</span>
                </div>
                <button onClick={(e) => deleteSession(s.id, e)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
          <div className="p-6 mt-auto border-t border-border bg-secondary/10 shrink-0">
             <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/50">
               <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm">
                 {user?.name?.charAt(0) || 'U'}
               </div>
               <div>
                  <p className="text-[13px] font-black text-foreground truncate max-w-[120px]">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-primary font-black uppercase tracking-tighter">nextGenPrep</p>
               </div>
             </div>
          </div>
        </aside>

        {/* 2. MAIN CONVERSATION AREA */}
        <main className="flex-1 flex flex-col min-w-0 bg-background/40 relative">
          
          <header className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-md shrink-0 z-40">
             <div className="flex items-center gap-3">
               <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 text-primary active:scale-90 transition-transform"><Menu size={24} /></button>
               <div>
                  <h2 className="font-extrabold text-[17px] tracking-tight">nextGenPrep AI</h2>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">System Online</span></div>
               </div>
             </div>
             <div className="flex gap-2">
                <button onClick={createNewChat} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"><Plus size={18}/></button>
             </div>
          </header>

          {/* Chat Messages */}
          <div ref={messagesRef} className="flex-1 overflow-y-auto w-full scroll-smooth scrollbar-hide px-4 sm:px-8 lg:px-12 py-10">
            <div className={`w-full max-w-3xl mx-auto flex flex-col ${isSessionEmpty ? 'h-full justify-center items-center text-center pb-10' : 'gap-10 pb-20'}`}>
              
              {isSessionEmpty && (
                <div className="flex flex-col items-center animation-fade-in -mt-10">
                  <div className="w-20 h-20 rounded-[2.2rem] bg-secondary border border-border flex items-center justify-center mb-10 shadow-2xl ring-8 ring-primary/5">
                     <Sparkles size={40} className="text-primary animate-pulse" />
                  </div>
                  <h1 className="text-4xl font-black mb-4">Hello 👋 I am nextGenPrep AI.</h1>
                  <p className="text-xl text-muted-foreground font-bold opacity-80">Ready to assist your learning journey.</p>
                </div>
              )}

              {!isSessionEmpty && activeSession.messages.map((msg, i) => (
                <div key={i} className={`flex gap-5 w-full ${msg.role === 'user' ? 'justify-end animation-slide-up' : 'justify-start animation-fade-in'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-10 h-10 rounded-2xl bg-secondary border border-border flex items-center justify-center text-primary mt-1 shadow-sm shrink-0">
                      <Bot size={22} />
                    </div>
                  )}
                  <div className={`max-w-[85%] px-5 py-4 rounded-[1.8rem] shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm shadow-primary-glow' : 'bg-card text-foreground border border-border rounded-tl-sm'}`}>
                    {msg.role === 'ai' ? <MessageRenderer text={msg.text} /> : <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                  <div className="flex gap-5 justify-start animation-fade-in">
                    <div className="w-10 h-10 rounded-2xl bg-secondary border border-border flex items-center justify-center text-primary shrink-0 shadow-sm"><Bot size={22} /></div>
                    <div className="bg-card px-6 py-4 rounded-[1.5rem] border border-border flex items-center gap-2 opacity-60">
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-duration:0.6s]" />
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* 3. INPUT AREA */}
          <section className="shrink-0 w-full bg-background/60 backdrop-blur-md border-t border-border p-4 sm:p-7">
            <div className="max-w-3xl mx-auto flex flex-col items-center">
              <div className={`w-full relative flex items-end gap-3 bg-secondary/50 border border-border rounded-2xl p-2.5 shadow-sm transition-all focus-within:bg-secondary focus-within:border-primary/40 ${isTyping ? 'opacity-50' : ''}`}>
                 <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-[15px] resize-none max-h-40 font-medium no-scrollbar"
                  rows={1}
                  disabled={isTyping}
                />
                <button 
                  onClick={() => sendMessage()} 
                  disabled={isTyping || !input.trim()}
                  className="mb-1 w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-30 transition-transform"
                >
                  <Send size={20} fill="currentColor" className="ml-0.5" />
                </button>
              </div>
              <p className="mt-3 text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">NextGenPrep AI | Developed by Vikash Anand</p>
            </div>
          </section>

        </main>
      </div>

    </div>
  );
}
