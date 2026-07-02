'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, Code, Database, ShieldAlert, Cpu, HardDrive, 
  Layers, ChevronRight, FileImage, Info, Terminal, Settings, CheckCircle,
  Github, Globe
} from 'lucide-react';

// EXIFSENSE SAMPLES
const EXIF_SAMPLES = [
  {
    name: "Golden Hour Horizon",
    fileName: "golden_hour_092.jpg",
    tags: {
      Make: "Sony",
      Model: "ILCE-7M4 (Alpha 7 IV)",
      Lens: "FE 24-70mm F2.8 GM II",
      ShutterSpeed: "1/800s",
      Aperture: "f/4.0",
      ISO: "100",
      ExposureBias: "-0.3 EV",
      FocalLength: "35mm",
      DateTime: "2026:06:14 17:42:19",
      GPS: "-8.409518, 115.188919 (Bali, Indonesia)"
    },
    narrative: "Shot on a modern full-frame Sony mirrorless with a premium G-Master lens. The shutter was set fast at 1/800s to freeze the shifting light rays. A low ISO of 100 preserves absolute clarity with zero grain. The slight negative exposure compensation (-0.3 EV) ensures the delicate high-dynamic-range sunset highlights aren't blown out, locking in the rich amber sky tones."
  },
  {
    name: "Cyberpunk Alleyway",
    fileName: "tokyo_rain_neon.png",
    tags: {
      Make: "Fujifilm",
      Model: "X-T5",
      Lens: "XF 33mm F1.4 R LM WR",
      ShutterSpeed: "1/125s",
      Aperture: "f/1.4",
      ISO: "1600",
      ExposureBias: "0.0 EV",
      FocalLength: "33mm (50mm equiv.)",
      DateTime: "2026:05:28 21:15:02",
      GPS: "35.6895, 139.6917 (Shinjuku, Tokyo)"
    },
    narrative: "Captured in low light on an APS-C Fujifilm body. By opening the lens wide to its maximum aperture of f/1.4, I maximized light gathering to create an ultra-shallow depth of field. The background neon signs dissolve into silky, circular bokeh. Raising the ISO to 1600 allows for a hand-held shutter speed of 1/125s to avoid blur, while Fujifilm's X-Trans sensor resolves the grain into a gorgeous, film-like texture."
  },
  {
    name: "Editorial Studio Portrait",
    fileName: "editorial_studio_05.jpg",
    tags: {
      Make: "Canon",
      Model: "EOS R5",
      Lens: "RF 85mm F1.2 L USM",
      ShutterSpeed: "1/200s",
      Aperture: "f/2.0",
      ISO: "50",
      ExposureBias: "0.0 EV",
      FocalLength: "85mm",
      DateTime: "2026:04:10 14:30:55",
      GPS: "No GPS Tag (Studio)"
    },
    narrative: "Designed for pristine detail. Shot at Canon's native low ISO of 50 to maximize dynamic range and structural integrity. Using an legendary 85mm focal length compresses facial features beautifully, while the f/2.0 aperture isolates the eyes with extreme sharpness before smoothly blending away into the background. The 1/200s shutter speed is perfectly synchronized with studio strobe triggers."
  }
];

// DIALOGUE AGENT SIMULATOR CHATS
const SIMULATED_PROMPTS = [
  {
    prompt: "Prepare an outline for my informatics thesis on secure SDLC.",
    steps: [
      { component: "Next.js UI", action: "Captures request and renders active thread node." },
      { component: "Mastra Agent Orchestrator", action: "Instantiates thesis-advisor agent, retrieves agent tools, and calls LLM via Vercel AI SDK." },
      { component: "Pocketbase (SQLite)", action: "Queries vector/text memory schema to fetch previous thesis context notes." },
      { component: "Local File System", action: "Scans active workspace documents for academic drafts in real-time." }
    ],
    agentOutput: "I've structured a 4-phase thesis outline on Secure SDLC. I've also cross-referenced your local draft in '~/workspace/drafts/' to include your specific research on OWASP ZAP and CSRF protection!"
  },
  {
    prompt: "Remind me what I discussed with my team lead yesterday.",
    steps: [
      { component: "Next.js UI", action: "Launches historical memory query stream." },
      { component: "Mastra Agent Orchestrator", action: "Fuses query with user relationship vector index." },
      { component: "Pocketbase (SQLite)", action: "Fetches conversation log entries matching 'yesterday' and 'team lead'." },
      { component: "Local File System", action: "Analyzes markdown daily-notes for date 2026-06-30." }
    ],
    agentOutput: "Yesterday at 15:30, you discussed establishing parallel testing routines in the Cyber Security project. Your lead suggested using automated regression tests before the final security audits."
  }
];

