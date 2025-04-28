import hexRgb from "hex-rgb";

export function locateValueFromPath(obj, path) {
  path = path.split('.');
  var arrayPattern = /(.+)\[(\d+)\]/;
  for (var i = 0; i < path.length; i++) {
    var match = arrayPattern.exec(path[i]);
    if (match) {
      obj = obj[match[1]][parseInt(match[2])];
    } else {
      obj = obj[path[i]];
    }
  }
  return obj;
}

/** 
  Transforms the matched string into a valid rgba string by converting the hexadecimal 
  color to its RGB components and retaining the alpha value 
**/
export function formatRgba(value) {
  return value.replace(/rgba\(\s*(#[0-9a-fA-F]{6})\s*,\s*([01](?:\.\d+)?)\s*\)/g, (_match, hex, alpha) => {
    const { red, green, blue } = hexRgb(hex);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  });
}