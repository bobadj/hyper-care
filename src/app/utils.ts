export const generateMonochromeRamp = (
  count: number,
  startLightness = 80,
  endLightness = 30,
  hue = 0,
  saturation = 0,
): string[] => {
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    const lightness =
      startLightness -
      ((startLightness - endLightness) * i) / Math.max(1, count - 1);

    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
};
