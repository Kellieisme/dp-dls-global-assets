import { mkdirSync, writeFileSync } from 'fs';
import { Const } from '../const.js';
import { importFromFigma } from '@iconify/tools';
import { FigmaImportResult } from '@iconify/tools/lib/import/figma/types/result.js';
import 'dotenv/config';

export async function saveFigmaFileData() {
  // Fetch data from Figma
  console.log('Fetching icons from FIGMA API...');
  console.log('Fetching file: ', process.env.FIGMA_ICONS_FILE_KEY);
  const iconsData: FigmaImportResult = await importFromFigma({
    file: process.env.FIGMA_ICONS_FILE_KEY || '',
    token: process.env.FIGMA_API_KEY || '',
    prefix: 'icons',
    pages: ['Atmosphere Icons'],
    iconNameForNode: (node) => {
      if (
        node.parents.length !== 3
      ) {
          return null;
      }
      return node.name;
    }
  });

  mkdirSync(Const.dataPaths.dir, { recursive: true });
  writeFileSync(Const.dataPaths.data.icons, JSON.stringify(iconsData, null, 2));
}

saveFigmaFileData();
