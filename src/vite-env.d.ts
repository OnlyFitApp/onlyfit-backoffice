/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ONLYFIT_CORE_URL: string;
  readonly VITE_ONLYFIT_CORE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
