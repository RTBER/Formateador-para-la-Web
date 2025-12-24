
/**
 * Cleans up common typography issues in Spanish/Novel writing.
 */
export const fixTypography = (text: string): string => {
  return text
    // Em-dashes: --- or -- to —
    .replace(/---/g, '—')
    .replace(/--/g, '—')
    // Fix spaces around em-dashes for dialogues (standard Spanish rule)
    .replace(/^—\s+/gm, '—')
    // Smart quotes (optional, some people prefer them)
    .replace(/"([^"]*)"/g, '“$1”')
    // Double spaces
    .replace(/[ ]{2,}/g, ' ')
    // Remove spaces at the start of lines
    .replace(/^[ ]+/gm, '');
};
