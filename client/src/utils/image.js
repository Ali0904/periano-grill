export const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>` +
      `<rect width='100%' height='100%' fill='#FFC400'/>` +
      `<text x='50%' y='50%' font-family='Arial' font-size='22' font-weight='800' fill='#1c1c1c' text-anchor='middle' dominant-baseline='middle'>Periano Grill</text>` +
      `</svg>`
  );

export const handleImgError = (e) => {
  if (e.target.src !== FALLBACK_IMG) e.target.src = FALLBACK_IMG;
};
