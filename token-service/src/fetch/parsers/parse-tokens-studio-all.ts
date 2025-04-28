import { locateValueFromPath } from "./utils.js";

type JsonObject = { [key: string]: any };

const replacements: { [key: string]: string } = {
  "atmosphere.colors": "color.base",
  "atmosphere.blending-mode": "content.base.blending-mode",
  "atmosphere.font-family": "content.base.font-family",
  "atmosphere.text-decoration": "content.base.text-decoration",
  "atmosphere.text-transform": "content.base.text-transform",
  "atmosphere.font-weight": "content.base.font-weight",
  "atmosphere.font-size": "size.base.font-size",
  "atmosphere.letter-spacing": "size.base.letter-spacing",
  "atmosphere.line-height": "size.base.line-height",
  "atmosphere.shadow": "size.base.shadow",
  "atmosphere.spacing": "size.base.spacing",
  "atmosphere.sizing": "size.base.sizing",
  "atmosphere.radius": "size.base.radius",
  "atmosphere.opacity": "opacity.base",
  "atmosphere.paragraphSpacing": "size.base.paragraphSpacing",
  "atmosphere.paragraphIndent": "size.base.paragraphIndent"
};

function replaceValuesInJson(obj: JsonObject, replacements: { [key: string]: string }): JsonObject {
  function traverseAndReplace(currentObject: any): any {
      if (Array.isArray(currentObject)) {
          // Process each item in the array recursively
          return currentObject.map(item => traverseAndReplace(item));
      } else if (currentObject !== null && typeof currentObject === 'object') {
          // If it's an object, process each key's value recursively
          const newObj: JsonObject = {};
          for (const key of Object.keys(currentObject)) {
              newObj[key] = traverseAndReplace(currentObject[key]);
          }
          return newObj;
      } else if (typeof currentObject === 'string') {
          // Check if the string contains any of the keys and replace them
          let replacedString = currentObject;
          for (const [key, value] of Object.entries(replacements)) {
              replacedString = replacedString.replace(new RegExp(key, 'g'), value);
          }
          return replacedString;
      }
      // Return the value unchanged if it's not a string or an object/array
      return currentObject;
  }

  return traverseAndReplace(obj);
}

