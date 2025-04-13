export interface AiTool {
  id: string;
  name: string;
  logo: string;
  description: string;
  category?: string;
}

export const aiTools: AiTool[] = [
  {
    id: "claude",
    name: "Claude AI",
    logo: "/assets/img/ai/01_claude_ai.svg",
    description: "Advanced AI assistant by Anthropic with strong reasoning capabilities and longer context windows."
  },
  {
    id: "bolt",
    name: "Bolt",
    logo: "/assets/img/ai/02_bolt.svg",
    description: "Lightning-fast AI-powered development environment for rapid prototyping."
  },
  {
    id: "vscode",
    name: "VS Code",
    logo: "/assets/img/ai/03_vs_code.png",
    description: "Microsoft's powerful code editor with extensive AI integration capabilities."
  },
  {
    id: "github-copilot",
    name: "Github Copilot",
    logo: "/assets/img/ai/04_github_copilot.svg",
    description: "AI pair programmer that helps you write code faster with contextual suggestions."
  },
  {
    id: "cursor",
    name: "Cursor AI",
    logo: "/assets/img/ai/05_cursor_ai.png",
    description: "AI-first code editor designed to help developers write, edit and understand code quickly."
  },
  {
    id: "lovable",
    name: "Lovable",
    logo: "/assets/img/ai/06_lovable.svg",
    description: "AI-powered design tool that helps create beautiful user interfaces with minimal effort."
  },
  {
    id: "v0",
    name: "v0 dev",
    logo: "/assets/img/ai/07_v0_dev.svg",
    description: "Generate UI from simple text prompts, powered by Vercel's AI technology."
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    logo: "/assets/img/ai/08_chatgpt.svg",
    description: "OpenAI's conversational AI model that can assist with coding, planning, and documentation."
  },
  {
    id: "replit",
    name: "Replit",
    logo: "/assets/img/ai/09_replit.svg",
    description: "Browser-based IDE with AI features for collaborative coding and rapid development."
  },
  {
    id: "xcode",
    name: "Xcode",
    logo: "/assets/img/ai/10.png",
    description: "Apple's development environment with integrated AI assistance for Swift and iOS development."
  },
  {
    id: "midjourney",
    name: "Midjourney",
    logo: "/assets/img/ai/11.svg",
    description: "AI image generation tool that creates stunning visuals from text descriptions."
  },
  {
    id: "codeium",
    name: "Codeium",
    logo: "/assets/img/ai/12.svg",
    description: "Free AI-powered code completion and generation tool that works across multiple IDEs."
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    logo: "/assets/img/ai/13.svg",
    description: "AI-powered search engine that provides comprehensive answers with cited sources."
  },
  {
    id: "anthropic",
    name: "Anthropic",
    logo: "/assets/img/ai/14.svg",
    description: "AI safety company developing reliable, interpretable, and steerable AI systems."
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    logo: "/assets/img/ai/15.svg",
    description: "Platform for sharing and collaborating on machine learning models, datasets, and applications."
  },
  {
    id: "stability-ai",
    name: "Stability AI",
    logo: "/assets/img/ai/16.svg",
    description: "Company behind Stable Diffusion and other open-source generative AI models."
  },
  {
    id: "runway",
    name: "Runway",
    logo: "/assets/img/ai/17.svg",
    description: "Creative suite with AI tools for video editing, generation, and visual effects."
  },
  {
    id: "jasper",
    name: "Jasper",
    logo: "/assets/img/ai/18.svg",
    description: "AI content platform that helps teams create marketing copy, images, and content."
  },
  {
    id: "bard",
    name: "Google Bard",
    logo: "/assets/img/ai/19.svg",
    description: "Google's conversational AI assistant powered by the Gemini model."
  },
  {
    id: "deepl",
    name: "DeepL",
    logo: "/assets/img/ai/20.svg",
    description: "AI-powered translation tool known for its accuracy and natural-sounding translations."
  }
];
