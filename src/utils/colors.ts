// Color palette for candies at different sizes
const COLOR_PALETTES = [
  '#FF8A80', // Small size - Red
  '#FFD180', // Orange
  '#FFFF8D', // Yellow
  '#CCFF90', // Green
  '#80D8FF', // Blue
  '#EA80FC', // Large size - Purple
];

export const generateRandomColor = (sizeIndex: number) => {
  // Return color based on size
  return COLOR_PALETTES[sizeIndex % COLOR_PALETTES.length];
};
