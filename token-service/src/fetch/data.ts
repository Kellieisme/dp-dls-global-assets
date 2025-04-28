import { mkdirSync, writeFileSync } from 'fs';
import { fetchStyles} from "./api.js";
import { StylesData } from './types';
import { Const } from '../const.js';

const STYLES_API_URL = `https://api.figma.com/v1/files/${process.env.FIGMA_ALIAS_FILE_KEY}/styles`;
const NODES_API_URL = `https://api.figma.com/v1/files/${process.env.FIGMA_ALIAS_FILE_KEY}/nodes`;

export async function saveFigmaFileData() {
  // Fetch data from Figma
  console.log('Fetching styles data from Figma API...');
  const stylesData: StylesData = await fetchStyles(STYLES_API_URL, NODES_API_URL);
  
  mkdirSync(Const.dataPaths.dir, { recursive: true });
  writeFileSync(Const.dataPaths.data.styles, JSON.stringify(stylesData, null, 2));
}

saveFigmaFileData();