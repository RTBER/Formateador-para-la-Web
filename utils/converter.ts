import { ImagePlaceholder } from '../types';

/**
 * Parses the raw text to find image placeholders.
 * Returns an array of placeholders to populate the UI inputs.
 */
export const detectPlaceholders = (text: string): ImagePlaceholder[] => {
  const lines = text.split(/\r?\n/);
  const placeholders: ImagePlaceholder[] = [];
  let imgCount = 0;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed === 'IMAGE') {
      placeholders.push({
        id: `img-${imgCount++}`,
        type: 'VERTICAL',
        index: idx,
        url: ''
      });
    } else if (trimmed === 'IMAGEU') {
      placeholders.push({
        id: `img-${imgCount++}`,
        type: 'HORIZONTAL',
        index: idx,
        url: ''
      });
    }
  });

  return placeholders;
};

/**
 * Converts the raw text into the target HTML format using the provided image URLs.
 */
export const convertToHtml = (text: string, images: ImagePlaceholder[]): string => {
  const lines = text.split(/\r?\n/);
  let imagePointer = 0;
  
  const processedLines = lines.map((line) => {
    const trimmed = line.trim();

    // Skip empty lines (optional, but usually good for HTML output cleanup)
    if (!trimmed) return '';

    // 1. Handle Vertical Image (IMAGE)
    if (trimmed === 'IMAGE') {
      const imgData = images[imagePointer];
      imagePointer++;
      // If user provided a URL, use it, otherwise use a placeholder or empty
      const src = imgData?.url || 'https://via.placeholder.com/300x500?text=Vertical+Image';
      return `<img src="${src}" alt="Escena del castillo">`;
    }

    // 2. Handle Horizontal Image (IMAGEU)
    if (trimmed === 'IMAGEU') {
      const imgData = images[imagePointer];
      imagePointer++;
      const src = imgData?.url || 'https://via.placeholder.com/800x400?text=Horizontal+Image';
      return `<img src="${src}" \n     alt="Escena importante" \n     class="imagen-unica">`;
    }

    // 3. Handle Separator (◇ ◆ ◇ ◆ ◇)
    // We use a regex to be slightly flexible with spacing, though the prompt was specific.
    if (/^◇\s?◆\s?◇\s?◆\s?◇$/.test(trimmed)) {
      return `<p class="separador">${trimmed}</p>`;
    }

    // 4. Handle Standard Paragraphs
    return `<p>${trimmed}</p>`;
  });

  // Join with newlines and filter out completely empty strings resulting from empty input lines
  return processedLines.filter(line => line !== '').join('\n\n');
};