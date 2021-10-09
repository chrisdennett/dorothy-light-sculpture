import React, { useEffect, useState } from "react";
import { words } from "../../words";
import styles from "./svgLayers.module.css";

export default function SvgLayers({ inputCanvas, params }) {
  const [layers, setLayers] = useState(null);

  useEffect(() => {
    if (!inputCanvas) return;
    const layerGroups = getLayerData(inputCanvas, params, words);
    setLayers(layerGroups);
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

  const offsetIncrease = 2.8;

  const styles4 = `translate(${params.canvas1X * (offsetIncrease * 0.2)}, 0)`;
  const styles3 = `translate(${params.canvas1X * (offsetIncrease * 0.4)}, 0)`;
  const styles2 = `translate(${params.canvas1X * (offsetIncrease * 0.6)}, 0)`;
  const styles1 = `translate(${params.canvas1X * offsetIncrease}, 0)`;

  if (!layers || layers.length < 4) return null;

  return (
    <div className={styles.svgLayers}>
      <div
        style={{
          display: params.outputType === "svg" ? "inherit" : "none",
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
          }}
        >
          <g
            fontFamily="Dancing Script"
            textAnchor="start"
            alignmentBaseline="hanging"
          >
            <g id="group-1" fill={params.bgColour}>
              {layers[0].map((grp, i) => (
                <text
                  key={`g5-${i}`}
                  x={grp.x}
                  y={grp.y}
                  fontSize={grp.fontSize}
                >
                  {grp.character}
                </text>
              ))}
            </g>

            <g id="group-2" fill={params.lightColour} transform={styles1}>
              {layers[1].map((grp, i) => (
                <text
                  key={`g2-${i}`}
                  x={grp.x}
                  y={grp.y}
                  fontSize={grp.fontSize}
                >
                  {grp.character}
                </text>
              ))}
            </g>

            <g id="group-3" fill={params.lightColour} transform={styles2}>
              {layers[2].map((grp, i) => (
                <text
                  key={`g3-${i}`}
                  x={grp.x}
                  y={grp.y}
                  fontSize={grp.fontSize}
                >
                  {grp.character}
                </text>
              ))}
            </g>

            <g id="group-4" fill={params.lightColour} transform={styles3}>
              {layers[3].map((grp, i) => (
                <text
                  key={`g4-${i}`}
                  x={grp.x}
                  y={grp.y}
                  fontSize={grp.fontSize}
                >
                  {grp.character}
                </text>
              ))}
            </g>

            <g id="group-5" fill={params.lightColour} transform={styles4}>
              {layers[4].map((grp, i) => (
                <text
                  key={`g5-${i}`}
                  x={grp.x}
                  y={grp.y}
                  fontSize={grp.fontSize}
                >
                  {grp.character}
                </text>
              ))}
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

const createSvgLayers = (params) => {
  const offsetIncrease = 2.8;

  const styles4 = `translate(${params.canvas1X * (offsetIncrease * 0.2)}, 0)`;
  const styles3 = `translate(${params.canvas1X * (offsetIncrease * 0.4)}, 0)`;
  const styles2 = `translate(${params.canvas1X * (offsetIncrease * 0.6)}, 0)`;
  const styles1 = `translate(${params.canvas1X * offsetIncrease}, 0)`;

  return (
    <>
      <g
        fontFamily="Dancing Script"
        textAnchor="start"
        alignmentBaseline="hanging"
      >
        <g id="group-1" fill={params.bgColour}>
          {group1.map((grp, i) => (
            <text key={`g5-${i}`} x={grp.x} y={grp.y} fontSize={grp.fontSize}>
              {grp.character}
            </text>
          ))}
        </g>

        <g id="group-2" fill={params.lightColour} transform={styles1}>
          {group2.map((grp, i) => (
            <text key={`g2-${i}`} x={grp.x} y={grp.y} fontSize={grp.fontSize}>
              {grp.character}
            </text>
          ))}
        </g>

        <g id="group-3" fill={params.lightColour} transform={styles2}>
          {group3.map((grp, i) => (
            <text key={`g3-${i}`} x={grp.x} y={grp.y} fontSize={grp.fontSize}>
              {grp.character}
            </text>
          ))}
        </g>

        <g id="group-4" fill={params.lightColour} transform={styles3}>
          {group4.map((grp, i) => (
            <text key={`g4-${i}`} x={grp.x} y={grp.y} fontSize={grp.fontSize}>
              {grp.character}
            </text>
          ))}
        </g>

        <g id="group-5" fill={params.lightColour} transform={styles4}>
          {group5.map((grp, i) => (
            <text key={`g5-${i}`} x={grp.x} y={grp.y} fontSize={grp.fontSize}>
              {grp.character}
            </text>
          ))}
        </g>
      </g>
    </>
  );
};

const getLayerData = (inputCanvas, params, words) => {
  const { cellSize, lightColour, bgColour, brightnessSplit } = params;
  const { width: inputW, height: inputH } = inputCanvas;

  const row1 = [];
  const row2 = [];
  const row3 = [];
  const row4 = [];
  const row5 = [];

  const inputCtx = inputCanvas.getContext("2d");
  let imgData = inputCtx.getImageData(0, 0, inputW, inputH);
  let pixels = imgData.data;

  let r, g, b, a, grey;

  const letters = words.split("");
  let currLetterIndex = 0;
  const maxFontSize = cellSize * 1.8;

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
      let targetGroup;

      if (a <= 200 && decimalPercentage <= 0.01) {
        targetGroup = row1;
        fontSize = maxFontSize;
        fontColour = bgColour; //"rgb(32, 32, 32)";
      } else if (decimalPercentage < brightnessSplit[0]) {
        layerLetterCounts[0]++;
        targetGroup = row2;
        fontSize = maxFontSize * decimalPercentage;
        fontColour = lightColour;
      } else if (decimalPercentage < brightnessSplit[1]) {
        layerLetterCounts[1]++;
        targetGroup = row3;
        fontSize = maxFontSize * decimalPercentage;
        fontColour = lightColour;
      } else if (decimalPercentage < brightnessSplit[2]) {
        layerLetterCounts[2]++;
        targetGroup = row4;
        fontSize = maxFontSize * decimalPercentage;
        fontColour = lightColour;
      } else {
        layerLetterCounts[3]++;
        targetGroup = row5;
        fontSize = maxFontSize * decimalPercentage;
        fontColour = lightColour;
      }

      if (targetGroup) {
        const character = letters[currLetterIndex];
        currLetterIndex++;
        if (currLetterIndex >= letters.length) currLetterIndex = 0;

        targetGroup.push({
          x: x * cellSize,
          y: y * cellSize,
          fontSize,
          character,
          fontColour,
        });
      }
    }
  }

  console.log("layerLetterCounts: ", layerLetterCounts);
  const total =
    layerLetterCounts[0] +
    layerLetterCounts[1] +
    layerLetterCounts[2] +
    layerLetterCounts[3];
  console.log("total: ", total);
  const idealLayerTally = Math.round(total / 4);
  console.log("idealLayerTally: ", idealLayerTally);

  const canvasWidth = inputW;
  const canvasHeight = inputH;

  const widthInMM = Math.round(canvasWidth * 0.2645833333);
  const heightInMM = Math.round(canvasHeight * 0.2645833333);

  console.log("widthInMM: ", widthInMM);
  console.log("heightInMM: ", heightInMM);
  console.log("----");

  return [row1, row2, row3, row4, row5];
};
