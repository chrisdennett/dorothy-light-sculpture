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
      const [outCanvas1, outCanvas2] = createBlockCanvas(
        smallCanvas,
        params,
        words
      );

      const canvas1 = canvas1Ref.current;
      const canvas2 = canvas2Ref.current;
      canvas1.width = outCanvas1.width;
      canvas1.height = outCanvas1.height;
      canvas2.width = outCanvas1.width;
      canvas2.height = outCanvas1.height;

      const ctx1 = canvas1.getContext("2d");
      const ctx2 = canvas2.getContext("2d");

      ctx1.drawImage(outCanvas2, 0, 0);
      ctx2.drawImage(outCanvas1, 0, 0);
    }
  }, [sourceImg, params.canvasWidth, params.lightColour, params.cellSize]);

  const onParamsChange = (newParams) => setParams(newParams);
  const onSaveCanvas = () => {
    console.log("save canvas here");
  };

  let styles1 = { position: "absolute" };
  styles1.width = params.fitToWidth ? "100%" : null;

  if (params.fitToHeight) {
    styles1.height = "100vh";
  }

  let styles2 = { ...styles1 };

  styles1.transform = `translate(${params.canvas1X}px)`;
  styles2.transform = `translate(${params.canvas1X * 1.8}px)`;

  return (
    <div>
      <Controls onChange={onParamsChange} onSaveCanvas={onSaveCanvas} />
      <canvas ref={canvas1Ref} style={styles1} />
      <canvas ref={canvas2Ref} style={styles2} />
    </div>
  );
};

export default App;
