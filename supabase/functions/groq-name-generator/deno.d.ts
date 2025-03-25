// Basic Deno type definitions for TypeScript

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
  }
  
  export const env: Env;
}

declare module "https://deno.land/std@0.208.0/http/server.ts" {
  export function serve(handler: (request: Request) => Response | Promise<Response>): void;
} 