const demo = () => 'Boeing DLS Global Asset Library';

// eslint-disable-next-line no-console
console.log(demo());

function fetchAndCreateSvgUseElements(svgFilePath, containerId) {
    fetch(svgFilePath)
      .then(response => response.text())
      .then(svgContent => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        const symbols = svgDoc.querySelectorAll('symbol');
        const symbolIds = Array.from(symbols).map(symbol => symbol.id);

        createSvgUseElements(containerId, svgFilePath, symbolIds);
      })
      .catch(error => console.error('Error fetching SVG:', error));
  }

  function createSvgUseElements(containerId, svgFilePath, symbolIds) {
    const svgContainer = document.getElementById(containerId);
    if (!svgContainer) return false;
    symbolIds.forEach(symbolId => {
      const svgWrapper = document.createElement('div');
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgElement.classList.add(symbolId);
      svgElement.setAttribute('viewBox', '0 0 24 24'); 

      const useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      useElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `${svgFilePath}#${symbolId}`);

      svgElement.appendChild(useElement);
      svgWrapper.appendChild(svgElement);
      svgContainer.appendChild(svgWrapper);
    });
  }

  const svgFilePath = '../images/icons/svgSet.svg';
  const containerId = 'icons-container';

  fetchAndCreateSvgUseElements(svgFilePath, containerId);