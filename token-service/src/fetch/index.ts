import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { IconsData } from './types';
import { Const } from '../const.js';
import { parseIconsFile } from './parsers/parse-icons.js';
import { parseAllTokensStudio } from './parsers/parse-tokens-studio-all.js';

function generateTokensStudioStyleDictionaryTokens() {
  const tokensStudioData: any = JSON.parse(readFileSync(Const.dataPaths.data.tokensStudio, 'utf8'));

  const restructuredJson = parseAllTokensStudio(tokensStudioData);
  mkdirSync(Const.tokensStudioPaths.dir.all, { recursive: true });
  writeFileSync(`${Const.tokensStudioPaths.dir.all}/${Const.tokensStudioPaths.file.base}`, JSON.stringify(restructuredJson.base, null, 2));
  writeFileSync(`${Const.tokensStudioPaths.dir.all}/${Const.tokensStudioPaths.file.alias}`, JSON.stringify(restructuredJson.alias, null, 2));
}

function generateIcons() {
  const iconsData: IconsData = JSON.parse(readFileSync(Const.dataPaths.data.icons, 'utf8'));
  const { combinedSvg, individualSvgs } = parseIconsFile(iconsData);
  mkdirSync(Const.srcPaths.dir.icons, { recursive: true });
  
  //Complete svg set
  writeFileSync(`${Const.srcPaths.dir.icons}/${Const.srcPaths.file.set}`, combinedSvg);

  //Individual icons files
  Object.entries(individualSvgs).forEach(([filename, svgContent]) => {
    writeFileSync(`${Const.srcPaths.dir.icons}/${filename}.svg`, svgContent);
  });
}

const args = process.argv.slice(2);

if (args[0] === 'generateTokensStudioStyleDictionaryTokens') {
  generateTokensStudioStyleDictionaryTokens();
} else if (args[0] === 'generateIcons') {
  generateIcons();
} else {
  console.log('Invalid function name or no function name provided.');
}
