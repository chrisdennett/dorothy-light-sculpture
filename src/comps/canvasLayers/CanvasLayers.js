import React, { useEffect } from "react";
import { createBlockCanvas } from "../../canvasFunctions";
import { words } from "../../words";
import styles from "./canvasLayers.module.css";

export default function CanvasLayers({ inputCanvas, params }) {
  const canvas1Ref = React.useRef(null);
  const canvas2Ref = React.useRef(null);
  const canvas3Ref = React.useRef(null);
  const canvas4Ref = React.useRef(null);
  const canvas5Ref = React.useRef(null);

  useEffect(() => {
    if (!inputCanvas) return;

    const [outCanvas1, outCanvas2, outCanvas3, outCanvas4, outCanvas5] =
      createBlockCanvas(inputCanvas, params, words);

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
  }, [
    inputCanvas,
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
    params.outputType,
  ]);

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
    <div className={styles.canvasLayers}>
      {/* BACKGROUND */}
      <canvas
        id="canvas-1"
        ref={canvas1Ref}
        style={{
          ...styles1,
          display: params.showLayer1 ? "inherit" : "none",
        }}
        id="canvas1"
      />

      {/* Middle 1 */}
      <canvas
        id="canvas-2"
        ref={canvas2Ref}
        style={{
          ...styles2,
          display: params.showLayer2 ? "inherit" : "none",
        }}
        id="canvas2"
      />

      {/* Middle 2 */}
      <canvas
        id="canvas-3"
        ref={canvas3Ref}
        style={{
          ...styles3,
          display: params.showLayer3 ? "inherit" : "none",
        }}
        id="canvas3"
      />

      {/* Middle 2 */}
      <canvas
        id="canvas-4"
        ref={canvas4Ref}
        style={{
          ...styles4,
          display: params.showLayer4 ? "inherit" : "none",
        }}
        id="canvas4"
      />

      {/* FOREGROUND */}
      <canvas
        id="canvas-5"
        ref={canvas5Ref}
        style={{
          ...styles5,
          display: params.showLayer5 ? "inherit" : "none",
        }}
        id="canvas5"
      />
    </div>
  );
}
