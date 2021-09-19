import React, { useState, useEffect } from "react";
// import { getRandomInt } from "./helpers";
import "./styles.css";
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
  const canvas4Ref = React.useRef(null);
  const canvas5Ref = React.useRef(null);

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
      const [outCanvas1, outCanvas2, outCanvas3, outCanvas4, outCanvas5] =
        createBlockCanvas(smallCanvas, params, words);

      const canvas1 = canvas1Ref.current;
      const canvas2 = canvas2Ref.current;
      const canvas3 = canvas3Ref.current;
      const canvas4 = canvas4Ref.current;
      const canvas5 = canvas5Ref.current;
      canvas1.width = outCanvas1.width;
      canvas1.height = outCanvas1.height;
      canvas2.width = outCanvas1.width;
      canvas2.height = outCanvas1.height;
      canvas3.width = outCanvas1.width;
      canvas3.height = outCanvas1.height;
      canvas4.width = outCanvas1.width;
      canvas4.height = outCanvas1.height;
      canvas5.width = outCanvas1.width;
      canvas5.height = outCanvas1.height;

      const ctx1 = canvas1.getContext("2d");
      const ctx2 = canvas2.getContext("2d");
      const ctx3 = canvas3.getContext("2d");
      const ctx4 = canvas4.getContext("2d");
      const ctx5 = canvas5.getContext("2d");

      ctx1.drawImage(outCanvas1, 0, 0);
      ctx2.drawImage(outCanvas2, 0, 0);
      ctx3.drawImage(outCanvas3, 0, 0);
      ctx4.drawImage(outCanvas4, 0, 0);
      ctx5.drawImage(outCanvas5, 0, 0);
    }
  }, [
    sourceImg,
    params.canvasWidth,
    params.lightColour,
    params.cellSize,
    params.brightnessSplit,
  ]);

  const onParamsChange = (newParams) => setParams(newParams);
  const onSaveCanvas = () => {
    console.log("save canvas here");
  };

  let styles1 = { position: "absolute" };
  styles1.width = params.fitToWidth ? "100%" : null;

  if (params.fitToHeight) {
    styles1.height = "100vh";
  }

  let styles2 = { ...styles1, zIndex: 2 };
  let styles3 = { ...styles1, zIndex: 3 };
  let styles4 = { ...styles1, zIndex: 4 };
  let styles5 = { ...styles1, zIndex: 4 };

  const offsetIncrease = 2.8;

  styles4.transform = `translate(${
    params.canvas1X * (offsetIncrease * 0.2)
  }px)`;
  styles3.transform = `translate(${
    params.canvas1X * (offsetIncrease * 0.4)
  }px)`;

  styles2.transform = `translate(${
    params.canvas1X * (offsetIncrease * 0.6)
  }px)`;
  styles1.transform = `translate(${params.canvas1X * offsetIncrease}px)`;

  return (
    <div>
      <Controls onChange={onParamsChange} onSaveCanvas={onSaveCanvas} />

      {/* BACKGROUND */}
      <canvas ref={canvas1Ref} style={styles1} />

      {/* Middle 1 */}
      <canvas ref={canvas2Ref} style={styles2} />

      {/* Middle 2 */}
      <canvas ref={canvas3Ref} style={styles3} />

      {/* Middle 2 */}
      <canvas ref={canvas4Ref} style={styles4} />

      {/* FOREGROUND */}
      <canvas ref={canvas5Ref} style={styles5} />
    </div>
  );
};

export default App;
