import React, { useState, useEffect } from "react";
// import { getRandomInt } from "./helpers";
import "./styles.css";

const App = () => {
  const [sourceImg, setSourceImg] = useState(null);
  const canvasRef = React.useRef(null);
  const maxWidth = 260;
  const blockSize = 9;
  const maxHeight = null;

  useEffect(() => {
    if (!sourceImg) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = () => {
        setSourceImg(image);

        const smallCanvas = createSmallCanvas(image, maxWidth, maxHeight);
        const blockCanvas = createBlockCanvas(smallCanvas, blockSize);
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = blockCanvas.width;
        canvasRef.current.height = blockCanvas.height;
        drawCanvas(ctx, blockCanvas);
      };
      image.src = "dorothy-wordsworth-light-sculpture-no-bg.png";
    }
  }, [sourceImg]);

  return <canvas ref={canvasRef} />;
};

export default App;

const words = "The quick brown fox jumps over the lazy dog.";

const drawCanvas = (ctx, source) => {
  ctx.drawImage(source, 0, 0);
};

const createSmallCanvas = (source, maxWidth, maxHeight) => {
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

const createBlockCanvas = (inputCanvas, blockSize) => {
  const { width: inputW, height: inputH } = inputCanvas;

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = inputW * blockSize;
  outputCanvas.height = inputH * blockSize;
  const outputCtx = outputCanvas.getContext("2d");

  const inputCtx = inputCanvas.getContext("2d");
  let imgData = inputCtx.getImageData(0, 0, inputW, inputH);
  let pixels = imgData.data;

  let r, g, b, a, grey;
  // const colourOptions = ["red", "green", "blue", "white"];
  // const randIndex = getRandomInt(0, 3);
  const colour = "white";

  const letters = words.split("");
  let currLetterIndex = 0;

  for (let y = 0; y < inputH; y++) {
    for (let x = 0; x < inputW; x++) {
      const i = (y * inputW + x) * 4;

      r = pixels[i];
      g = pixels[i + 1];
      b = pixels[i + 2];
      a = pixels[i + 3];

      grey = r * 0.2126 + g * 0.7152 + b * 0.0722;

      const decimalPercentage = grey / 255;
      if (a > 200 && decimalPercentage > 0.01) {
        const character = letters[currLetterIndex];
        currLetterIndex++;
        if (currLetterIndex >= letters.length) currLetterIndex = 0;

        outputCtx.fillStyle = colour;
        outputCtx.save();
        outputCtx.beginPath();
        outputCtx.translate(x * blockSize, y * blockSize);

        const fontSize = blockSize * decimalPercentage * 1.8;
        outputCtx.font = `${fontSize}px 'Dancing Script'`;
        outputCtx.fillText(character, 0, 0);
        // outputCtx.arc(0, 0, diam / 2, 0, 2 * Math.PI);
        outputCtx.fill();
        outputCtx.restore();
      }
    }
  }

  return outputCanvas;
};

// const getRandomColour = () => {
//   const hue = Math.random() * 255;
//   return `hsl(${hue}, ${190}%, ${20}%)`;
// };
