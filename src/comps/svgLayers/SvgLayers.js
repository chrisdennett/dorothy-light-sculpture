import React, { useEffect, useState } from "react";
import styles from "./svgLayers.module.css";
import { words } from "../../words";

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
  const svgWidth = Math.round(params.canvasWidth * params.cellSize);
  const svgHeight = Math.round(svgWidth * wToHRatio);

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

  let holderWidth = svgWidth;
  let holderHeight = svgHeight;
  if (params.viewSize === "fitToWidth") {
    holderWidth = "100vw";
    holderHeight = "inherit";
  } else if (params.viewSize === "fitToHeight") {
    holderHeight = "100vh";
    holderWidth = "i00%";
  }

  const divStyles = {
    position: "absolute",
    width: holderWidth,
    height: holderHeight,
  };

  const styles4 = params.canvas1X * (offsetIncrease * 0.2);
  const styles3 = params.canvas1X * (offsetIncrease * 0.4);
  const styles2 = params.canvas1X * (offsetIncrease * 0.6);
  const styles1 = params.canvas1X * offsetIncrease;

  if (!layers || layers.length < 4) return null;

  return (
    <div className={styles.svgLayers}>
      <div
        style={{
          ...svgHolderStyle,
        }}
      >
        {/* COMBINED HIDDEN SVG */}
        <div className={styles.hidden}>
          <SvgOuter id="svg-full" svgWidth={svgWidth} svgHeight={svgHeight}>
            {layers.map((layerData, i) => (
              <LayerGroup
                key={i}
                includeLayerBackgrounds={params.includeLayerBackgrounds}
                id={`full-group-${i + 1}`}
                colour={i === 0 ? params.bgColour : params.lightColour}
                layerData={layerData}
                svgWidth={svgWidth}
                svgHeight={svgHeight}
              />
            ))}
          </SvgOuter>
        </div>

        {/* SVG 1 */}
        {params.showLayer1 && (
          <div style={{ ...divStyles, left: styles1 }}>
            <SvgOuter id="svg-1" svgWidth={svgWidth} svgHeight={svgHeight}>
              <LayerGroup
                includeLayerBackgrounds={params.includeLayerBackgrounds}
                id="group-1"
                colour={params.bgColour}
                layerData={layers[0]}
                svgWidth={svgWidth}
                svgHeight={svgHeight}
              />
            </SvgOuter>
          </div>
        )}

        {/* SVG 2 */}
        {params.showLayer2 && (
          <div style={{ ...divStyles, left: styles2 }}>
            <SvgOuter id="svg-2" svgWidth={svgWidth} svgHeight={svgHeight}>
              <LayerGroup
                includeLayerBackgrounds={params.includeLayerBackgrounds}
                id="group-2"
                colour={params.lightColour}
                layerData={layers[1]}
                svgWidth={svgWidth}
                svgHeight={svgHeight}
              />
            </SvgOuter>
          </div>
        )}

        {/* SVG 3 */}
        {params.showLayer3 && (
          <div style={{ ...divStyles, left: styles3 }}>
            <SvgOuter id="svg-3" svgWidth={svgWidth} svgHeight={svgHeight}>
              <LayerGroup
                includeLayerBackgrounds={params.includeLayerBackgrounds}
                id="group-3"
                colour={params.lightColour}
                layerData={layers[2]}
                svgWidth={svgWidth}
                svgHeight={svgHeight}
              />
            </SvgOuter>
          </div>
        )}

        {/* SVG 4 */}
        {params.showLayer4 && (
          <div style={{ ...divStyles, left: styles4 }}>
            <SvgOuter id="svg-4" svgWidth={svgWidth} svgHeight={svgHeight}>
              <LayerGroup
                includeLayerBackgrounds={params.includeLayerBackgrounds}
                id="group-4"
                colour={params.lightColour}
                layerData={layers[3]}
                svgWidth={svgWidth}
                svgHeight={svgHeight}
              />
            </SvgOuter>
          </div>
        )}

        {/* SVG 5 */}
        {params.showLayer5 && (
          <div style={{ ...divStyles }}>
            <SvgOuter id="svg-5" svgWidth={svgWidth} svgHeight={svgHeight}>
              <LayerGroup
                includeLayerBackgrounds={params.includeLayerBackgrounds}
                id="group-5"
                colour={params.lightColour}
                layerData={layers[4]}
                svgWidth={svgWidth}
                svgHeight={svgHeight}
              />
            </SvgOuter>
          </div>
        )}
      </div>
    </div>
  );
}

const SvgOuter = ({ children, svgWidth, svgHeight, id }) => {
  return (
    <svg
      id={id}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      width={svgWidth}
      height={svgHeight}
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      {children}
    </svg>
  );
};

const LayerGroup = ({
  includeLayerBackgrounds,
  colour,
  layerData,
  svgWidth,
  svgHeight,
  id,
}) => {
  return (
    <g>
      {includeLayerBackgrounds && (
        <rect x={0} y={0} width={svgWidth} height={svgHeight} fill="red" />
      )}
      <g
        id={id}
        fill={colour}
        fontFamily="Xanh Mono"
        fontStyle="italic"
        textAnchor="start"
      >
        {layerData.map((grp, i) => (
          <text key={`g5-${i}`} x={grp.x} y={grp.y} fontSize={grp.fontSize}>
            <tspan alignmentBaseline="hanging">{grp.character}</tspan>
          </text>
        ))}
      </g>
    </g>
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
  const maxFontSize = cellSize * 1.1;

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
