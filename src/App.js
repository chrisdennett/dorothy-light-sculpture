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

  const canvas1Ref = React.useRef(null);
  const canvas2Ref = React.useRef(null);
  const canvas3Ref = React.useRef(null);

  // LOAD IMAGE
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

  // CREATE CANVAS
  useEffect(() => {
    if (sourceImg && params.cellSize > 0) {
      const smallCanvas = createSmallCanvas(sourceImg, params.canvasWidth);
      const [outCanvas1, outCanvas2, outCanvas3] = createBlockCanvas(
        smallCanvas,
        params,
        words
      );

      const canvas1 = canvas1Ref.current;
      const canvas2 = canvas2Ref.current;
      const canvas3 = canvas3Ref.current;
      canvas1.width = outCanvas1.width;
      canvas1.height = outCanvas1.height;
      canvas2.width = outCanvas1.width;
      canvas2.height = outCanvas1.height;
      canvas3.width = outCanvas1.width;
      canvas3.height = outCanvas1.height;

      const ctx1 = canvas1.getContext("2d");
      const ctx2 = canvas2.getContext("2d");
      const ctx3 = canvas3.getContext("2d");

      ctx1.drawImage(outCanvas1, 0, 0);
      ctx2.drawImage(outCanvas2, 0, 0);
      ctx3.drawImage(outCanvas3, 0, 0);
    }
  }, [sourceImg, params.canvasWidth, params.lightColour, params.cellSize]);

  const onParamsChange = (newParams) => setParams(newParams);
  const onSaveCanvas = () => {
    console.log("save canvas here");
  };

  let styles1 = { position: "fixed" };
  styles1.width = params.fitToWidth ? "100%" : null;

  if (params.fitToHeight) {
    styles1.height = "100vh";
  }

  let styles2 = { ...styles1, zIndex: 2 };
  let styles3 = { ...styles1, zIndex: 3 };

  const offsetIncrease = 1.8;

  styles2.transform = `translate(${params.canvas1X}px)`;
  styles1.transform = `translate(${params.canvas1X * offsetIncrease}px)`;

  return (
    <div>
      <Controls onChange={onParamsChange} onSaveCanvas={onSaveCanvas} />

      {/* BACKGROUND */}
      <canvas ref={canvas1Ref} style={styles1} />

      <canvas ref={canvas2Ref} style={styles2} />

      {/* FOREGROUND */}
      <canvas ref={canvas3Ref} style={styles3} />
    </div>
  );
};

export default App;
