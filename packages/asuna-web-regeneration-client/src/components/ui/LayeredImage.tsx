import React, { useState } from "react";
import {
  TraitHighlights,
  mapToLayerData,
  getFiles,
  TokenData,
  TraitType,
  LayerType,
} from "asuna-data";

export enum LayeredImageQuality {
  Low,
  Mid,
  High,
}

interface Props {
  tokenData: TokenData;
  highlight?: "flash" | "flicker";
  highlightTrait?: TraitType;
  labelSize?: "large" | "default";
  labelPosition?: "top" | "bottom";
  quality: LayeredImageQuality;
}

interface Layer {
  key: string;
  type: "img" | "mask";
  src: string | string[];
}

const LayeredImage = function ({
  highlight,
  highlightTrait,
  quality,
  tokenData,
  labelPosition,
  labelSize,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const basePath =
    "/assets/" +
    (quality === LayeredImageQuality.Low
      ? "lowres/"
      : quality === LayeredImageQuality.Mid
      ? "midres/"
      : "");
  const layerFiles = Object.values(mapToLayerData(tokenData.traitData)).map(
    getFiles
  );

  console.log(tokenData);
  console.log(mapToLayerData(tokenData.traitData));
  const highlights =
    highlightTrait !== undefined
      ? TraitHighlights[highlightTrait]
      : ([] as LayerType[]);
  const imgs: Layer[] = [];
  let imgCount = 0;

  for (let i = 0; i < layerFiles.length; i++) {
    for (let j = 0; j < layerFiles[i].length; j++) {
      imgs.push({ key: `img${i}/${j}`, type: "img", src: layerFiles[i][j] });
      imgCount++;
    }
    if (layerFiles[i].length > 0 && highlights.indexOf(i) >= 0) {
      imgs.push({ key: `mask${i}`, type: "mask", src: layerFiles[i] });
    }
  }

  const getBlendClass = (src: string) => {
    if (src.indexOf("Multiply") >= 0) {
      return " mix-blend-multiply";
    } else if (src.indexOf("Screen") >= 0) {
      return " mix-blend-screen";
    } else {
      return "";
    }
  };
  const opacityClass = loaded ? "" : " opacity-0";
  const labelSizeClass =
    labelSize === "large"
      ? " pl-110 pr-80 py-55 text-xl"
      : " pl-80 pr-40 py-10 text-xs";
  const labelPosClass =
    labelPosition === "bottom"
      ? " bottom-0 rounded-tl-full"
      : " top-0 rounded-bl-full";
  const highlightClass =
    highlight === "flash" ? " mask-flash" : " mask-flicker";

  const onLoad = () => {
    if (loadedCount + 1 === imgCount) {
      setLoaded(true);
    }
    setLoadedCount(loadedCount + 1);
  };

  return (
    <div className={`layered-image asuna-ratio`}>
      <div className={`images${opacityClass}`}>
        {imgs.map((layer, idx) =>
          layer.type === "img" ? (
            <img
              key={layer.key}
              className={`absolute w-full h-full top-0${getBlendClass(
                layer.src as string
              )}`}
              src={basePath + layer.src}
              alt=""
              onLoad={onLoad}
            />
          ) : true ? null : (
            <div
              key={layer.key}
              className={`absolute mask w-full h-full bg-white${highlightClass}`}
              style={{
                WebkitMaskImage: (layer.src as string[])
                  .map((src) => `url(${basePath + src})`)
                  .join(","),
                WebkitMaskSize: "cover",
              }}
            />
          )
        )}
      </div>
      <div
        className={`absolute right-0 bg-white font-bold text-indigo-900 drop-shadow-xl${labelSizeClass}${labelPosClass}`}
      >
        #{tokenData.id}
      </div>
    </div>
  );
};

export default LayeredImage;
