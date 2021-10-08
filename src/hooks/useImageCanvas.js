import { useEffect } from "react";

function useImageCanvas(url, callback) {
  // const [imgSrc, setImgSrc] = useState("./pexels-rompalli-harish-2235924.jpg");

  useEffect(() => {
    if (!url) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      callback(c);
    };
    img.src = url;
  }, [url]);
}

export default useImageCanvas;
