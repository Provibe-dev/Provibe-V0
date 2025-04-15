export interface AiTool {
  id: string;
  name: string;
  logo: string;
  description: string;
  category?: string;
}

export const aiTools: AiTool[] = [
  {
    id: "augment",
    name: "Augment",
    logo: "https://logo.clearbit.com/augmentcode.com",
    description: "AI dev environment that learns your codebase and acts like an AI teammate",
    category: "AI IDE"
  },
  {
    id: "bolt",
    name: "Bolt AI",
    logo: "./public/assets/img/ai/02_bolt.svg",
    description: "Build full-stack apps from a prompt using an open-source AI agent framework",
    category: "Low-Code/No-Code"
  },
  {
    id: "cogram",
    name: "Cogram",
    logo: "https://logo.clearbit.com/cogram.com",
    description: "Turn natural language into SQL queries and Python code for analytics or backend logic",
    category: "Prompt-to-Code"
  },
  {
    id: "cohere",
    name: "Cohere",
    logo: "https://logo.clearbit.com/cohere.com",
    description: "Large language models for text understanding",
    category: "Large Language Model"
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    logo: "https://logo.clearbit.com/github.com",
    description: "AI pair programmer that suggests code based on comments and context",
    category: "Code Assistant"
  },
  {
    id: "cursor",
    name: "Cursor IDE",
    logo: "./public/assets/img/ai/04_cursor.svg",
    description: "AI-first IDE powered by GPT-4 to write, refactor, and explain code using chat-like interface",
    category: "AI IDE"
  },
  {
    id: "lovable",
    name: "Lovable",
    logo: "./public/assets/img/ai/06_lovable.svg",
    description: "Generate mobile and web apps with a single prompt – code, UI, and logic included",
    category: "Low-Code/No-Code"
  },
  {
    id: "replit",
    name: "Replit Ghostwriter",
    logo: "./public/assets/img/ai/09_replit.svg",
    description: "In-browser IDE with Ghostwriter AI assistant for prompt-based coding and debugging",
    category: "AI IDE"
  },
  {
    id: "v0",
    name: "Vercel v0",
    logo: "./public/assets/img/ai/07_v0_dev.svg",
    description: "Convert UI descriptions into Tailwind + React components instantly",
    category: "Prompt-to-UI"
  },
  {
    id: "vscode",
    name: "Visual Studio Code",
    logo: "https://code.visualstudio.com/favicon.ico",
    description: "Popular IDE with GitHub Copilot and AI plugins for low-code development",
    category: "AI IDE"
  },
  {
    id: "windsurf",
    name: "Windsurf",
    logo: "https://windsurf.ai/favicon.ico",
    description: "AI coding platform for building full-stack apps from prompts, no setup needed",
    category: "Low-Code/No-Code"
  },
  {
    id: "glide",
    name: "Glide",
    logo: "https://logo.clearbit.com/glideapps.com",
    description: "AI powered app development",
    category: "Low-Code/No-Code"
  },
  {
    id: "adalo",
    name: "Adalo",
    logo: "https://logo.clearbit.com/adalo.com",
    description: "AI powered app development",
    category: "Low-Code/No-Code"
  },
  {
    id: "bubble",
    name: "Bubble",
    logo: "https://logo.clearbit.com/bubble.io",
    description: "AI powered app development",
    category: "Low-Code/No-Code"
  },
  {
    id: "gemini",
    name: "Gemini Code Assist",
    logo: "https://logo.clearbit.com/gemini.google.com",
    description: "AI pair programmer that suggests code based on comments and context",
    category: "Code Assistant"
  }
];
