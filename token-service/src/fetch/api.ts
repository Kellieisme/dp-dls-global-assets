import fetch, { Headers } from 'node-fetch';
import { StylesData } from './types';
import 'dotenv/config';

const headers = new Headers({
  "X-Figma-Token": process.env.FIGMA_API_KEY || '',
});

export async function fetchStyles(stylesUrl, nodesUrl) {
  try {
    const res = await fetch(`${stylesUrl}`, { headers });
    const data: any = await res.json();
    const stylesData = data?.meta?.styles || [] as StylesData
    const nodes = stylesData.map((s: {node_id: string}) => {
      return s.node_id
    });
    
    const nodesRes = await fetch(`${nodesUrl}?ids=${nodes.toString()}`, { headers });
    const nodesData: any = await nodesRes.json();
    stylesData.forEach((s: {styleNode: {}, node_id: string}) => {
      s.styleNode = nodesData.nodes[s.node_id].document;
    })
    
    return stylesData;
  } catch (e) {
    console.log(e);
  }
 
}