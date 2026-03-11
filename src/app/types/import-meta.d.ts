/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DISCORD_HOOK: string;
  readonly DB_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
