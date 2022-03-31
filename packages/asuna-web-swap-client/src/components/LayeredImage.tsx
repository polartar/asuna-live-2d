import React from 'react'
import { TraitData, mapToLayerData, getFiles } from 'asuna-data'

export enum TokenItemQuality {
  Low,
  Mid,
  High
}

interface Props {
  traits: TraitData,
  quality: TokenItemQuality
}

const LayeredImage = function (props: Props) {
  const basePath = '/assets/' + (props.quality === TokenItemQuality.Low ? 'lowres/' : props.quality === TokenItemQuality.Mid ? 'midres/' : '')
  const imgs = Object.values(mapToLayerData(props.traits)).map(getFiles).flat()
  const getBlendClass = (src: string) => {
    if (src.indexOf('Multiply') >= 0) {
      return ' mix-blend-multiply'
    } else if (src.indexOf('Screen') >= 0) {
      return ' mix-blend-screen'
    } else {
      return ''
    }
  }

  return (
    <div className='layered-image'>
      {imgs.map(src => <img className={`absolute w-full h-full top-0${getBlendClass(src)}`} src={basePath + src} />)}
    </div>
  )
}

export default LayeredImage