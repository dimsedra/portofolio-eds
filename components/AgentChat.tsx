'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Terminal, User, Cpu, ArrowUpRight } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PRESETS = [
  { label: "Dialogue Architecture", prompt: "How did you design and build Dialogue? What was the tech stack?" },
  { label: "Agentic Coding Philosophy", prompt: "Explain your view on Agentic Coding and what tools you use." },
  { label: "Cybersecurity Audits", prompt: "Tell me about your Security QA experience and how you audit for vulnerabilities." },
];

export default function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello, I am the Agentic Clone of Dimas. I represent his projects, academic background, and technical philosophy in real-time. Ask me anything about my work on local-first AI, secure SDLC, or how I turn ideas into code."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the bottom of the message feed
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    if (!textToSend) setInput('');

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("Failed to communicate with agent.");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "System alert: Connection to the agent was disrupted. Please try again in a moment."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950/60 backdrop-blur-md rounded-2xl border border-zinc-800/80 shadow-2xl overflow-hidden flex flex-col h-[520px] glow-box">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-zinc-950 animate-pulse"></span>
            <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <Cpu className="w-5 h-5 text-zinc-300" />
            </div>
          </div>
          <div>
            <h3 className="font-display text-sm font-medium tracking-tight text-zinc-100 flex items-center gap-1.5">
              Dimas.ai
              <span className="text-[10px] font-mono text-zinc-500 font-normal bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700/50">
                ACTIVE
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400 font-mono">Agentic Core v1.2</p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-800"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-800"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-800"></span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2.5 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 border text-[10px] font-mono ${
                  m.role === 'user' 
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-200' 
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                }`}>
                  {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Terminal className="w-3.5 h-3.5" />}
                </div>

                <div className={`rounded-xl px-4 py-2.5 text-[13px] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-zinc-100 text-zinc-950 font-normal'
                    : 'bg-zinc-900/60 text-zinc-300 border border-zinc-800/80 font-normal prose prose-invert prose-xs'
                }`}>
                  {m.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? "mt-1.5" : ""}>{line}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono flex items-center justify-center shrink-0 text-zinc-400">
                  <Terminal className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="rounded-xl px-4 py-2.5 bg-zinc-900/30 text-zinc-500 text-[13px] font-mono flex items-center gap-1.5 border border-zinc-800/40">
                  Thinking
                  <span className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Preset Buttons */}
      <div className="px-5 py-2.5 border-t border-zinc-900/80 bg-zinc-950/40 flex flex-wrap gap-2">
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSend(p.prompt)}
            className="text-[11px] font-mono border border-zinc-800/80 rounded-md px-2.5 py-1 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/80 transition-all cursor-pointer flex items-center gap-1"
          >
            {p.label}
            <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
          </button>
        ))}
      </div>

      {/* Footer Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 border-t border-zinc-900 bg-zinc-950 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about my projects, research or skills..."
          disabled={isLoading}
          className="flex-1 bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 disabled:opacity-50 transition-all font-sans"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-950 hover:bg-zinc-200 disabled:opacity-40 disabled:hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-zinc-200"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
