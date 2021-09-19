import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { button, folder, Leva, useControls } from "leva";
import {
  useQueryParams,
  BooleanParam,
  StringParam,
  NumberParam,
} from "use-query-params";

// const defaultValsPath =
//   "?addMultipleLinesFromStart=1&allowDiagonals=0&bgColour=%23333333&canvasHeight=800&canvasWidth=800&cellSize=10&drawGrid=0&drawStartPt=0&generate=1625156099424&line2Colour=%23dedede&line3Colour=%23dedede&line4Colour=%23dedede&lineColour=%23ff0000&lineThickness=3&maxRandomOffsetSize=0.1&mirrorLeftRight=1&mirrorTopBottom=1&outerPadding=88&outline1=0&outline1Colour=%23ff0000&outline2=0&outline2Colour=%23ff0000&outline3=0&outline3Colour=%23ff0000&outline4=0&outline4Colour=%23ff0000&outputType=svg";

export default function Controls({
  showControls = true,
  onChange,
  onSaveCanvas,
}) {
  const [query, setQuery] = useQueryParams({
    canvasWidth: NumberParam,
    cellSize: NumberParam,
    zoomToWidth: BooleanParam,
    textColour: StringParam,
    canvas1X: NumberParam,
  });
  let history = useHistory();

  const [values, set] = useControls(() => ({
    zoomToWidth: {
      value: false,
      onChange: (value) => setQuery({ zoomToWidth: value }),
    },
    saveCANVAS: folder({
      Save_CANVAS: button(onSaveCanvas),
    }),
    Oh_youknow_stuff: folder({
      canvas1X: {
        value: 0,
        step: 0.01,
        min: 0,
        max: 1,
        onChange: (value) => setQuery({ canvas1X: value }),
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

      textColour: {
        value: "red",
        onChange: (value) => setQuery({ textColour: value }),
      },

      zoomToWidth: {
        value: false,
        onChange: (value) => setQuery({ zoomToWidth: value }),
      },
    }),
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
