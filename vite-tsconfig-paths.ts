import { Plugin, ResolvedConfig, Alias } from 'vite';
import * as path from 'path';
import * as fs from 'fs';

interface TsConfig {
  compilerOptions?: {
    paths?: Record<string, string[]>;
    baseUrl?: string;
  };
}

// This is a simple plugin to help Vite resolve TypeScript path aliases
export function tsconfigPaths(): Plugin {
  return {
    name: 'vite-tsconfig-paths',
    configResolved(config: ResolvedConfig) {
      // Read the tsconfig.json file
      const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
      if (!fs.existsSync(tsconfigPath)) {
        console.warn('No tsconfig.json found. Path aliases may not work correctly.');
        return;
      }

      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8')) as TsConfig;
      const paths = tsconfig.compilerOptions?.paths || {};
      const baseUrl = tsconfig.compilerOptions?.baseUrl || '.';

      // Create alias entries
      const newAliases: Array<{ find: string; replacement: string }> = [];
      
      Object.entries(paths).forEach(([alias, targets]) => {
        if (targets && targets.length > 0) {
          const key = alias.replace(/\/\*$/, '');
          const value = path.resolve(process.cwd(), baseUrl, targets[0].replace(/\/\*$/, ''));
          newAliases.push({ find: key, replacement: value });
        }
      });

      // Add our aliases to the existing ones
      if (Array.isArray(config.resolve.alias)) {
        config.resolve.alias = [...config.resolve.alias, ...newAliases] as Alias[];
      } else {
        // Convert object to array of aliases if needed
        const existingAliases: Array<{ find: string; replacement: string }> = 
          Object.entries(config.resolve.alias || {}).map(
            ([find, replacement]) => ({ 
              find, 
              replacement: replacement as string 
            })
          );
        config.resolve.alias = [...existingAliases, ...newAliases] as Alias[];
      }
    },
  };
}
