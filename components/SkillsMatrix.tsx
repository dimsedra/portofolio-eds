'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, Code, Shield, Terminal, ArrowUpRight, Zap, Check } from 'lucide-react';

interface Skill {
  name: string;
  category: 'agentic' | 'engineering' | 'cyber';
  description: string;
  tags: string[];
}

const SKILLS_DATA: Skill[] = [
  {
    name: "Agentic Coding",
    category: "agentic",
    description: "Highly proficient in AI-agent systems like Antigravity, Claude Code, and autonomous multi-agent systems to rapidly bootstrap and iterate complex software products.",
    tags: ["Antigravity", "Claude Code", "Mastra", "Autonomy"]
  },
  {
    name: "Agent Orchestration",
    category: "agentic",
    description: "Architecting server-side flows with specialized tool definitions, hybrid system setups, local-first RAG databases, and vector embeddings.",
    tags: ["Mastra", "Google GenAI", "Vector DB"]
  },
  {
    name: "Full Stack TypeScript",
    category: "engineering",
    description: "Developing robust full-stack applications with Next.js (App Router), Node.js, and typesafe REST/WebSocket APIs.",
    tags: ["TypeScript", "Next.js", "React", "Node.js"]
  },
  {
    name: "Embedded & Local Databases",
    category: "engineering",
    description: "Designing lightweight local-first database schemas, working with SQLite, Pocketbase, and high-performance querying.",
    tags: ["Pocketbase", "SQLite", "PostgreSQL", "Drizzle"]
  },
  {
    name: "Cybersecurity QA",
    category: "cyber",
    description: "Performing rigid security assessments, code audits, and simulated penetration testing to catch threat vectors (Stored XSS, CSRF, Injection).",
    tags: ["OWASP ZAP", "DOM Auditing", "Threat Modeling"]
  },
  {
    name: "Network Threat Detection",
    category: "cyber",
    description: "Understanding network routing, analyzing packets, and configuring Linux network rules to prevent threat vectors.",
    tags: ["Wireshark", "Cisco NetSec", "Nmap"]
  },
  {
    name: "Linux Systems Admin",
    category: "cyber",
    description: "Setting up server infrastructure, shell scripting, managing permissions, and establishing automated security baselines.",
    tags: ["Red Hat I & II", "Bash", "SSH/SSL"]
  },
  {
    name: "Agile PM / Sprints",
    category: "engineering",
    description: "Leading development teams under Agile methodologies, structuring sprint retrospectives, and orchestrating parallel testing pipelines.",
    tags: ["Sprint Planning", "Jira/Notion", "CI/CD Sprints"]
  }
];

export default function SkillsMatrix() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Grid selector (8 columns) */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
          <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">Interactive Skill Index</span>
          <span className="text-[10px] font-mono text-zinc-600">Select any block to expand technical logs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SKILLS_DATA.map((skill, idx) => {
            const isSelected = selectedSkill?.name === skill.name;
            const isHovered = hoveredIdx === idx;

            // Categories styling helper
            const catColors = {
              agentic: 'border-white/10 text-zinc-100',
              engineering: 'border-white/10 text-zinc-100',
              cyber: 'border-white/10 text-zinc-100'
            };

            const CatIcon = skill.category === 'agentic' ? Cpu : skill.category === 'engineering' ? Code : Shield;

            return (
              <div
                key={skill.name}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setSelectedSkill(skill)}
                className={`group p-4 rounded-xl border bg-zinc-950/40 hover:bg-zinc-900/40 cursor-pointer transition-all duration-200 relative overflow-hidden glow-box ${
                  isSelected 
                    ? 'border-zinc-300 bg-zinc-900/60 shadow-lg' 
                    : 'border-zinc-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-900 bg-zinc-950 transition-colors ${
                      isSelected ? 'border-zinc-600 bg-zinc-900' : 'group-hover:border-zinc-800'
                    }`}>
                      <CatIcon className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-display font-medium text-zinc-100 tracking-tight group-hover:text-white transition-colors">
                        {skill.name}
                      </h4>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        {skill.category === 'agentic' ? 'Agentic Core' : skill.category === 'engineering' ? 'Engineering' : 'SecOps'}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <p className="text-[11px] text-zinc-400 mt-2.5 font-sans leading-relaxed line-clamp-2">
                  {skill.description}
                </p>

                {/* Micro tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {skill.tags.map(t => (
                    <span key={t} className="text-[9px] font-mono bg-zinc-900/80 border border-zinc-900 rounded px-1.5 py-0.5 text-zinc-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details visualizer panel (4 columns) */}
      <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex flex-col justify-between glow-box min-h-[300px]">
        {selectedSkill ? (
          <div className="space-y-5 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-zinc-400 border-b border-zinc-900 pb-3">
                <Terminal className="w-4 h-4" />
                <span className="text-[11px] font-mono uppercase tracking-widest">Technical Specifications</span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">NAME</span>
                <h4 className="text-lg font-display font-medium text-zinc-100">{selectedSkill.name}</h4>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">CLASSIFICATION</span>
                <p className="text-xs font-mono text-zinc-300 capitalize">
                  {selectedSkill.category === 'agentic' ? 'Agentic Systems & Neural Tooling' : selectedSkill.category === 'engineering' ? 'Full Stack Software Architecture' : 'Offensive/Defensive Threat Operations'}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">PRACTICAL APPLICATION</span>
                <p className="text-xs font-sans text-zinc-400 leading-relaxed mt-1">
                  {selectedSkill.description}
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-4 mt-4">
              <div className="flex flex-wrap gap-1.5">
                {selectedSkill.tags.map(t => (
                  <span key={t} className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-zinc-300 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full space-y-3 py-10">
            <Cpu className="w-10 h-10 text-zinc-700 stroke-1 animate-pulse" />
            <div className="space-y-1">
              <h5 className="text-xs font-mono text-zinc-400">Spec Sheet Empty</h5>
              <p className="text-[11px] text-zinc-500 max-w-[200px] leading-relaxed">
                Click on any specialized skill card to generate raw technical data and logs.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
