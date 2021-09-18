import React, { useState, useEffect } from "react";

const App = () => {
  const [sourceImg, setSourceImg] = useState(null);
  const canvasRef = React.useRef(null);
  const maxWidth = 80;
  const maxHeight = null;

  useEffect(() => {
    if (!sourceImg) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = () => {
        setSourceImg(image);

        const smallCanvas = createSmallCanvas(image, maxWidth, maxHeight);
        const blockCanvas = createBlockCanvas(smallCanvas, 5);
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = blockCanvas.width;
        canvasRef.current.height = blockCanvas.height;
        drawCanvas(ctx, blockCanvas);
      };
      image.src = "dorothy-wordsworth-light-sculpture.png";
    }
  }, [sourceImg]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
};

export default App;

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

  let r, g, b, grey;
  const colour = "purple";

  for (let y = 0; y < inputH; y++) {
    for (let x = 0; x < inputW; x++) {
      const i = (y * inputW + x) * 4;

      r = pixels[i];
      g = pixels[i + 1];
      b = pixels[i + 2];
      // a = pixels[i + 3];

      grey = r * 0.2126 + g * 0.7152 + b * 0.0722;

      const decimalPercentage = 1 - grey / 255;
      const diam = blockSize * decimalPercentage * 1.3;

      outputCtx.fillStyle = colour;
      outputCtx.beginPath();
      outputCtx.arc(x * blockSize, y * blockSize, diam / 2, 0, 2 * Math.PI);
      outputCtx.fill();
    }
  }

  return outputCanvas;
};

// const getRandomColour = () => {
//   const hue = Math.random() * 255;
//   return `hsl(${hue}, ${190}%, ${20}%)`;
// };
