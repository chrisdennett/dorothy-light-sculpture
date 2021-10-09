import React, { useState, useEffect } from "react";
import "./styles.css";
import Controls from "./controls/Controls";
import { createSmallCanvas } from "./canvasFunctions";
import {
  createBrightnessCanvas,
  createCroppedCanvas,
  createThresholdCanvas,
} from "./utils/UTILS";
import SvgLayers from "./comps/svgLayers/SvgLayers";
import CanvasLayers from "./comps/canvasLayers/CanvasLayers";

// width = 235
// cellSize = 9
// warm white = #fdf4dc

const App = () => {
  const [params, setParams] = useState({});
  const [sourceImg, setSourceImg] = useState();
  const [inputCanvas, setInputCanvas] = useState();

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
  }, [sourceImg]);

  // CREATE INPUT CANVAS
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

      setInputCanvas(contrastCanvas);
    }
  }, [
    sourceImg,
    params.canvasWidth,
    params.contrast,
    params.brightnessAdjust,
    params.cropLeft,
    params.cropTop,
    params.cropRight,
    params.cropBottom,
  ]);

  const onParamsChange = (newParams) => setParams(newParams);

  return (
    <div>
      <Controls onChange={onParamsChange} />

      {params.outputType === "canvas" && (
        <CanvasLayers inputCanvas={inputCanvas} params={params} />
      )}

      {params.outputType === "svg" && (
        <SvgLayers inputCanvas={inputCanvas} params={params} />
      )}
    </div>
  );
};

export default App;
