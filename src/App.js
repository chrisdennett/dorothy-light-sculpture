import React, { useState, useEffect } from "react";
import useImageCanvas from "./hooks/useImageCanvas";
// import { getRandomInt } from "./helpers";
import "./styles.css";
import Controls from "./controls/Controls";
import { createBlockCanvas, createSmallCanvas } from "./canvasFunctions";
import { words } from "./words";
import {
  createBrightnessCanvas,
  createCroppedCanvas,
  createThresholdCanvas,
} from "./utils/UTILS";

// width = 293
// cellSize = 9
// warm white = #fdf4dc

const App = () => {
  const [params, setParams] = useState({});
  const [sourceImg, setSourceImg] = useState();
  // const [sourceImg, setSourceImg] = useState({ canvas: null, counter: 0 });

  const canvas1Ref = React.useRef(null);
  const canvas2Ref = React.useRef(null);
  const canvas3Ref = React.useRef(null);
  const canvas4Ref = React.useRef(null);
  const canvas5Ref = React.useRef(null);

  const url = params && params.image ? `img/${params.image}` : null;

  // useImageCanvas(url, (canvas) => {
  //   setSourceImg((prev) => {
  //     return { canvas, counter: prev + 1 };
  //   });
  // });

  // LOAD IMAGE
  useEffect(() => {
    if (!sourceImg) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = () => {
        setSourceImg(image);
      };
      image.src = "img/pic-5.png";
    }
    // image.src = "img/" + params.image;
  }, [sourceImg]);

  // CREATE CANVAS
  useEffect(() => {
    if (sourceImg && params.cellSize > 0) {
      const crop = {
        left: params.cropLeft,
        right: params.cropRight,
        top: params.cropTop,
        bottom: params.cropBottom,
      };

      const croppedCanvas = createCroppedCanvas(sourceImg, crop);

      const smallCanvas = createSmallCanvas(croppedCanvas, params.canvasWidth);

      const brightnessCanvas = createBrightnessCanvas(smallCanvas, {
        brightnessAdjust: params.brightnessAdjust,
      });

      const contrastCanvas = createThresholdCanvas(
        brightnessCanvas,
        params.contrast
      );

      const [outCanvas1, outCanvas2, outCanvas3, outCanvas4, outCanvas5] =
        createBlockCanvas(contrastCanvas, params, words);

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
    params.brightnessAdjust,
    params.contrast,
    params.bgColour,
    params.cropLeft,
    params.cropTop,
    params.cropRight,
    params.cropBottom,
  ]);

  const onParamsChange = (newParams) => setParams(newParams);
  // const onSaveCanvas = () => {
  //   saveCanvas({ name: "canvas2", canvasId: "canvas2" });
  // };

  const fitToWidth = params.viewSize === "fitToWidth";
  const fitToHeight = params.viewSize === "fitToHeight";

  let styles1 = { position: "absolute" };
  styles1.width = fitToWidth ? "100%" : null;

  if (fitToHeight) {
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
      <Controls onChange={onParamsChange} />

      {/* BACKGROUND */}
      <canvas
        ref={canvas1Ref}
        style={{ ...styles1, display: params.showLayer1 ? "inherit" : "none" }}
        id="canvas1"
      />

      {/* Middle 1 */}
      <canvas
        ref={canvas2Ref}
        style={{ ...styles2, display: params.showLayer2 ? "inherit" : "none" }}
        id="canvas2"
      />

      {/* Middle 2 */}
      <canvas
        ref={canvas3Ref}
        style={{ ...styles3, display: params.showLayer3 ? "inherit" : "none" }}
        id="canvas3"
      />

      {/* Middle 2 */}
      <canvas
        ref={canvas4Ref}
        style={{ ...styles4, display: params.showLayer4 ? "inherit" : "none" }}
        id="canvas4"
      />

      {/* FOREGROUND */}
      <canvas
        ref={canvas5Ref}
        style={{ ...styles5, display: params.showLayer5 ? "inherit" : "none" }}
        id="canvas5"
      />
    </div>
  );
};

export default App;
