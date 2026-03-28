/// <reference types="vite/client" />

declare module '*.css' {}

type ImportGlobOptions<Eager extends boolean, AsType extends string> = {
  /**
   * @deprecated `query`를 사용
   */
  as?: AsType;
  eager?: Eager;
  import?: string;
  query?: string | Record<string, string | number | boolean>;
  exhaustive?: boolean;
  base?: string;
};

type GeneralImportGlobOptions = ImportGlobOptions<boolean, string>;

interface Worker {
}

interface KnownAsTypeMap {
  raw: string;
  url: string;
  worker: Worker;
}

interface ImportGlobFunction {
  <
    Eager extends boolean,
    As extends string,
    T = As extends keyof KnownAsTypeMap ? KnownAsTypeMap[As] : unknown,
  >(
    glob: string | string[],
    options?: ImportGlobOptions<Eager, As>,
  ): (Eager extends true ? true : false) extends true
    ? Record<string, T>
    : Record<string, () => Promise<T>>;
  
  <M>(
    glob: string | string[],
    options?: ImportGlobOptions<false, string>,
  ): Record<string, () => Promise<M>>;
  
  <M>(
    glob: string | string[],
    options: ImportGlobOptions<true, string>,
  ): Record<string, M>;
}

type HotPayload =
  | ConnectedPayload
  | PingPayload
  | UpdatePayload
  | FullReloadPayload
  | CustomPayload
  | ErrorPayload
  | PrunePayload;

interface ConnectedPayload {
  type: 'connected';
}

interface PingPayload {
  type: 'ping';
}

interface UpdatePayload {
  type: 'update';
  updates: Update[];
}

interface Update {
  type: 'js-update' | 'css-update';
  path: string;
  acceptedPath: string;
  timestamp: number;
  explicitImportRequired?: boolean;
  isWithinCircularImport?: boolean;
  firstInvalidatedBy?: string;
  invalidates?: string[];
}

interface PrunePayload {
  type: 'prune';
  paths: string[];
}

interface FullReloadPayload {
  type: 'full-reload';
  path?: string;
  triggeredBy?: string;
}

interface CustomPayload {
  type: 'custom';
  event: string;
  data?: any;
}

interface ErrorPayload {
  type: 'error';
  err: {
    [name: string]: any;
    message: string;
    stack: string;
    id?: string;
    frame?: string;
    plugin?: string;
    pluginCode?: string;
    loc?: {
      file?: string;
      line: number;
      column: number;
    };
  };
}

interface WebSocketConnectionPayload {
  webSocket: WebSocket;
}

interface InvalidatePayload {
  path: string;
  message: string | undefined;
  firstInvalidatedBy: string;
}

interface CustomEventMap {
  'vite:beforeUpdate': UpdatePayload;
  'vite:afterUpdate': UpdatePayload;
  'vite:beforePrune': PrunePayload;
  'vite:beforeFullReload': FullReloadPayload;
  'vite:error': ErrorPayload;
  'vite:invalidate': InvalidatePayload;
  'vite:ws:connect': WebSocketConnectionPayload;
  'vite:ws:disconnect': WebSocketConnectionPayload;
  'vite:client:connect': undefined;
  'vite:client:disconnect': undefined;
}

type InferCustomEventPayload<T extends string> =
  T extends keyof CustomEventMap ? CustomEventMap[T] : any;

type CustomEventName = keyof CustomEventMap | (string & {});

type ModuleNamespace = Record<string, any> & {
  [Symbol.toStringTag]: 'Module';
};

interface ViteHotContext {
  readonly data: any;
  
  accept(): void;
  
  accept(cb: (mod: ModuleNamespace | undefined) => void): void;
  
  accept(dep: string, cb: (mod: ModuleNamespace | undefined) => void): void;
  
  accept(
    deps: readonly string[],
    cb: (mods: Array<ModuleNamespace | undefined>) => void,
  ): void;
  
  acceptExports(
    exportNames: string | readonly string[],
    cb?: (mod: ModuleNamespace | undefined) => void,
  ): void;
  
  dispose(cb: (data: any) => void): void;
  
  prune(cb: (data: any) => void): void;
  
  invalidate(message?: string): void;
  
  on<T extends CustomEventName>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void;
  
  off<T extends CustomEventName>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void;
  
  send<T extends CustomEventName>(
    event: T,
    data?: InferCustomEventPayload<T>,
  ): void;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_HOOK: string;
      DB_URL: string;
      ADMIN_DISCORD_ID: string;
    }
  }
  
  interface ImportMetaEnv extends Record<string, string | boolean | undefined> {
    readonly BASE_URL: string;
    readonly MODE: string;
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly SSR: boolean;
    readonly DISCORD_HOOK: string;
    readonly DB_URL: string;
    readonly ADMIN_DISCORD_ID: string;
  }
  
  interface ImportMeta {
    readonly url: string;
    readonly hot?: ViteHotContext;
    readonly env: ImportMetaEnv;
    readonly glob: ImportGlobFunction;
    
    readonly [key: string]: unknown;
  }
}

export {};
