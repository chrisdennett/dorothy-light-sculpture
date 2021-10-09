export const ROUND_TO = (number, decimalPlaces) => {
  // e.g. to 3 decimal places time by 1000, round, then divide by 1000
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(number * multiplier) / multiplier;
};

export function GetImageFromUrl(imgUrl, callback) {
  const imgSrc = imgUrl;
  // Create a new image element
  let img = new Image();
  img.setAttribute("crossOrigin", "anonymous"); //
  img.src = imgSrc;

  // wait for it to be loaded and then return
  img.onload = () => {
    callback(img);
  };
}

export function getDistance(x1, y1, x2, y2) {
  let x = x2 - x1;
  let y = y2 - y1;

  return Math.sqrt(x * x + y * y);
}

export const TO_DATE_TEXT = (dateNumber) => {
  const d = new Date(dateNumber);
  const date = d.getDate();
  if (isNaN(date)) return "...";

  const monthIndex = d.getMonth();
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][monthIndex];
  const year = d.getFullYear();

  return `${date} ${month} ${year}`;
};

// Used to generate unique image names
// used getTime and extra random digits to deal with 2 images
// created in the same ms.
// https://gist.github.com/gordonbrander/2230317
export function generateUID() {
  let d = new Date().getTime();
  return d + "_" + Math.random().toString(36).substr(2, 4);
}

export const loadImage = (url, callback) => {
  let sourceImg = new Image();
  sourceImg.setAttribute("crossOrigin", "anonymous"); //
  sourceImg.src = url;
  sourceImg.onload = () => {
    if (callback) callback(sourceImg);
  };
};

// Reads file as Array buffer to get camera orientation from exif data
function GetPhotoOrientation(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const view = new DataView(e.target.result);

    if (view.getUint16(0, false) !== 0xffd8) return callback(-2);
    const length = view.byteLength;
    let offset = 2;
    while (offset < length) {
      let marker = view.getUint16(offset, false);
      offset += 2;
      if (marker === 0xffe1) {
        offset += 2;
        if (view.getUint32(offset, false) !== 0x45786966) return callback(-1);

        const little = view.getUint16((offset += 6), false) === 0x4949;
        offset += view.getUint32(offset + 4, little);
        const tags = view.getUint16(offset, little);
        offset += 2;
        for (let i = 0; i < tags; i++)
          if (view.getUint16(offset + i * 12, little) === 0x0112)
            return callback(view.getUint16(offset + i * 12 + 8, little));
      } else if ((marker & 0xff00) !== 0xff00) break;
      else offset += view.getUint16(offset, false);
    }
    return callback(-1);
  };
  reader.readAsArrayBuffer(file);
}

export function getDimensionRatios(w, h) {
  const widthToHeightRatio = Math.round(100 * (h / w)) / 100;
  const heightToWidthRatio = Math.round(100 * (w / h)) / 100;

  return { widthToHeightRatio, heightToWidthRatio };
}

// Returns an image element given a file
export function GetImage(imgFile, callback) {
  GetPhotoOrientation(imgFile, (orientation) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgSrc = e.target.result;
      // Create a new image element
      let img = new Image();
      img.setAttribute("crossOrigin", "anonymous"); //
      img.src = imgSrc;

      // wait for it to be loaded and then return
      img.onload = (e) => {
        const w = img.width;
        const h = img.height;

        // if portrait these need to be reversed
        const isPortrait = orientation > 4 && orientation < 9;
        let widthToHeightRatio, heightToWidthRatio;

        if (isPortrait) {
          widthToHeightRatio = Math.round(100 * (w / h)) / 100;
          heightToWidthRatio = Math.round(100 * (h / w)) / 100;
        } else {
          widthToHeightRatio = Math.round(100 * (h / w)) / 100;
          heightToWidthRatio = Math.round(100 * (w / h)) / 100;
        }

        callback(img, orientation, widthToHeightRatio, heightToWidthRatio);
      };
    };
    reader.readAsDataURL(imgFile);
  });
}

export function getImageBlob({ canvas, quality = 0.95 }, callback) {
  // quality is no longer used because I'm saving as png
  // TODO: considier using image/webp
  //  https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
  //  https://developers.google.com/speed/webp/
  canvas.toBlob(
    (canvasBlobData) => {
      callback(canvasBlobData);
    },
    "image/jpeg",
    quality
  );
}