// GEMSTONE CLASSIFIER SAMPLES
const GEMSTONE_SAMPLES = [
  {
    name: "Ametrine",
    color: { start: "#a855f7", end: "#f59e0b" },
    shape: "M 50 15 L 85 35 L 85 65 L 50 85 L 15 65 L 15 35 Z",
    confidence: 0.984,
    alternatives: [
      { name: "Amethyst", conf: 0.012 },
      { name: "Citrine", conf: 0.004 }
    ],
    info: "Combination of Amethyst and Citrine with distinct purple and yellow zones. High classification confidence due to unique visual color banding."
  },
  {
    name: "Blue Lace Agate",
    color: { start: "#93c5fd", end: "#60a5fa" },
    shape: "M 50 15 C 80 15 90 45 75 75 C 60 90 40 90 25 75 C 10 45 20 15 50 15 Z",
    confidence: 0.952,
    alternatives: [
      { name: "Chalcedony", conf: 0.038 },
      { name: "Aquamarine", conf: 0.010 }
    ],
    info: "Characterized by delicate, light blue and white banding. ResNet50 correctly recognizes the repeating linear pattern texture."
  },
  {
    name: "Ruby",
    color: { start: "#ef4444", end: "#9f1239" },
    shape: "M 50 15 L 80 40 L 70 85 L 30 85 L 20 40 Z",
    confidence: 0.916,
    alternatives: [
      { name: "Garnet Red", conf: 0.054 },
      { name: "Spinel", conf: 0.022 }
    ],
    info: "Deep red corundum. Classifier distinguishes this from Garnet based on saturation and specific surface luster cues."
  }
];

