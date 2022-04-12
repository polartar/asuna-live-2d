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
  const labelClass = props.labelPosition === 'bottom' ? ' bottom-0 rounded-tl-full' : ' top-0 rounded-bl-full'

  const onLoad = () => {
    setLoaded(loaded + 1)
  }

  return (
    <div className={`layered-image asuna-ratio`}>
      <div className={`images${opacityClass}`}>
        {imgs.map((src, idx) => <img
          key={idx}
          className={`absolute w-full h-full top-0${getBlendClass(src)}`}
          src={basePath + src}
          alt=''
          onLoad={onLoad}
        />)}
      </div>
      <div className={`absolute right-0 pl-80 pr-40 py-10 bg-white font-bold text-xs text-indigo-900 drop-shadow-xl${labelClass}`}>#{props.tokenData.id}</div>
    </div>
  )
}

export default LayeredImage