export function parseAllTokensStudio(original: JsonObject): JsonObject {
  const result: JsonObject = { base: {}, alias: {} };

  function modifyPathSegment(segment: string): string | null {
    // Rename specific path segments based on rules
    if (segment === "Color/Light") return "light";
    if (segment === "Color/Dark") return "dark";
    if (segment === "Densities/Relaxed") return "relaxed";
    if (segment === "Densities/Condensed") return "condensed";
    if (segment.includes("Base/")) return "base";
    // Remove segments containing specific substrings
    if (segment.includes("atmosphere") || 
        segment.includes("colors") || 
        segment.includes("Typography")
        ) return null;
    // Return unmodified segment
    return segment;
  }

  function mapType(type) {
    const types = {
      "sizing": "size",
      "spacing": "size",
      "fontSizes": "size",
      "lineHeights": "size",
      "letterSpacing": "size",
      "borderRadius": "size",
      "number": "size",
      "borderWidth": "size",
      "text": "content",
      "textCase": "content",
      "fontWeights": "content",
      "fontFamilies": "content",
      "textDecoration" : "content"
    }
    return types[type] || type;
  }

  function mapBaseResponsiveTypeValues(tokensStudioData: JsonObject): JsonObject {
    // Make the object we'll use for mapping...
    let responsiveType = {
      ...tokensStudioData['Typography/Utils']['responsive-type'],
      ...tokensStudioData['Typography/Responsive']['responsive-type']
    };
    delete responsiveType.type;

    let base = tokensStudioData['Base/Typography'];

    function resolveDynamicTypeValue(ref: string): number {
      if (typeof ref === 'number') return ref;
      let expressionArray = ref.split(/[{}]+/);
      expressionArray.forEach((e, i) => {
        if (e.indexOf('atmosphere') >= 0) {
          expressionArray[i] = locateValueFromPath(base, `${e}.value`);
        }
        if (e.indexOf('responsive-type') >= 0) {
          e = e.replace(/responsive-type/g, 'responsiveType');
          let evaluatedExpression = eval(`${e}.value`);
          if (!isNaN(evaluatedExpression)) {
            expressionArray[i] = evaluatedExpression;
          } else {
            expressionArray[i] = `${resolveDynamicTypeValue(evaluatedExpression)}`;
          }
        }
      });
      var finalExpression = expressionArray.join('');
      if (!isNaN(parseFloat(finalExpression))) {
        return parseFloat(finalExpression);
      }
      else if (!isNaN(eval(`Math.${finalExpression}`))) {
        return eval(`Math.${finalExpression}`);
      }
      else {
        resolveDynamicTypeValue(finalExpression);
      }
    }
    for (const mode in responsiveType) {
      switch (mode) {
        case 'util':
          break;
        default:
          const TypeModes = responsiveType[mode];
          for (const key in TypeModes) {
            const TypeProperties = TypeModes[key];
            for (const key in TypeProperties) {
              const TypeBreakpoints = TypeProperties[key];
              for (const key in TypeBreakpoints) {
                let Breakpoint = TypeBreakpoints[key]
                let value = resolveDynamicTypeValue(Breakpoint.value);
                TypeBreakpoints[key] = { value }
              }
            }
          }
          break;

      }
    }
    delete responsiveType.util;
    return responsiveType;
  }

  function rebuildTypeStyleStruct(tokenStudioData: JsonObject, propertyNamesToFlatten: string[]) {
    let typeStyleStruct = {};

    function flattenValues(obj) {
      if (typeof obj !== 'object' || obj === null) {
          return obj;
      }
      if (obj.hasOwnProperty('value')) {
          return obj.value;
      }
      for (let key in obj) {
        if (propertyNamesToFlatten.includes(key)) {
          obj = { ...obj, ...obj[key] };
          delete obj[key]
        } else {
          obj[key] = flattenValues(obj[key]);
        }
      }
      for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            obj[key] = flattenValues(obj[key]);
          }
      }   
      return obj;
    }

    function amendStruct(obj) {
      const transformed = {};
      for (const key in obj) {
        if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const subObj = obj[key];
            // Check if the object is a terminal object (no nested objects)
            if (Object.values(subObj).some(value => typeof value === 'object' && value !== null && !Array.isArray(value))) {
                transformed[key] = amendStruct(subObj);
            } else {
                transformed[key] = { value: subObj, type: 'typography' };
            }
        } else {
            // For non-object values, just copy them over
            transformed[key] = obj[key];
        }
      }
      return transformed;
    }

    function getVariantValue(typography, size: string, category: string, variant: string, field: string) {
      // Safely retrieve the value from the object
      return typography[size]?.[category]?.[variant]?.value[field];
    }

    function getSubVariantValue(typography, size: string, category: string, variant: string, subvariant: string, field: string) {
      // Safely retrieve the value from the object
      return typography[size]?.[category]?.[variant]?.[subvariant]?.value[field];
    }

    function addMissingProperties(typography) {
      const sizes = ['l', 'm', 's', 'xs']; // Define the sizes to modify
      const fields = ['fontFamily', 'fontWeight', 'paragraphSpacing', 'paragraphIndent', 'textCase', 'textDecoration']; // Fields to check and copy
    
      sizes.forEach(size => {
        if (typography[size]) {
          const categories = Object.keys(typography[size]);
          categories.forEach(category => {
            const variants = Object.keys(typography[size][category]);
            variants.forEach(variant => {
              if (typography[size][category][variant].value) {
                fields.forEach(field => {
                  if (!getVariantValue(typography, size, category, variant, field)) { // Check if the field is missing
                    // Check and copy from 'xl' if exists
                    typography[size][category][variant].value[field] = typography.xl[category][variant]?.value[field];
                  }
                });
              }
              else {
                const subvariants = Object.keys(typography[size][category][variant]);
                subvariants.forEach(subvariant => {
                  fields.forEach(field => {
                    if (!getSubVariantValue(typography, size, category, variant, subvariant, field)) { // Check if the field is missing
                      // Check and copy from 'xl' if exists
                      typography[size][category][variant][subvariant].value[field] = typography.xl[category][variant][subvariant]?.value[field];
                    }
                  });
                });
              }
            });
          });
        }
      });
    }

    Object.keys(tokenStudioData).forEach(key => {
      if(key.includes('Breakpoint/Typography')) {
        let breakpoint = (key.split('/').pop().toLowerCase());
        typeStyleStruct[breakpoint] = tokenStudioData[key];
      }
    });

    typeStyleStruct = flattenValues(typeStyleStruct);
    typeStyleStruct = amendStruct(typeStyleStruct);

    addMissingProperties(typeStyleStruct);

    return typeStyleStruct;
  }

  function processResponsiveTypography(tokenStudioData: JsonObject): JsonObject {
    if (!tokenStudioData['Typography/Responsive']) {
      return tokenStudioData;
    }

    tokenStudioData['Typography'] = {'typography': {}}
    const updatedTypeStruct = rebuildTypeStyleStruct(tokenStudioData, ['atmosphere', 'typography']);
  
    result['base']['responsive-type'] = mapBaseResponsiveTypeValues(tokenStudioData);
  
    delete tokenStudioData['Breakpoint/Typography/XL'];
    delete tokenStudioData['Breakpoint/Typography/L'];
    delete tokenStudioData['Breakpoint/Typography/M'];
    delete tokenStudioData['Breakpoint/Typography/S'];
    delete tokenStudioData['Breakpoint/Typography/XS'];
    delete tokenStudioData['Typography/Styles'];
    delete tokenStudioData['Typography/Utils'];
    delete tokenStudioData['Typography/Responsive'];
  
    tokenStudioData['Typography']['typography'] = updatedTypeStruct;
    return tokenStudioData;
  }

  function processObject(obj: JsonObject, path: string[]) {

    Object.keys(obj).forEach(key => {
      const item = obj[key];
      if (typeof item === 'object' && item !== null) {
        if ('type' in item) {

          // Determine the group based on the presence of "Base/" in the path.
          const group = path.some(p => p.includes("Base/")) ? 'base' : 'alias';
          const type = mapType(item.type);

          // Initialize the structure if it does not exist.
          if (!result[group][type]) {
            result[group][type] = {};
          }

          // Navigate and create the structure in the result.
          let current = result[group][type];
          path.filter(p => modifyPathSegment(p) !== null).forEach(p => {
            const modifiedSegment = modifyPathSegment(p);
            // If the segment is equal to the type, don't create it (so we don't have repeating segments)
            if (modifiedSegment && modifiedSegment !== type) {
              if (!current[modifiedSegment]) {
                current[modifiedSegment] = {};
              }
              current = current[modifiedSegment];
            }
          });

          // Place the item under the correct group and type.
          current[key] = item;
          
        } else {
          // Continue traversing the object.
          const newPath = modifyPathSegment(key) !== null ? [...path, key] : path;
          processObject(item, newPath);
        }
      }
    });
  }

  // Start processing with an empty path.
  processObject(processResponsiveTypography(original), []);
  return replaceValuesInJson(result, replacements);
}