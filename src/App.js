import React, { useState, useEffect } from "react";
// import { getRandomInt } from "./helpers";
import "./styles.css";
import { saveAs } from "file-saver";
import Controls from "./controls/Controls";
import { createBlockCanvas, createSmallCanvas } from "./canvasFunctions";
import { words } from "./words";

// width = 260
// cellSize = 9
// warm white = #fdf4dc

const App = () => {
  const [sourceImg, setSourceImg] = useState(null);
  const [params, setParams] = useState({});

  const canvasRef = React.useRef(null);

  useEffect(() => {
    if (!sourceImg) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = () => {
        setSourceImg(image);
      };
      image.src = "dorothy-wordsworth-light-sculpture-no-bg.png";
    }
  }, [sourceImg]);

  useEffect(() => {
    if (sourceImg && params.cellSize > 0) {
      const smallCanvas = createSmallCanvas(sourceImg, params.canvasWidth);
      const blockCanvas = createBlockCanvas(smallCanvas, params, words);
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = blockCanvas.width;
      canvasRef.current.height = blockCanvas.height;
      ctx.drawImage(blockCanvas, 0, 0);
    }
  }, [sourceImg, params.canvasWidth, params.lightColour, params.cellSize]);

  const onParamsChange = (newParams) => setParams(newParams);
  const onSaveCanvas = () => onSave();

  let styles = {};
  styles.width = params.fitToWidth ? "100%" : null;

  if (params.fitToHeight) {
    styles.height = "100vh";
  }

  styles.transform = `translate(${params.canvas1X}px)`;

  return (
    <div>
      <Controls onChange={onParamsChange} onSaveCanvas={onSaveCanvas} />
      <canvas ref={canvasRef} style={styles} />
    </div>
  );
};

export default App;

const onSave = () => {
  var canvas = document.getElementById("dorothycanvas");

  if (!canvas) return;
  canvas.toBlob(
    (blob) => {
      saveAs(blob, `borg-flake.jpg`);
    },
    "image/jpeg",
    0.95
  );
};
