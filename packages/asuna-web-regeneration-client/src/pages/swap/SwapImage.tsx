import React, { useState } from 'react'
import { TraitHighlights, LayerTraits, mapToLayerData, getFiles, TokenData, TraitType, LayerType, mapToCompoundLayerData } from 'asuna-data'
import styles from '../../components/LayeredImage.module.scss'

interface SwapImageProps {
  token1: TokenData,
  token2: TokenData,
  swappedTraits: { [T in TraitType]?: boolean },
  highlight?: 'flash' | 'flicker',
  highlightTrait?: TraitType
}

interface Layer {
  key: string
  type: 'img' | 'mask'
  show: boolean
  src: string | string[]
}

const SwapImage = function ({ token1, token2, swappedTraits, highlight, highlightTrait }: SwapImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)
  const basePath = '/assets/midres/'
  const layerFiles1 = Object.values(mapToLayerData(token1.traitData)).map(getFiles)
  const layerFiles2 = Object.values(mapToLayerData(token2.traitData)).map(getFiles)
  const compoundFiles = Object.values(mapToCompoundLayerData(token1.traitData, token2.traitData)).map(arr => arr.map(getFiles))
  const highlights = highlightTrait !== undefined ? TraitHighlights[highlightTrait] : [] as LayerType[]
  const imgs: Layer[] = []
  let imgCount = 0

  for (let i = 0; i < layerFiles1.length; i++) {
    const traits = LayerTraits[i as LayerType]
    const allSwapped = traits.reduce((a, b) => a && !!swappedTraits[b], true)
    const xor = traits.length > 1 && (!!swappedTraits[traits[0]] !== !!swappedTraits[traits[1]])
    const swapped = traits.map(t => !!swappedTraits[t])
    let imgArr: Layer[] = []

    // image layers
    for (let j = 0; j < layerFiles1[i].length; j++) {
      imgArr.push({ key: `img0/${i}/${j}`, type: 'img', show: !xor && !allSwapped, src: layerFiles1[i][j] })
      imgCount++
    }
    for (let j = 0; j < layerFiles2[i].length; j++) {
      imgArr.push({ key: `img1/${i}/${j}`, type: 'img', show: !xor && allSwapped, src: layerFiles2[i][j] })
      imgCount++
    }
    for (let j = 0; j < compoundFiles[i].length; j++) {
      for (let k = 0; k < compoundFiles[i][j].length; k++) {
        imgArr.push({ key: `img2/${i}/${j}/${k}`, type: 'img', show: xor && swapped[j], src: compoundFiles[i][j][k] })
        imgCount++
      }
    }

    // highlight layers
    const show = highlights.indexOf(i) >= 0
    if (layerFiles1[i].length > 0) {
      imgArr.push({ key: `mask00/${i}`, show: !xor && !allSwapped && show, type: 'mask', src: layerFiles1[i] })
      if (traits.length > 1) {
        imgArr.push({ key: `mask10/${i}`, show: xor && swapped[0] && show, type: 'mask', src: layerFiles1[i] })
      }
    }
    if (layerFiles2[i].length > 0) {
      imgArr.push({ key: `mask11/${i}`, show: !xor && allSwapped && show, type: 'mask', src: layerFiles2[i] })
      if (traits.length > 1) {
        imgArr.push({ key: `mask01/${i}`, show: xor && swapped[1] && show, type: 'mask', src: layerFiles2[i] })
      }
    }

    imgArr.sort((a, b) => a.key < b.key ? -1 : 1)
    imgs.push(...imgArr)
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
  const highlightClass = highlight === 'flash' ? ' mask-flash' : ' mask-flicker'

  const onLoad = () => {
    if (loadedCount + 1 === imgCount) {
      setLoaded(true)
    }
    setLoadedCount(loadedCount + 1)
  }

  return (
    <div className={`${styles['layered-image']} layered-image asuna-ratio`}>
      <div className={`images${opacityClass}`}>
        {imgs.map((layer, idx) =>
          layer.type === 'img'
            ? <img
              key={layer.key}
              className={`absolute w-full h-full top-0${layer.show ? '' : ' hidden'}${getBlendClass(layer.src as string)}`}
              src={basePath + layer.src}
              alt=''
              onLoad={onLoad}
            />
            : <div
              key={layer.key}
              className={`absolute mask w-full h-full bg-white${layer.show ? '' : ' hidden'}${highlightClass}`}
              style={{
                WebkitMaskImage: (layer.src as string[]).map(src => `url(${basePath + src})`).join(','),
                WebkitMaskSize: 'cover'
              }}
            />
        )}
      </div>
      <div
        className={`absolute right-0 bg-white font-bold text-indigo-900 drop-shadow-xl pl-110 pr-80 py-55 text-xl top-0 rounded-bl-full`}
      >
        #{token1.id}
      </div>
    </div>
  )
}

export default SwapImage