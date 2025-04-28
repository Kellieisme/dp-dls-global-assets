
import StyleDictionary from 'style-dictionary';
import { Command } from 'commander';

const program = new Command();

import { config } from './configs/config.all.js';
import { customFilters, customTransforms, customTransformGroups, customFormats } from './extensions/index.js';

program
  .command('build')
  .description('Build Style Dictionary from tokens')
  .action(() => {

    config.source = ['tokens/tokens-studio/all/*.json'];

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