'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, Mail, Linkedin, FileText, Calendar, Compass, 
  MapPin, Clock, ArrowUpRight, Award, GraduationCap, Github 
} from 'lucide-react';
import AnimatedShader from '@/components/AnimatedShader';
import AgentChat from '@/components/AgentChat';
import ProjectShowcase from '@/components/ProjectShowcase';
import SkillsMatrix from '@/components/SkillsMatrix';

// CERTIFICATIONS DATA
const CERTIFICATIONS = [
  {
    title: "Java (Talent Scouting Academy)",
    issuer: "Digitalent Kominfo",
    date: "2024",
    desc: "Advanced object-oriented paradigms, concurrency model structures, and design pattern compliance."
  },
  {
    title: "Red Hat System Administration II",
    issuer: "Red Hat Academy",
    date: "2025",
    desc: "Network configuration, bash automation scripts, storage management, and process daemon security rules."
  },
  {
    title: "Red Hat System Administration I",
    issuer: "Red Hat Academy",
    date: "2024",
    desc: "Linux user environments, standard stream pipes, virtual environments, and permissions frameworks."
  },
  {
    title: "Introduction to Cyber Security",
    issuer: "Cisco Networking Academy",
    date: "2023",
    desc: "Cryptographic fundamentals, threat intelligence, security auditing, and sandbox security practices."
  }
];

