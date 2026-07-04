/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BOOK_BUY_URL_EN: string
  readonly VITE_BOOK_BUY_URL_DE: string
  readonly VITE_BOOK_AUTHOR_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
