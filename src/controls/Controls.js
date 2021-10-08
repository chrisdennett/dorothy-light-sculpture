import React, { useEffect } from "react";
import { button, folder, Leva, useControls } from "leva";
import {
  useQueryParams,
  BooleanParam,
  StringParam,
  NumberParam,
  ArrayParam,
} from "use-query-params";

export default function Controls({
  showControls = true,
  onChange,
  onSaveCanvas,
}) {
  const [query, setQuery] = useQueryParams({
    canvasWidth: NumberParam,
    cellSize: NumberParam,
    fitToWidth: BooleanParam,
    fitToHeight: BooleanParam,
    lightColour: StringParam,
    image: StringParam,
    canvas1X: NumberParam,
    brightnessSplit: ArrayParam,
  });

  const [values, set] = useControls(() => ({
    image: {
      value: "pic-5.png",
      options: [
        "pic-0.jpeg",
        "pic-1.jpeg",
        "pic-2.jpeg",
        "pic-3.jpeg",
        "pic-4.jpeg",
        "pic-5.png",
        "pic-6.jpeg",
        "pic-7.jpeg",
        "pic-8.jpeg",
      ],
      onChange: (value) => setQuery({ image: value }),
    },

    // image: {
    //   image: "./dorothy-exploded-NO-BG.png",
    // },

    fitToWidth: {
      value: false,
      onChange: (value) => setQuery({ fitToWidth: value }),
    },
    fitToHeight: {
      value: false,
      onChange: (value) => setQuery({ fitToHeight: value }),
    },

    canvas1X: {
      value: 0,
      step: 1,
      min: -30,
      max: 30,
      onChange: (value) => setQuery({ canvas1X: value }),
    },

    redrawOptions: folder(
      {
        brightnessSplit: {
          value: [0.55, 0.72, 0.82],
          min: 0,
          max: 1,
          onChange: (value) => setQuery({ brightnessSplit: value }),
        },

        canvasWidth: {
          value: 260,
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

        lightColour: {
          value: "red",
          onChange: (value) => setQuery({ lightColour: value }),
        },
      },
      {
        collapsed: false,
      }
    ),

    Save_CANVAS: button(onSaveCanvas),
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