export default function Home() {
  const [timeState, setTimeState] = useState({
    utc: '12:00:00',
    local: '12:00:00',
    wib: '12:00:00'
  });

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      
      // UTC Clock
      const utcStr = now.toUTCString().split(' ')[4];

      // Local Clock
      const localStr = now.toTimeString().split(' ')[0];

      // WIB (Jakarta - UTC+7) Clock
      const wibStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Jakarta',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      setTimeState({
        utc: utcStr,
        local: localStr,
        wib: wibStr
      });
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen text-zinc-300 overflow-hidden font-sans">
      {/* Background Animated Shader */}
      <AnimatedShader />



      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center border border-zinc-200">
              <span className="font-mono text-zinc-950 font-bold text-sm">D</span>
            </div>
            <span className="font-display font-medium tracking-tight text-zinc-100 text-sm">Dimas Edra.</span>
          </motion.div>

          {/* Clock Widgets / Specs */}
          <div className="hidden md:flex items-center space-x-6 font-mono text-[10px] text-zinc-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-ping"></span>
              <span>WIB: <span className="text-zinc-300">{timeState.wib}</span></span>
            </div>
            <div>UTC: <span className="text-zinc-300">{timeState.utc}</span></div>
            <div>LOC: <span className="text-zinc-300">{timeState.local}</span></div>
          </div>

          {/* Social CTAs */}
          <div className="flex items-center space-x-3">
            <a 
              href="https://www.linkedin.com/in/dimasedra/" 
              target="_blank" 
              rel="noreferrer"
              className="text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href="mailto:dimasedraarrafi@gmail.com"
              className="text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a 
              href="https://github.com/dimsedra" 
              target="_blank" 
              rel="noreferrer"
              className="text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-40 md:space-y-56">
        {/* HERO SECTION */}
        <section className="min-h-[75vh] flex flex-col justify-center space-y-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-zinc-900/50 border border-zinc-800 rounded-full px-3 py-1"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">
              ACTIVE AGENTIC AUTOMATION DEVELOPER
            </span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-display font-medium tracking-tight text-zinc-100 leading-[1.1]"
            >
              I build local-first AI systems and audit code integrity.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-zinc-400 font-sans leading-relaxed"
            >
              I am an undergraduate Informatics Engineering student at UIN Jakarta, and an AI native developer. I specialize in agentic architectures and application safety audits—turning ambitious software ideas into production realities that prioritize local speed and absolute user privacy.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <a 
              href="#agentic-clone"
              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-950 px-5 py-2.5 rounded-xl font-medium text-xs transition-colors cursor-pointer border border-zinc-200 shadow-md flex items-center gap-1.5"
            >
              Consult my Agent
              <Terminal className="w-3.5 h-3.5" />
            </a>
            <a 
              href="#works"
              className="bg-transparent border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/20 text-zinc-200 px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              Browse Works
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </motion.div>
        </section>

        {/* CLONE BENTO SECTION */}
        <section id="agentic-clone" className="space-y-8 scroll-mt-24">
          <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">Section 01</span>
              <h2 className="text-2xl font-display font-medium text-zinc-100">My Agentic Clone & Bio</h2>
            </div>
            <p className="text-zinc-500 text-xs font-mono max-w-sm">
              Use my custom seeded Gemini 3.5 Assistant to ask questions about my tech stack, certifications, or academic timeline in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Bio Block (5 columns) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center space-x-2 text-zinc-500">
                  <Compass className="w-4 h-4 text-zinc-400" />
                  <span className="text-[11px] font-mono uppercase tracking-widest">About Me</span>
                </div>
                
                <h3 className="text-2xl font-display font-medium text-zinc-100 leading-snug">
                  My mission is local-first privacy coupled with sovereign intelligence.
                </h3>
                
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  I believe the future of productivity belongs to hyper-customized agents that live entirely on the client, avoiding unnecessary network hops or vendor lock-in. 
                </p>
                <p className="text-zinc-400 text-xs leading-relaxed font-sans">
                  Whether solo-developing narrative tools like <strong className="text-zinc-200 font-medium">ExifSense</strong>, training deep learning classifiers like <strong className="text-zinc-200 font-medium">Gemstone</strong>, setting up relation-first architectures like <strong className="text-zinc-200 font-medium">Dialogue</strong>, or coordinating massive security audits for Agile software competitions, my goal is the same: pristine, secure, and delightful code.
                </p>
              </div>

              {/* Quick Profile Specs */}
              <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 space-y-3 font-mono text-[11px]">
                <div className="flex items-center justify-between border-b border-zinc-900/60 pb-2">
                  <span className="text-zinc-500 flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> Academy:</span>
                  <span className="text-zinc-200 text-right">UIN Syarif Hidayatullah Jakarta</span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-900/60 pb-2">
                  <span className="text-zinc-500 flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> GPA:</span>
                  <span className="text-zinc-200">3.71 / 4.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Base:</span>
                  <span className="text-zinc-200">Banten / South Tangerang, ID</span>
                </div>
              </div>
            </div>

            {/* Chat Block (7 columns) */}
            <div className="lg:col-span-7">
              <AgentChat />
            </div>
          </div>
        </section>

        {/* WORKS SECTION */}
        <section id="works" className="space-y-8 scroll-mt-24">
          <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">Section 02</span>
              <h2 className="text-2xl font-display font-medium text-zinc-100">Featured Implementations</h2>
            </div>
            <p className="text-zinc-500 text-xs font-mono max-w-sm">
              A curated collection of my core engineering, localized intelligence projects, and security research. Scroll to explore the interactive mockups.
            </p>
          </div>

          <ProjectShowcase />
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="space-y-8 scroll-mt-24">
          <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">Section 03</span>
              <h2 className="text-2xl font-display font-medium text-zinc-100">Technical Spec Sheet</h2>
            </div>
            <p className="text-zinc-500 text-xs font-mono max-w-sm">
              My engineering stack is centered around agentic systems, robust full-stack typescript layouts, and network threat modeling.
            </p>
          </div>

          <SkillsMatrix />
        </section>

        {/* TIMELINE / EDUCATION & CERTS */}
        <section id="credentials" className="space-y-8 scroll-mt-24">
          <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase">Section 04</span>
              <h2 className="text-2xl font-display font-medium text-zinc-100">Sovereign Credentials</h2>
            </div>
            <p className="text-zinc-500 text-xs font-mono max-w-sm">
              My formal education, system certifications, and institutional leadership roles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Education Timeline (5 columns) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl glow-box space-y-5">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
                    <GraduationCap className="w-4 h-4 text-zinc-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-medium text-zinc-100">Informatics Engineering</h4>
                    <span className="text-[10px] font-mono text-zinc-500">UIN Syarif Hidayatullah Jakarta</span>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-xs text-zinc-400 leading-relaxed border-t border-zinc-900/60 pt-4">
                  <p>
                    I am actively pursuing my Bachelor of Informatics Engineering with a high-fidelity academic focus on cryptography, algorithmic complexity, data structures, and secure networks.
                  </p>
                  <p className="font-mono text-[10px] text-zinc-500 flex justify-between">
                    <span>TIMELINE:</span>
                    <span className="text-zinc-300">Aug 2023 - Aug 2027 (Expected)</span>
                  </p>
                  <p className="font-mono text-[10px] text-zinc-500 flex justify-between border-t border-zinc-900/40 pt-2">
                    <span>ACADEMIC SCORE:</span>
                    <span className="text-zinc-300">GPA 3.71 / 4.00</span>
                  </p>
                </div>
              </div>

              {/* AIESEC Leadership Cards */}
              <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl glow-box space-y-4">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Institutional Leadership</span>
                
                <div className="space-y-4">
                  <div className="border-l border-zinc-800 pl-4 space-y-1">
                    <h5 className="text-xs font-display font-medium text-zinc-200">Staff of Outgoing Exchange</h5>
                    <span className="text-[9px] font-mono text-zinc-500 block">AIESEC in UIN Jakarta • Jan 2024 - Jan 2025</span>
                    <p className="text-[11px] text-zinc-400 font-sans mt-1">
                      Engaged over 50 clients interested in exchange opportunities and facilitated operations for international students.
                    </p>
                  </div>

                  <div className="border-l border-zinc-800 pl-4 space-y-1">
                    <h5 className="text-xs font-display font-medium text-zinc-200">OC Program • Youth Today</h5>
                    <span className="text-[9px] font-mono text-zinc-500 block">AIESEC in UIN Jakarta • Apr 2024 - Jul 2024</span>
                    <p className="text-[11px] text-zinc-400 font-sans mt-1">
                      Conducted thorough speaker research, secured 10+ key leadership speakers, and coordinated agendas for 100+ participants.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications grid (7 columns) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CERTIFICATIONS.map((cert) => (
                <div 
                  key={cert.title}
                  className="bg-zinc-950/40 border border-zinc-900 p-5 rounded-2xl glow-box flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                        {cert.issuer}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-600">{cert.date}</span>
                    </div>
                    <h4 className="text-sm font-display font-medium text-zinc-100 tracking-tight">
                      {cert.title}
                    </h4>
                  </div>
                  
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    {cert.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/60 backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center border border-zinc-200">
              <span className="font-mono text-zinc-950 font-bold text-xs">D</span>
            </div>
            <span className="font-mono text-[11px] text-zinc-500">
              Dimas Edra Ar Rafi • 2026-2027 • Local-first Sovereign Developer
            </span>
          </div>

          <div className="flex space-x-6 text-[11px] font-mono text-zinc-500">
            <a href="#agentic-clone" className="hover:text-zinc-200 transition-colors">Core.ai</a>
            <a href="#works" className="hover:text-zinc-200 transition-colors">Works</a>
            <a href="#skills" className="hover:text-zinc-200 transition-colors">Skills</a>
            <a href="#credentials" className="hover:text-zinc-200 transition-colors">Academic</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
