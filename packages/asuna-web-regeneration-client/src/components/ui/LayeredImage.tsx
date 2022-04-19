import React, { useState } from 'react'
import { mapToLayerData, getFiles, TokenData } from 'asuna-data'

export enum LayeredImageQuality {
  Low,
  Mid,
  High
}

interface Props {
  tokenData: TokenData,
  labelPosition?: 'top' | 'bottom',
  quality: LayeredImageQuality
}

const LayeredImage = function ({ quality, tokenData, labelPosition }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)
  const basePath = '/assets/' + (quality === LayeredImageQuality.Low ? 'lowres/' : quality === LayeredImageQuality.Mid ? 'midres/' : '')
  const layerFiles = Object.values(mapToLayerData(tokenData.traitData)).map(getFiles)
  const imgs = [] as string[]

  for (let i = 0; i < layerFiles.length; i++) {
    for (let j = 0; j < layerFiles[i].length; j++) {
      imgs.push(layerFiles[i][j])
    }
  }

  const getBlendClass = (src: string) => {
    if (src.indexOf('Multiply') >= 0) {
      return ' mix-blend-multiply'
    } else if (src.indexOf('Screen') >= 0) {
      return ' mix-blend-screen'
    } else {
      return ''
    }
  }
  const opacityClass = loaded ? '' : ' opacity-0'
  const labelPosClass = labelPosition === 'bottom' ? ' bottom-0 rounded-tl-full' : ' top-0 rounded-bl-full'

  const onLoad = () => {
    if (loadedCount + 1 === imgs.length) {
      setLoaded(true)
    }
    setLoadedCount(loadedCount + 1)
  }

  return (
    <div className={`layered-image asuna-ratio`}>
      <div className={`images${opacityClass}`}>
        {imgs.map((src, idx) =>
          <img
            key={idx}
            className={`absolute w-full h-full top-0${getBlendClass(src)}`}
            src={basePath + src}
            alt=''
            onLoad={onLoad}
          />
        )}
      </div>
      <div className={`absolute right-0 bg-white font-bold text-indigo-900 drop-shadow-xl pl-80 pr-40 py-10 text-xs ${labelPosClass}`}>#{tokenData.id}</div>
    </div>
  )
}

export default LayeredImage