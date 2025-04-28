import { IconsData } from "../types";

export function parseIconsFile(iconsData: IconsData): { combinedSvg: string; individualSvgs: { [key: string]: string } } {
    const iconSet = iconsData.iconSet;

    const individualSvgOpenTag = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\n';
    const combinedSvgOpenTag = '<svg xmlns="http://www.w3.org/2000/svg">\n';

    const svgCloseTag = '</svg>';
    let combinedSvgContent = '';
    let individualSvgs = {};

    Object.entries(iconSet.entries).forEach(([key, value]) => {
        if (value.type === 'icon') {
            // Add 'icon-' prefix and convert snake case to kebab case
            const parsedKey = 'icon-' + key.replace(/_/g, '-');
            
            // Remove the <g> element, replace \" with ", and remove fill attribute
            let bodyWithoutG = value.body
                .replace(/<g[^>]*>|<\/g>/g, '')
                .replace(/\\"/g, '"')
                .replace(/fill="[^"]*"/g, '');

            const symbolElement = `  <symbol id="${parsedKey}" viewBox="0 0 24 24">\n    ${bodyWithoutG}\n  </symbol>\n`;
            combinedSvgContent += symbolElement;

            // Store individual SVG content for each symbol
            individualSvgs[parsedKey] = `${individualSvgOpenTag}  ${bodyWithoutG}\n${svgCloseTag}`;
        }
    });

    return {
        combinedSvg: combinedSvgOpenTag + combinedSvgContent + svgCloseTag,
        individualSvgs: individualSvgs
    };
}