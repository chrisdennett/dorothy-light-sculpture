// https://stuk.github.io/jszip/
import JSZip from "jszip";
// https://github.com/eligrey/FileSaver.js/
import { saveAs } from "file-saver";

export const saveCanvasZipFile = async (
  canvasIds,
  fileName = "dorothyCanvasFiles"
) => {
  const zip = new JSZip();

  // Generate a directory within the Zip file structure
  const layersFolder = zip.folder("layers");

  let count = 0;
  for (let id of canvasIds) {
    const canvas = document.getElementById(id);
    const canvasBlobData = await canvasToBlob(canvas);

    // Add a file to the directory, in this case an image with data URI as contents
    layersFolder.file(`canvas_${count}.png`, canvasBlobData, { base64: true });
    count++;
  }

  // Add an top-level, arbitrary text file with contents
  //   let informationText = `Canvas size: Width:${canvasArray[0].width}, height:(${canvasArray[0].width}\n`;
  //   zip.file("information.txt", informationText);

  const nowStr = getDateString();

  // Generate the zip file asynchronously
  zip.generateAsync({ type: "blob" }).then(function (content) {
    // Force down of the Zip file
    saveAs(content, `${fileName}_${nowStr}.zip`);
  });
};

export const saveSvgZipFile = async (svgIds, fileName = "dorothySvgFiles") => {
  const zip = new JSZip();

  // Generate a directory within the Zip file structure
  const layersFolder = zip.folder("layers");

  let count = 0;
  for (let id of svgIds) {
    const svgString = getSvgText(id);

    // Add a file to the directory, in this case an image with data URI as contents
    layersFolder.file(`svg_${count}.svg`, svgString);
    count++;
  }

  // Add an top-level, arbitrary text file with contents
  //   let informationText = `SVG size: Width:${canvasArray[0].width}, height:(${canvasArray[0].width}\n`;

  //   zip.file("information.txt", informationText);

  const nowStr = getDateString();

  // Generate the zip file asynchronously
  zip.generateAsync({ type: "blob" }).then(function (content) {
    // Force down of the Zip file
    saveAs(content, `${fileName}_${nowStr}.zip`);
  });
};

const getSvgText = (id) => {
  var svg_data = document.getElementById(id)
    ? document.getElementById(id).outerHTML
    : "waiting"; //put id of your svg element here

  svg_data = svg_data.split(">").join(`>
    `);

  return svg_data;
};

const canvasToBlob = (canvas) => {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blobData) => {
        resolve(blobData);
      },
      "image/png",
      1
    );
  });
};

function getDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const mins = `${date.getMinutes()}`.padStart(2, "0");
  const secs = `${date.getSeconds()}`.padStart(2, "0");
  return `${year}-${month}-${day}__${hour}h-${mins}m-${secs}s`;
}
