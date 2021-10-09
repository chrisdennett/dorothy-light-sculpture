import React, { useEffect } from "react";
import { folder, Leva, useControls } from "leva";
import {
  useQueryParams,
  BooleanParam,
  StringParam,
  NumberParam,
  ArrayParam,
} from "use-query-params";

// http://localhost:3000/?bgColour=%23414141&brightnessAdjust=0&brightnessSplit=0.45&brightnessSplit=0.69&brightnessSplit=0.82&canvas1X=0&canvasWidth=235&cellSize=9&contrast=10&cropBottom=1&cropLeft=0.1&cropRight=0.9&cropTop=0&image=pic-5.png&lightColour=%23f5f2f2&outputType=canvas&showLayer1=1&showLayer2=1&showLayer3=1&showLayer4=1&showLayer5=1&viewSize=fitToWidth

export default function Controls({ showControls = true, onChange }) {
  const [query, setQuery] = useQueryParams({
    canvasWidth: NumberParam,
    cellSize: NumberParam,
    viewSize: StringParam,
    lightColour: StringParam,
    bgColour: StringParam,
    outputType: StringParam,
    brightnessAdjust: NumberParam,
    contrast: NumberParam,
    showLayer1: BooleanParam,
    showLayer2: BooleanParam,
    showLayer3: BooleanParam,
    showLayer4: BooleanParam,
    showLayer5: BooleanParam,
    canvas1X: NumberParam,
    brightnessSplit: ArrayParam,
    cropTop: NumberParam,
    cropLeft: NumberParam,
    cropRight: NumberParam,
    cropBottom: NumberParam,
  });

  const [values, set] = useControls(() => ({
    outputType: {
      value: "svg",
      options: ["svg", "canvas"],
      onChange: (option) => setQuery({ outputType: option }),
    },

    viewSize: {
      value: "fitToHeight",
      options: ["fullSize", "fitToWidth", "fitToHeight"],
      onChange: (option) => setQuery({ viewSize: option }),
    },

    canvas1X: {
      value: 0,
      step: 1,
      min: -30,
      max: 30,
      onChange: (value) => setQuery({ canvas1X: value }),
    },

    showHideLayers: folder(
      {
        showLayer1: {
          value: true,
          onChange: (value) => setQuery({ showLayer1: value }),
        },
        showLayer2: {
          value: true,
          onChange: (value) => setQuery({ showLayer2: value }),
        },
        showLayer3: {
          value: true,
          onChange: (value) => setQuery({ showLayer3: value }),
        },
        showLayer4: {
          value: true,
          onChange: (value) => setQuery({ showLayer4: value }),
        },
        showLayer5: {
          value: true,
          onChange: (value) => setQuery({ showLayer5: value }),
        },
      },
      {
        collapsed: true,
      }
    ),

    colours: folder(
      {
        lightColour: {
          value: "#f5f2f2",
          onChange: (value) => setQuery({ lightColour: value }),
        },

        bgColour: {
          value: "#f5f2f2",
          onChange: (value) => setQuery({ bgColour: value }),
        },
      },
      {
        collapsed: true,
      }
    ),

    redrawOptions: folder(
      {
        brightnessSplit: {
          value: [0.45, 0.66, 0.77],
          step: 0.001,
          min: 0,
          max: 1,
          onChange: (value) => setQuery({ brightnessSplit: value }),
        },

        canvasWidth: {
          value: 235,
          step: 1,
          min: 10,
          max: 400,
          onChange: (value) => setQuery({ canvasWidth: value }),
        },

        cellSize: {
          value: 9,
          step: 1,
          min: 1,
          max: 100,
          onChange: (value) => setQuery({ cellSize: value }),
        },
      },
      {
        collapsed: true,
      }
    ),

    imageAdjustments: folder(
      {
        brightnessAdjust: {
          value: 0,
          step: 1,
          min: -100,
          max: 100,
          onChange: (value) => setQuery({ brightnessAdjust: value }),
        },

        contrast: {
          value: 10,
          step: 1,
          min: -100,
          max: 100,
          onChange: (value) => setQuery({ contrast: value }),
        },
      },
      {
        collapsed: true,
      }
    ),

    cropping: folder(
      {
        cropLeft: {
          value: 0.1,
          min: 0,
          max: 1,
          onChange: (value) => setQuery({ cropLeft: value }),
        },
        cropTop: {
          value: 0,
          min: 0,
          max: 1,
          onChange: (value) => setQuery({ cropTop: value }),
        },
        cropRight: {
          value: 0.9,
          min: 0,
          max: 1,
          onChange: (value) => setQuery({ cropRight: value }),
        },
        cropBottom: {
          value: 1,
          min: 0,
          max: 1,
          onChange: (value) => setQuery({ cropBottom: value }),
        },
      },
      {
        collapsed: true,
      }
    ),

    // Save_CANVAS: button(onSaveCanvas),
  }));

  // reset: button(() => history.push(`/${defaultValsPath}`)),

  useEffect(() => {
    const updatedKeys = Object.keys(query);
    if (updatedKeys.length > 0) {
      const updates = {};
      for (let key of updatedKeys) {
        updates[key] = query[key];
      }

      // set the controls based on the query
      set(updates);

      // update the app based on the query
      onChange({ ...values, ...updates });
    }

    // eslint-disable-next-line
  }, [query]);

  return <Leva hidden={!showControls} />;
}
