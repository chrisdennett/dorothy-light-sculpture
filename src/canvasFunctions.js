import { saveAs } from "file-saver";

export const createBlockCanvas = (inputCanvas, params, words) => {
  const { cellSize, lightColour, bgColour, brightnessSplit } = params;

  const { width: inputW, height: inputH } = inputCanvas;

  const outCanvas1 = document.createElement("canvas");
  const outCanvas2 = document.createElement("canvas");
  const outCanvas3 = document.createElement("canvas");
  const outCanvas4 = document.createElement("canvas");
  const outCanvas5 = document.createElement("canvas");

  outCanvas1.width = inputW * cellSize;
  outCanvas1.height = inputH * cellSize;
  outCanvas2.width = outCanvas1.width;
  outCanvas2.height = outCanvas1.height;
  outCanvas3.width = outCanvas1.width;
  outCanvas3.height = outCanvas1.height;
  outCanvas4.width = outCanvas1.width;
  outCanvas4.height = outCanvas1.height;
  outCanvas5.width = outCanvas1.width;
  outCanvas5.height = outCanvas1.height;

  const outputCtx1 = outCanvas1.getContext("2d");
  const outputCtx2 = outCanvas2.getContext("2d");
  const outputCtx3 = outCanvas3.getContext("2d");
  const outputCtx4 = outCanvas4.getContext("2d");
  const outputCtx5 = outCanvas5.getContext("2d");

  const inputCtx = inputCanvas.getContext("2d");
  let imgData = inputCtx.getImageData(0, 0, inputW, inputH);
  let pixels = imgData.data;

  let r, g, b, a, grey;
  // const colourOptions = ["red", "green", "blue", "white"];
  // const randIndex = getRandomInt(0, 3);

  const letters = words.split("");
  let currLetterIndex = 0;
  const maxFontSize = (cellSize * 1.15).toFixed(2);
  let smallestFontSize = 9999;

  const minFontSize = 2;
  const fontSizeRange = maxFontSize - minFontSize;

  const layerLetterCounts = [0, 0, 0, 0];

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
      let targCtx;

      fontSize = (minFontSize + fontSizeRange * decimalPercentage).toFixed(2);
      fontColour = lightColour;

      if (a <= 200 && decimalPercentage <= 0.01) {
        targCtx = outputCtx1;
        fontSize = maxFontSize;
        fontColour = bgColour; //"rgb(32, 32, 32)";
      } else if (decimalPercentage < brightnessSplit[0]) {
        layerLetterCounts[0]++;
        targCtx = outputCtx2;
      } else if (decimalPercentage < brightnessSplit[1]) {
        layerLetterCounts[1]++;
        targCtx = outputCtx3;
      } else if (decimalPercentage < brightnessSplit[2]) {
        layerLetterCounts[2]++;
        targCtx = outputCtx4;
      } else {
        layerLetterCounts[3]++;
        targCtx = outputCtx5;
      }

      if (targCtx) {
        let character = letters[currLetterIndex];
        currLetterIndex++;
        if (currLetterIndex >= letters.length) {
          currLetterIndex = 0;
          // character = "8";
        }

        targCtx.save();
        targCtx.beginPath();
        targCtx.translate(x * cellSize, cellSize + y * cellSize);

        targCtx.fillStyle = fontColour;
        targCtx.font = `italic ${fontSize}px 'Xanh Mono'`;
        targCtx.fillText(character, 0, 0);
        targCtx.fill();
        targCtx.restore();

        if (fontSize < smallestFontSize && fontSize > 0) {
          console.log("smallestFontSize: ", smallestFontSize);
          smallestFontSize = fontSize;
        }
      }
    }
  }

  console.log("smallestFontSize: ", smallestFontSize);
  console.log("layerLetterCounts: ", layerLetterCounts);
  const total =
    layerLetterCounts[0] +
    layerLetterCounts[1] +
    layerLetterCounts[2] +
    layerLetterCounts[3];
  console.log("total: ", total);
  const idealLayerTally = Math.round(total / 4);
  console.log("idealLayerTally: ", idealLayerTally);

  const canvasWidth = outCanvas1.width;
  const canvasHeight = outCanvas1.height;

  const widthInMM = Math.round(canvasWidth * 0.2645833333);
  const heightInMM = Math.round(canvasHeight * 0.2645833333);

  console.log("widthInMM: ", widthInMM);
  console.log("heightInMM: ", heightInMM);
  console.log("----");

  return [outCanvas1, outCanvas2, outCanvas3, outCanvas4, outCanvas5];
};

// SMALL CANVAS
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

// SAVE AS PNG
export const saveCanvas = ({
  name = "dorothycanvas1",
  canvasId = "canvas2",
}) => {
  var canvas = document.getElementById(canvasId);

  if (!canvas) return;

  canvas.toBlob(
    (blob) => {
      saveAs(blob, `${name}.png`);
    },
    "image/png",
    0.95
  );
};
