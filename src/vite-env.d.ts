/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BOOK_BUY_URL_EN: string
  readonly VITE_BOOK_BUY_URL_DE: string
  readonly VITE_BOOK_AUTHOR_URL: string
  readonly VITE_ENABLE_AI_CHAT: string
  readonly VITE_AI_PROVIDER: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_OLLAMA_BASE_URL: string
  readonly VITE_OLLAMA_API_KEY: string
  readonly VITE_OLLAMA_MODEL: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_ANTHROPIC_API_KEY: string
  readonly VITE_GROQ_API_KEY: string
  readonly VITE_GROQ_MODEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