export default function ProjectShowcase() {
  const [activeTab, setActiveTab] = useState<'dialogue' | 'exifsense' | 'gemstone' | 'security'>('dialogue');

  // ExifSense State
  const [selectedExifIdx, setSelectedExifIdx] = useState(0);

  // Gemstone State
  const [selectedGemIdx, setSelectedGemIdx] = useState(0);

  // Dialogue Simulator State
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const triggerDialogueSimulation = (idx: number) => {
    if (isSimulating) return;
    setSelectedPromptIdx(idx);
    setIsSimulating(true);
    setSimStep(0);

    const interval = setInterval(() => {
      setSimStep((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          setIsSimulating(false);
          return 3;
        }
        return prev + 1;
      });
    }, 1000);
  };

  return (
    <div className="space-y-10">
      {/* Project Selection Tabs */}
      <div className="flex border-b border-zinc-900 overflow-x-auto pb-px">
        {[
          { id: 'dialogue', label: 'Dialogue', subtitle: 'AI Companion' },
          { id: 'exifsense', label: 'ExifSense', subtitle: 'Metadata NLP' },
          { id: 'gemstone', label: 'Gemstone', subtitle: 'Transfer Learning' },
          { id: 'security', label: 'Security QA', subtitle: 'Audit Lead' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSelectedPromptIdx(null);
              setIsSimulating(false);
            }}
            className={`flex-1 min-w-[120px] text-left px-5 py-4 border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-zinc-100 bg-zinc-900/40 text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/10'
            }`}
          >
            <span className="block text-xs font-mono font-medium tracking-widest text-zinc-500 uppercase">
              {tab.subtitle}
            </span>
            <span className="block text-base font-display font-medium mt-1">
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* LEFT SIDE: PROJECT SUMMARY (4 columns) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-100 animate-pulse"></span>
                <span className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
                  {activeTab === 'dialogue' ? 'LOCAL-FIRST COMPANION' : activeTab === 'exifsense' ? 'METADATA NLP' : activeTab === 'gemstone' ? 'TRANSFER LEARNING' : 'SECURE SDLC'}
                </span>
              </div>

              <h3 className="text-3xl font-display font-medium tracking-tight text-zinc-50">
                {activeTab === 'dialogue' && 'Dialogue: Fully Local Intelligence'}
                {activeTab === 'exifsense' && 'ExifSense: Narrative Exif Extractor'}
                {activeTab === 'gemstone' && 'Gemstone: ResNet50 Classifier'}
                {activeTab === 'security' && 'Architecting Zero-Trust Platforms'}
              </h3>

              <p className="text-zinc-400 text-sm leading-relaxed font-sans">
                {activeTab === 'dialogue' && 
                  "Inspired by agents like OpenClaw and Hermes, I wanted an AI assistant that actually knows and remembers me without selling my data or requiring cloud servers. Dialogue runs entirely locally on my machine. It integrates deep memory retention and structured workflows so productivity feels like an intuitive, organic relationship instead of a digital chore."
                }
                {activeTab === 'exifsense' && 
                  "ExifSense is my solo-developed local utility. I built it to solve a major pain point: camera metadata tags (EXIF) are highly technical and confusing to the general public. ExifSense parses standard image files and employs rule-based narrative intelligence to translate raw settings (like ISO, aperture, focal length) into beautiful, educational, natural-language photographic stories."
                }
                {activeTab === 'gemstone' && 
                  "I developed a local computer vision classification system capable of identifying 87 distinct gemstone classes. Using transfer learning with a pre-trained ResNet50 backbone and a custom classification head, I trained the model on 5,900+ augmented images. The system features a FastAPI backend, thread-safe lazy-loading, and a real-time web dashboard."
                }
                {activeTab === 'security' && 
                  "In our main University project, I acted as Project Manager & Security QA. I led a 30-member cross-functional team in establishing a secure web application. I structured an end-to-end Secure SDLC (Software Development Life Cycle), integrating threat modeling and parallel testing early in our cycles to prevent vulnerabilities rather than patching them later."
                }
              </p>

              {/* Technologies */}
              <div className="pt-2">
                <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">Core Stack</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeTab === 'dialogue' && ['Next.js', 'Pocketbase (Go/SQLite)', 'Mastra SDK', 'Vercel AI SDK', 'Tailwind'].map(t => (
                    <span key={t} className="text-[11px] font-mono bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-zinc-300">{t}</span>
                  ))}
                  {activeTab === 'exifsense' && ['Vanilla JS', 'HTML5/CSS3', 'i18n Engine', 'EXIF Parser'].map(t => (
                    <span key={t} className="text-[11px] font-mono bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-zinc-300">{t}</span>
                  ))}
                  {activeTab === 'gemstone' && ['PyTorch', 'ResNet50', 'FastAPI', 'Roboflow', 'Pillow'].map(t => (
                    <span key={t} className="text-[11px] font-mono bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-zinc-300">{t}</span>
                  ))}
                  {activeTab === 'security' && ['OWASP ZAP', 'Agile/Sprints', 'Parallel Testing', 'Secure SDLC', 'DOM Threat Auditing'].map(t => (
                    <span key={t} className="text-[11px] font-mono bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-zinc-300">{t}</span>
                  ))}
                </div>
              </div>

              {/* Project Links */}
              {(activeTab === 'dialogue' || activeTab === 'exifsense' || activeTab === 'gemstone') && (
                <div className="pt-4 flex items-center gap-4 border-t border-zinc-900/60 mt-2">
                  {activeTab === 'dialogue' && (
                    <a 
                      href="https://github.com/dimsedra/dialogue-ai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors font-mono group"
                    >
                      <Github className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                      <span>Repository</span>
                      <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </a>
                  )}
                  {activeTab === 'exifsense' && (
                    <>
                      <a 
                        href="https://github.com/dimsedra/ExifSense" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors font-mono group"
                      >
                        <Github className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                        <span>Repository</span>
                        <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </a>
                      <a 
                        href="https://exif-sense.vercel.app/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors font-mono group"
                      >
                        <Globe className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                        <span>Live Demo</span>
                        <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </a>
                    </>
                  )}
                  {activeTab === 'gemstone' && (
                    <a 
                      href="https://github.com/dimsedra/Gemstone" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-zinc-100 transition-colors font-mono group"
                    >
                      <Github className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                      <span>Repository</span>
                      <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="border-t border-zinc-900 pt-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                {activeTab === 'dialogue' && (
                  <>
                    <div>
                      <span className="block text-2xl font-mono text-zinc-100 font-medium">250+</span>
                      <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Git Commits</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-mono text-zinc-100 font-medium">100%</span>
                      <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Local & Sandbox</span>
                    </div>
                  </>
                )}
                {activeTab === 'exifsense' && (
                  <>
                    <div>
                      <span className="block text-2xl font-mono text-zinc-100 font-medium">15+</span>
                      <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Narrative Rules</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-mono text-zinc-100 font-medium">3 languages</span>
                      <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">i18n (EN, ID, AR)</span>
                    </div>
                  </>
                )}
                {activeTab === 'gemstone' && (
                  <>
                    <div>
                      <span className="block text-2xl font-mono text-zinc-100 font-medium">65.6%</span>
                      <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Test Accuracy</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-mono text-zinc-100 font-medium">87 Classes</span>
                      <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Categorized</span>
                    </div>
                  </>
                )}
                {activeTab === 'security' && (
                  <>
                    <div>
                      <span className="block text-2xl font-mono text-zinc-100 font-medium">30 members</span>
                      <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Team Directed</span>
                    </div>
                    <div>
                      <span className="block text-2xl font-mono text-zinc-100 font-medium">0 Critical</span>
                      <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Vulnerabilities Left</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: INTERACTIVE WIDGET (7 columns) */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden p-5 flex flex-col justify-between glow-box min-h-[380px]">
            {/* WIDGET 1: DIALOGUE SIMULATOR */}
            {activeTab === 'dialogue' && (
              <div className="flex flex-col h-full justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div className="flex items-center space-x-2 text-zinc-400">
                    <Terminal className="w-4 h-4 text-zinc-400" />
                    <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">Memory & Orchestration Flow</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">Dialogue Core Simulator</span>
                </div>

                {/* Prompt Buttons */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-mono text-zinc-500">Pick a prompt to test data flow:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SIMULATED_PROMPTS.map((p, idx) => (
                      <button
                        key={idx}
                        disabled={isSimulating}
                        onClick={() => triggerDialogueSimulation(idx)}
                        className={`text-left text-xs p-3 rounded-lg border transition-all cursor-pointer ${
                          selectedPromptIdx === idx
                            ? 'bg-zinc-900 border-zinc-700 text-zinc-100'
                            : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800'
                        }`}
                      >
                        <p className="font-sans font-medium line-clamp-1">{p.prompt}</p>
                        <span className="block text-[9px] font-mono text-zinc-500 mt-1 flex items-center gap-1">
                          Test flow <ChevronRight className="w-2.5 h-2.5" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic flow chart representing the local architecture */}
                <div className="border border-zinc-900 bg-zinc-900/10 rounded-xl p-4 flex flex-col justify-center min-h-[160px] relative">
                  {selectedPromptIdx === null ? (
                    <div className="text-center py-6 text-zinc-500 space-y-1">
                      <Cpu className="w-8 h-8 mx-auto stroke-1 mb-2 animate-pulse" />
                      <p className="text-xs font-mono">Orchestrator Idle</p>
                      <p className="text-[11px]">Select a task above to see Mastra, Pocketbase and filesystem synchrony.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Interactive pipeline */}
                      <div className="grid grid-cols-4 gap-2 relative">
                        {[
                          { name: "Next.js UI", icon: Code },
                          { name: "Mastra Agent", icon: Cpu },
                          { name: "Pocketbase SQLite", icon: Database },
                          { name: "Local Files", icon: HardDrive }
                        ].map((node, stepIdx) => {
                          const Icon = node.icon;
                          const isActive = simStep >= stepIdx;
                          const isCurrent = simStep === stepIdx && isSimulating;

                          return (
                            <div key={node.name} className="flex flex-col items-center relative z-10">
                              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                                isCurrent 
                                  ? 'bg-zinc-100 border-white text-zinc-950 shadow-lg scale-110 shadow-white/10'
                                  : isActive
                                  ? 'bg-zinc-900 border-zinc-600 text-zinc-100'
                                  : 'bg-zinc-950 border-zinc-900 text-zinc-600'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className={`text-[9px] font-mono mt-1.5 text-center leading-none ${
                                isActive ? 'text-zinc-300' : 'text-zinc-600'
                              }`}>{node.name}</span>
                            </div>
                          );
                        })}

                        {/* Connection Line */}
                        <div className="absolute top-5 left-5 right-5 h-0.5 bg-zinc-900 -z-0">
                          <div 
                            className="h-full bg-zinc-200 transition-all duration-300"
                            style={{ width: `${(simStep / 3) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Step description */}
                      <div className="border-t border-zinc-900/60 pt-3">
                        <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Active Step</span>
                        <p className="text-[12px] text-zinc-300 font-mono mt-0.5">
                          {SIMULATED_PROMPTS[selectedPromptIdx].steps[simStep].component}: {SIMULATED_PROMPTS[selectedPromptIdx].steps[simStep].action}
                        </p>
                      </div>

                      {/* Simulated Agent Output */}
                      {simStep === 3 && !isSimulating && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 text-xs leading-relaxed text-zinc-300 mt-2"
                        >
                          <span className="font-mono text-[9px] text-zinc-400 block mb-1 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            COMPANION RESPONSE:
                          </span>
                          {SIMULATED_PROMPTS[selectedPromptIdx].agentOutput}
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WIDGET 2: EXIFSENSE NLP TRANSLATOR */}
            {activeTab === 'exifsense' && (
              <div className="flex flex-col h-full justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div className="flex items-center space-x-2 text-zinc-400">
                    <FileImage className="w-4 h-4 text-zinc-400" />
                    <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">Machine Code to Natural Narrative</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">ExifSense Core v1.0</span>
                </div>

                {/* Sample selector */}
                <div className="flex space-x-2">
                  {EXIF_SAMPLES.map((s, idx) => (
                    <button
                      key={s.name}
                      onClick={() => setSelectedExifIdx(idx)}
                      className={`text-[11px] font-mono px-3 py-1.5 rounded-md border transition-all cursor-pointer ${
                        selectedExifIdx === idx
                          ? 'bg-zinc-100 border-zinc-200 text-zinc-950'
                          : 'bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>

                {/* Left/Right display: raw tags vs narrative translation */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Raw tags panel (5 columns) */}
                  <div className="md:col-span-5 bg-zinc-950 border border-zinc-900 rounded-lg p-3.5 space-y-1.5">
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-1 mb-2">RAW EXIF DATA</span>
                    {Object.entries(EXIF_SAMPLES[selectedExifIdx].tags).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-zinc-500">{key}:</span>
                        <span className="text-zinc-300 truncate max-w-[140px]" title={value}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Narrative panel (7 columns) */}
                  <div className="md:col-span-7 bg-zinc-900/20 border border-zinc-900 rounded-lg p-3.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-mono uppercase tracking-widest border-b border-zinc-900 pb-1 mb-2">
                        <Info className="w-3 h-3 text-zinc-400" />
                        NLP TRANSLATED NARRATIVE
                      </div>
                      <p className="text-[11px] text-zinc-300 font-sans leading-relaxed italic">
                        &ldquo;{EXIF_SAMPLES[selectedExifIdx].narrative}&rdquo;
                      </p>
                    </div>
                    <div className="text-[9px] font-mono text-zinc-500 text-right mt-3">
                      Narrative Intelligence Engine: Activated
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WIDGET 3: GEMSTONE CLASSIFIER MOCKUP */}
            {activeTab === 'gemstone' && (
              <div className="flex flex-col h-full justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div className="flex items-center space-x-2 text-zinc-400">
                    <Layers className="w-4 h-4 text-zinc-400" />
                    <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">ResNet50 Classifier Dashboard</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">FastAPI Backend Mockup</span>
                </div>

                {/* Sample selector */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-mono text-zinc-500">Select a gemstone sample to classify:</span>
                  <div className="flex space-x-2">
                    {GEMSTONE_SAMPLES.map((s, idx) => (
                      <button
                        key={s.name}
                        onClick={() => setSelectedGemIdx(idx)}
                        className={`text-[11px] font-mono px-3 py-1.5 rounded-md border transition-all cursor-pointer ${
                          selectedGemIdx === idx
                            ? 'bg-zinc-100 border-zinc-200 text-zinc-950 font-medium'
                            : 'bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main display */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Left: Gemstone Visualizer (5 columns) */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center bg-zinc-950 border border-zinc-900 rounded-lg p-4 h-[160px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-radial from-zinc-900/50 to-transparent pointer-events-none" />
                    <svg className="w-20 h-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.07)]" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id={`gemGrad-${selectedGemIdx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={GEMSTONE_SAMPLES[selectedGemIdx].color.start} />
                          <stop offset="100%" stopColor={GEMSTONE_SAMPLES[selectedGemIdx].color.end} />
                        </linearGradient>
                      </defs>
                      <path 
                        d={GEMSTONE_SAMPLES[selectedGemIdx].shape} 
                        style={{
                          fill: `url(#gemGrad-${selectedGemIdx})`,
                          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                        }}
                      />
                    </svg>
                    <span className="text-[10px] font-mono text-zinc-500 mt-2">{GEMSTONE_SAMPLES[selectedGemIdx].name.toLowerCase()}.jpg</span>
                  </div>

                  {/* Right: Predictions (7 columns) */}
                  <div className="md:col-span-7 space-y-3.5">
                    {/* Target Prediction */}
                    <div>
                      <div className="flex justify-between items-center text-xs font-mono mb-1">
                        <span className="text-zinc-200 font-semibold">{GEMSTONE_SAMPLES[selectedGemIdx].name}</span>
                        <span className="text-emerald-400 font-medium">{(GEMSTONE_SAMPLES[selectedGemIdx].confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                          style={{ width: `${GEMSTONE_SAMPLES[selectedGemIdx].confidence * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Alternatives */}
                    <div className="space-y-1.5 border-t border-zinc-900/60 pt-3">
                      <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Top Alternatives</span>
                      {GEMSTONE_SAMPLES[selectedGemIdx].alternatives.map((alt) => (
                        <div key={alt.name} className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-zinc-400">{alt.name}</span>
                          <span className="text-zinc-500">{(alt.conf * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Brief narrative info */}
                <div className="bg-zinc-900/20 border border-zinc-900 rounded-lg p-3 text-xs text-zinc-400 font-sans leading-relaxed">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase block mb-1">Classifier Insight</span>
                  {GEMSTONE_SAMPLES[selectedGemIdx].info}
                </div>
              </div>
            )}

            {/* WIDGET 4: UNIVERSITY SECURITY AUDIT & PM */}
            {activeTab === 'security' && (
              <div className="flex flex-col h-full justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div className="flex items-center space-x-2 text-zinc-400">
                    <ShieldAlert className="w-4 h-4 text-zinc-400" />
                    <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">Rigorous DOM & API Audit logs</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">Security Audit Terminal</span>
                </div>

                {/* Audit Terminal simulator */}
                <div className="bg-black border border-zinc-900 rounded-lg p-4 font-mono text-[11px] leading-relaxed space-y-2 h-[220px] overflow-y-auto scrollbar-thin">
                  <p className="text-zinc-500"># Initializing Security Audit on build://prod-web-v1...</p>
                  <p className="text-zinc-500"># Sourcing OWASP ZAP rules & scanning DOM tree nodes...</p>
                  <p className="text-amber-500 flex items-center gap-1">
                    <span>[!]</span> ALERT: Stored XSS threat vectors found in /api/comments/save handler
                  </p>
                  <p className="text-zinc-400 ml-4">
                    - Input source: <span className="text-zinc-300">req.body.text</span> (unescaped payload inject)
                  </p>
                  <p className="text-zinc-400 ml-4">
                    - Audit location: DOM rendering dynamic node: <span className="text-zinc-300">innerHTML = comment.text</span>
                  </p>
                  <p className="text-emerald-500 flex items-center gap-1 font-medium mt-1">
                    <span>[✓]</span> RESOLUTION APPLIED: Implemented custom sanitizer & switched to textContent
                  </p>
                  <p className="text-amber-500 flex items-center gap-1">
                    <span>[!]</span> ALERT: Missing CSRF anti-forgery headers on sensitive state updates
                  </p>
                  <p className="text-emerald-500 flex items-center gap-1 font-medium">
                    <span>[✓]</span> RESOLUTION APPLIED: Implemented strict secure cookie headers and token challenge handshake
                  </p>
                  <p className="text-zinc-400 mt-2"># Audit complete: 0 vulnerabilities found after validation sprint.</p>
                </div>

                <div className="text-[10px] font-mono text-zinc-500 flex justify-between items-center">
                  <span>Audit Engine: OWASP ZAP + DOM Analyzer</span>
                  <span className="text-emerald-500">STATUS: SAFE</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