export const getDimensionsToFit = (
  inputWidth,
  inputHeight,
  maxWidth,
  maxHeight
) => {
  let outputWidth, outputHeight;
  const { widthToHeightRatio, heightToWidthRatio } = getDimensionRatios(
    inputWidth,
    inputHeight
  );

  // if the width need reducing, set width to max and scale height accordingly
  if (inputWidth > maxWidth) {
    outputWidth = maxWidth;
    outputHeight = outputWidth * widthToHeightRatio;

    if (outputHeight > maxHeight) {
      outputHeight = maxHeight;
      outputWidth = outputHeight * heightToWidthRatio;
    }
  }
  // if the height need reducing, set height to max and scale width accordingly
  else if (inputHeight > maxHeight) {
    outputHeight = maxHeight;
    outputWidth = outputHeight * heightToWidthRatio;
  }
  // otherwise output can match input
  else {
    outputWidth = inputWidth;
    outputHeight = inputHeight;
  }

  return { width: outputWidth, height: outputHeight };
};

// https://stackoverflow.com/questions/3732046/how-do-you-get-the-hue-of-a-xxxxxx-colour
export const hexToHsl = (hexColour) => {
  // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
  const red = parseInt(hexColour.substr(1, 2), 16);
  const green = parseInt(hexColour.substr(3, 2), 16);
  const blue = parseInt(hexColour.substr(5, 2), 16);

  return rgbToHsl({ red, green, blue });
};

export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// https://stackoverflow.com/questions/3732046/how-do-you-get-the-hue-of-a-xxxxxx-colour
export const rgbToHsl = ({ red, green, blue }) => {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  // hue is in degrees, saturation and lightness in percentages
  return { hue: Math.round(h * 360), saturation: s * 100, lightness: l * 100 };
};

// https://stackoverflow.com/questions/3732046/how-do-you-get-the-hue-of-a-xxxxxx-colour
export const hslToHex = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const hslToRgbObj = (h, s, l) => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

export const containsNonBlankText = (testStr) => {
  if (!testStr) return false;

  return /\S/.test(testStr);
};

// const MAX_IMG_SIZE = 3000;
const DEFAULT_CROP_VALUES = {
  leftPercent: 0,
  rightPercent: 1,
  topPercent: 0,
  bottomPercent: 1,
};

export const copyToCanvas = (
  inputCanvas,
  outputCanvas,
  resizeCanvas = true
) => {
  const { width: inputWidth, height: inputHeight } = inputCanvas;

  if (resizeCanvas) {
    outputCanvas.width = inputWidth;
    outputCanvas.height = inputHeight;
  }

  const ctx = outputCanvas.getContext("2d");
  ctx.drawImage(
    inputCanvas,
    0,
    0,
    inputCanvas.width,
    inputCanvas.height,
    0,
    0,
    outputCanvas.width,
    outputCanvas.height
  );
};

// BRIGHTNESS
export const createBrightnessCanvas = (inputCanvas, edit) => {
  const { brightnessAdjust } = edit;

  const { width: inputW, height: inputH } = inputCanvas;
  const inputCtx = inputCanvas.getContext("2d");
  let imgData = inputCtx.getImageData(0, 0, inputW, inputH);

  let pixels = imgData.data;
  let r, g, b;
  for (let i = 0; i < pixels.length; i += 4) {
    r = pixels[i];
    g = pixels[i + 1];
    b = pixels[i + 2];

    pixels[i] = r + brightnessAdjust;
    pixels[i + 1] = g + brightnessAdjust;
    pixels[i + 2] = b + brightnessAdjust;
  }

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = inputW;
  outputCanvas.height = inputH;
  const outputCtx = outputCanvas.getContext("2d");
  outputCtx.putImageData(imgData, 0, 0);

  return outputCanvas;
};

export const createThresholdCanvas = (inputCanvas, threshold) => {
  const inputCtx = inputCanvas.getContext("2d");
  const inputWidth = inputCanvas.width;
  const inputHeight = inputCanvas.height;

  let imageData = inputCtx.getImageData(0, 0, inputWidth, inputHeight);
  let pixels = imageData.data;

  const contrast = threshold * 2.55; // or *= 255 / 100; scale integer percent to full range
  const contrastFactor = (255 + contrast) / (255.01 - contrast); //add .1 to avoid /0 error

  for (let i = 0; i < pixels.length; i += 4) {
    const grey = contrastFactor * (pixels[i] - 128) + 128;

    pixels[i] = grey; // red
    pixels[i + 1] = grey; // green
    pixels[i + 2] = grey; // blue
    pixels[i + 3] = pixels[i + 3]; // alpha
  }

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = inputCanvas.width;
  outputCanvas.height = inputCanvas.height;
  const outputCtx = outputCanvas.getContext("2d");

  outputCtx.putImageData(imageData, 0, 0);

  return outputCanvas;
};

