import type { ExhibitItem } from "../personal";

export interface Cortex {
  id: "cortex";
  headline: string;
  github: string;
  items: ExhibitItem[];
}

export const cortex: Cortex = {
  id: "cortex",
  headline: "Cortex v3.0",
  github: "https://github.com/joshuarg007/cortex",
  items: [
    {
      title: "AI-Powered Development Memory",
      subtitle: "Local LLM Enhancement for Claude Code",
      bullets: [
        "Persistent memory powered by local LLMs (Ollama)",
        "RTX 4090 optimized with thermal safeguards",
        "Semantic search via FAISS + nomic-embed"
      ]
    },
    {
      title: "Error-Solution Linking",
      subtitle: "Never Debug the Same Issue Twice",
      bullets: [
        "Automatic error pattern capture from Bash",
        "Solutions auto-link when fixes are applied",
        "Searchable knowledge base across sessions"
      ]
    },
    {
      title: "Project DNA Analysis",
      subtitle: "Auto-Detect Languages, Frameworks, Gotchas",
      bullets: [
        "Analyzes project structure and dependencies",
        "Identifies coding patterns and conventions",
        "Proactive suggestions based on learned patterns"
      ]
    },
    {
      title: "Claude Code Integration",
      subtitle: "Hooks System for Seamless Memory",
      bullets: [
        "SessionStart: Project DNA, key learnings, GPU status",
        "PostToolUse: Error capture, past solution suggestions",
        "Stop: Learning extraction, solution linking"
      ]
    }
  ]
};

export default cortex;
