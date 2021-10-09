import React from "react";
import styles from "./svgLayers.module.css";

export default function SvgLayers({ inputCanvas, params }) {
  const fitToWidth = params.viewSize === "fitToWidth";
  const fitToHeight = params.viewSize === "fitToHeight";

  const imgWidth = inputCanvas ? inputCanvas.width : 100;
  const imgHeight = inputCanvas ? inputCanvas.height : 200;
  const wToHRatio = imgHeight / imgWidth;
  const svgWidth = params.canvasWidth * params.cellSize;
  const svgHeight = svgWidth * wToHRatio;

  let svgHolderStyle = {};
  if (fitToHeight) {
    svgHolderStyle.height = "100vh";
  } else if (fitToWidth) {
    svgHolderStyle.width = "100vw";
  } else {
    svgHolderStyle.width = svgWidth;
    svgHolderStyle.height = svgHeight;
  }

  return (
    <div className={styles.svgLayers}>
      <div
        style={{
          display: params.outputType === "svg" ? "inherit" : "none",
          margin: 10,
          ...svgHolderStyle,
        }}
      >
        <svg
          id="svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            background: "white",
          }}
        ></svg>
      </div>
    </div>
  );
}