export const createRestrictedGreysCanvas = (
  inputCanvas,
  { maxGreys, returnPalette = false }
) => {
  const inputCtx = inputCanvas.getContext("2d");
  const inputWidth = inputCanvas.width;
  const inputHeight = inputCanvas.height;
  const levels = maxGreys - 1;

  let imageData = inputCtx.getImageData(0, 0, inputWidth, inputHeight);
  let pixels = imageData.data;

  const greyBandSize = 255 / levels;
  const palette = [];

  for (let i = 0; i < pixels.length; i += 4) {
    const unrestrictedGrey = pixels[i];
    const grey = Math.round(
      Math.round((levels * unrestrictedGrey) / 255) * greyBandSize
    );

    if (!palette.includes(grey)) palette.push(grey);

    pixels[i] = grey; // red
    pixels[i + 1] = grey; // green
    pixels[i + 2] = grey; // blue
  }

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = inputCanvas.width;
  outputCanvas.height = inputCanvas.height;
  const outputCtx = outputCanvas.getContext("2d");
  outputCtx.putImageData(imageData, 0, 0);

  const orderedPalette = palette.sort((a, b) => b - a);

  return returnPalette
    ? { canvas: outputCanvas, palette: orderedPalette }
    : outputCanvas;
};

export function createMaxSizeCanvas(
  inputCanvas,
  _maxWidth = 1000,
  _maxHeight = 1000
) {
  const { width: inputWidth, height: inputHeight } = inputCanvas;
  const maxWidth = _maxWidth ? _maxWidth : inputWidth;
  const maxHeight = _maxHeight ? _maxHeight : inputHeight;

  // get width and height restricted to maximums
  const { width: outputWidth, height: outputHeight } = getDimensionsToFit(
    inputWidth,
    inputHeight,
    maxWidth,
    maxHeight
  );

  // set up the output canvas
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = outputWidth;
  outputCanvas.height = outputHeight;

  // draw input to output at the restricted size
  const ctx = outputCanvas.getContext("2d");
  // ctx.fillStyle = "red";
  // ctx.fillRect(0, 0, 400, 400);
  ctx.drawImage(
    inputCanvas,
    0,
    0,
    inputWidth,
    inputHeight,
    0,
    0,
    outputWidth,
    outputHeight
  );

  return outputCanvas;
}

export const createCroppedCanvas = (sourceCanvas, cropData) => {
  // if there's no cropping just return the sourceCanvas unchanged
  if (!cropData || cropData === DEFAULT_CROP_VALUES) {
    return sourceCanvas;
  }

  const { top, right, bottom, left } = cropData;
  const { width: sourceWidth, height: sourceHeight } = sourceCanvas;

  const outputCanvas = document.createElement("canvas");

  const leftCrop = sourceWidth * left;
  const rightCrop = sourceWidth * (1 - right);
  const topCrop = sourceHeight * top;
  const bottomCrop = sourceHeight * (1 - bottom);
  let croppedWidth = sourceCanvas.width - (leftCrop + rightCrop);
  let croppedHeight = sourceCanvas.height - (topCrop + bottomCrop);

  outputCanvas.width = croppedWidth;
  outputCanvas.height = croppedHeight;

  const ctx = outputCanvas.getContext("2d");
  ctx.clearRect(0, 0, croppedWidth, croppedHeight);

  ctx.drawImage(
    sourceCanvas,
    leftCrop,
    topCrop,
    croppedWidth,
    croppedHeight,
    0,
    0,
    croppedWidth,
    croppedHeight
  );

  return outputCanvas;
};

export const createOrientatedCanvas = (sourceCanvas, orientation) => {
  const outputCanvas = document.createElement("canvas");
  const isPortrait = orientation > 4 && orientation < 9;

  // switch height and width if it's portrait
  let canvasW = isPortrait ? sourceCanvas.height : sourceCanvas.width;
  let canvasH = isPortrait ? sourceCanvas.width : sourceCanvas.height;

  const ctx = outputCanvas.getContext("2d");

  outputCanvas.width = canvasW;
  outputCanvas.height = canvasH;

  // transform context before drawing image
  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, canvasW, 0);
      break;

    case 3:
      ctx.transform(-1, 0, 0, -1, canvasW, canvasH);
      break;

    case 4:
      ctx.transform(1, 0, 0, -1, 0, canvasH);
      break;

    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0);
      break;
    case 6:
      ctx.transform(0, 1, -1, 0, canvasW, 0);
      break;
    case 7:
      ctx.transform(0, -1, -1, 0, canvasW, canvasH);
      break;
    case 8:
      ctx.transform(0, -1, 1, 0, 0, canvasH);
      break;
    default:
      break;
  }

  ctx.drawImage(sourceCanvas, 0, 0);

  return outputCanvas;
};

const maxOutputCanvasSize = 1000;

export const createCanvasFromFile = (file, callback) => {
  GetImage(file, (sourceImg, imgOrientation) => {
    const maxWidthCanvas = createMaxSizeCanvas(
      sourceImg,
      maxOutputCanvasSize,
      maxOutputCanvasSize
    );
    const canvas = createOrientatedCanvas(maxWidthCanvas, imgOrientation);

    callback(canvas);
  });
};
