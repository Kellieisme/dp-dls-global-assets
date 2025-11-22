
import StyleDictionary from 'style-dictionary';
import { Command } from 'commander';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

const program = new Command();

import { config } from './configs/config.all.js';
import { customFilters, customTransforms, customTransformGroups, customFormats } from './extensions/index.js';

program
  .command('build')
  .description('Build Style Dictionary from tokens')
  .action(() => {

    // Dynamic source resolution:
    // 1. If an external tokens submodule exists (e.g. token-service/external-tokens)
    //    and contains JSON files, use those.
    // 2. Otherwise fall back to the locally parsed Tokens Studio outputs.
    const externalTokensDir = join(process.cwd(), 'token-service', 'external-tokens');
    let externalJsonGlobs: string[] = [];
    if (existsSync(externalTokensDir)) {
      try {
        const entries = readdirSync(externalTokensDir, { withFileTypes: true });
        const hasJson = entries.some(e => !e.isDirectory() && e.name.endsWith('.json'));
        if (hasJson) {
          // Generic glob to include all JSON tokens from external repo
          externalJsonGlobs = ['external-tokens/**/*.json'];
        } else {
          // Look for a build or dist folder structure
          const buildDir = join(externalTokensDir, 'build');
          if (existsSync(buildDir)) {
            externalJsonGlobs = ['external-tokens/build/**/*.json'];
          }
        }
      } catch (err) {
        console.warn('Warning inspecting external tokens directory:', err);
      }
    }

    if (externalJsonGlobs.length > 0) {
      console.log('Using external tokens source:', externalJsonGlobs);
      config.source = externalJsonGlobs;
    } else {
      console.log('Using local Tokens Studio parsed source.');
      config.source = ['tokens/tokens-studio/all/*.json'];
    }

    // Build tokens
    console.log('Running Style Dictionary build with the following config:');
    console.log(config);

    // Style Dictionary
    const SD = StyleDictionary;
    Object.values(customFilters).forEach(f => SD.registerFilter(f));
    Object.values(customTransforms).forEach(t => SD.registerTransform(t));
    Object.values(customTransformGroups).forEach(tg => SD.registerTransformGroup(tg));
    Object.values(customFormats).forEach(f => SD.registerFormat(f));
    SD.extend(config).buildAllPlatforms();
  });

program.parse(process.argv);