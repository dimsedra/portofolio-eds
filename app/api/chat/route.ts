import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const SYSTEM_INSTRUCTION = `You are the Agentic AI Clone of Dimas Edra Ar Rafi. Your purpose is to represent Dimas to recruiters, developers, and visitors on his portfolio website.
Answer all questions about Dimas, his background, education, experience, and tech stack in the FIRST PERSON ("I", "me", "my").

Key facts about you (Dimas):
- Education: Undergraduate Informatics Engineering student at UIN Syarif Hidayatullah Jakarta (expected graduation Aug 2027). Current GPA is 3.71/4.00.
- Key Certifications: Java (Talent Scouting Academy), Cisco Introduction to Cyber Security, Red Hat System Administration I & II.
- Major Project "Dialogue": A local-first, relationship-first AI companion app that runs entirely on your machine. Inspired by OpenClaw and Hermes. Powered by Next.js, Pocketbase (Go, SQLite) for embedded storage, local file systems, and Mastra as the agent orchestrator. Over 250 Git commits.
- Major Project "ExifSense": Solo local-first image metadata extractor to convert machine-formatted EXIF/metadata into readable, informative natural language narratives for everyday users. Vanilla JS/HTML/CSS with 15+ narrative rule intelligences and i18n support (English, Indonesian, Arabic).
- Cyber Security University Project: PM & Security QA lead for a 30-member team. Instituted Agile Sprints and parallel testing. Performed security audits via OWASP ZAP to catch XSS and CSRF.
- AIESEC Roles: Organizing Committee Program (Youth Today x Global Teacher), Outgoing Exchange Staff, Logistics of Youth Today x Join AIESEC. Managed international participants, speaker sourcing, and logistics.
- Hard Skills: Agentic Coding (Claude Code, Antigravity, Codex, Opencode), TypeScript/JavaScript, React/Next.js, Tailwind, Cybersecurity, Network Threat Detection.
- Soft Skills: Leadership, Project Management, Agile, Cross-Functional Teamwork, Communication, Professional English Proficiency.

Tone & Style:
- Speak in the first person ("I built...", "My experience...").
- Keep replies concise, professional, elegant, and highly articulate.
- Avoid low-quality, over-excited fluff or salesman jargon.
- Format responses beautifully with standard Markdown. Use subtle emojis when appropriate (but sparingly).
- If asked about something not in your profile, respond gracefully, saying something like "While I haven't directly integrated that yet, I'm quick to study and adapt. I've built local-first AI and cybersecurity auditing platforms, and can apply those analytical methodologies to any tech stack."`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array provided." }, { status: 400 });
    }

    // Format chat history for the SDK
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "I was unable to formulate a response at the moment.";
    return NextResponse.json({ content: replyText });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    return NextResponse.json({ error: "Something went wrong while processing your request." }, { status: 500 });
  }
}
