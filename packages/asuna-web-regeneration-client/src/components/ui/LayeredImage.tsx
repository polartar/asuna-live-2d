import React, { useState } from 'react'
import { mapToLayerData, getFiles, TokenData } from 'asuna-data'

export enum LayeredImageQuality {
  Low,
  Mid,
  High
}

interface Props {
  tokenData: TokenData,
  quality: LayeredImageQuality
}

const LayeredImage = function (props: Props) {
  const [loaded, setLoaded] = useState(0)

  const basePath = '/assets/' + (props.quality === LayeredImageQuality.Low ? 'lowres/' : props.quality === LayeredImageQuality.Mid ? 'midres/' : '')
  const imgs = Object.values(mapToLayerData(props.tokenData.traitData)).map(getFiles).flat()
  const getBlendClass = (src: string) => {
    if (src.indexOf('Multiply') >= 0) {
      return ' mix-blend-multiply'
    } else if (src.indexOf('Screen') >= 0) {
      return ' mix-blend-screen'
    } else {
      return ''
    }
  }

  const opacityClass = loaded === imgs.length ? '' : ' opacity-0'
  const onLoad = () => {
    setLoaded(loaded + 1)
  }

  return (
    <div className={`layered-image${opacityClass}`}>
      {imgs.map((src, idx) => <img
        key={idx}
        className={`absolute w-full h-full top-0${getBlendClass(src)}`}
        src={basePath + src}
        alt=''
        onLoad={onLoad}
      />)}
      <div className="absolute top-30 right-30 px-40 py-10 bg-white font-bold text-xs text-slate-900 rounded-full">#{props.tokenData.id}</div>
    </div>
  )
}

export default LayeredImage