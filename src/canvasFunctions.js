export const createBlockCanvas = (inputCanvas, params, words) => {
  const { cellSize, lightColour } = params;

  const { width: inputW, height: inputH } = inputCanvas;

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = inputW * cellSize;
  outputCanvas.height = inputH * cellSize;
  const outputCtx = outputCanvas.getContext("2d");

  const inputCtx = inputCanvas.getContext("2d");
  let imgData = inputCtx.getImageData(0, 0, inputW, inputH);
  let pixels = imgData.data;

  let r, g, b, a, grey;
  // const colourOptions = ["red", "green", "blue", "white"];
  // const randIndex = getRandomInt(0, 3);

  const letters = words.split("");
  let currLetterIndex = 0;
  const maxFontSize = cellSize * 1.8;

  for (let y = 0; y < inputH; y++) {
    for (let x = 0; x < inputW; x++) {
      const i = (y * inputW + x) * 4;

      r = pixels[i];
      g = pixels[i + 1];
      b = pixels[i + 2];
      a = pixels[i + 3];

      grey = r * 0.2126 + g * 0.7152 + b * 0.0722;

      const decimalPercentage = grey / 255;
      let fontSize;
      let fontColour;

      if (a > 200 && decimalPercentage > 0.01) {
        fontSize = maxFontSize * decimalPercentage;
        fontColour = lightColour;
      } else {
        fontSize = maxFontSize;
        fontColour = "green";
      }
      const character = letters[currLetterIndex];
      currLetterIndex++;
      if (currLetterIndex >= letters.length) currLetterIndex = 0;

      outputCtx.fillStyle = fontColour;
      outputCtx.save();
      outputCtx.beginPath();
      outputCtx.translate(x * cellSize, y * cellSize);

      outputCtx.font = `${fontSize}px 'Dancing Script'`;
      outputCtx.fillText(character, 0, 0);
      // outputCtx.arc(0, 0, diam / 2, 0, 2 * Math.PI);
      outputCtx.fill();
      outputCtx.restore();
    }
  }

  return outputCanvas;
};

export const createSmallCanvas = (source, maxWidth, maxHeight) => {
  const sourceW = source.width;
  const sourceH = source.height;

  const wToHRatio = sourceH / sourceW;
  const hToWRatio = sourceW / sourceH;

  // allow maxHeight or maxWidth to be null
  if (!maxWidth) maxWidth = source.width;
  if (!maxHeight) maxHeight = source.height;

  let targetW = maxWidth;
  let targetH = targetW * wToHRatio;

  if (sourceH > maxHeight) {
    targetH = maxHeight;
    targetW = targetH * hToWRatio;
  }

  const smallCanvas = document.createElement("canvas");
  const ctx = smallCanvas.getContext("2d");
  smallCanvas.width = targetW;
  smallCanvas.height = targetH;

  ctx.drawImage(source, 0, 0, sourceW, sourceH, 0, 0, targetW, targetH);

  return smallCanvas;
};
