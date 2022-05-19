import { TokenData, TraitType, canSwap, getTraitMetadata } from 'asuna-data'
import React, { useState } from 'react'

import styles from './SwapOption.module.scss'

interface SwapOptionProps {
  handleEnter: () => void
  handleExit: () => void
  handleClick: () => void
  token1: TokenData
  token2: TokenData
  type: TraitType
  swapped: boolean
  invalid: boolean
  clips: TraitType[][]
}

function SwapOption({ handleEnter, handleExit, handleClick, token1, token2, type, swapped, invalid, clips, children }: React.PropsWithChildren<SwapOptionProps>) {
  const [showLabel, setShowLabel] = useState(false)
  const swapStatus = canSwap(token1, token2, type)
  const hiddenClass = !swapStatus.swappable ? ' hide' : ''
  const swappedClass = swapped ? ' swapped' : ''
  const invalidClass = invalid ? ' invalid' : ''
  const invalidLabelClass1 = clips[0].indexOf(type) >= 0 ? ' invalid' : ''
  const invalidLabelClass2 = clips[1].indexOf(type) >= 0 ? ' invalid' : ''

  if (swapped) {
    let temp = token1
    token1 = token2
    token2 = temp
  }

  const handleMouseEnter = () => {
    handleEnter()
    setShowLabel(true)
  }

  const handleMouseExit = () => {
    handleExit()
    setShowLabel(false)
  }

  return <div
    onClick={handleClick}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseExit}
    className={`${styles['swap-option']}${hiddenClass}${swappedClass}${invalidClass}`}
  >
    {(showLabel || invalid) && token1.traitData[type] !== undefined
      ? <div className={`label label-left${invalidLabelClass1}`}>
        {getTraitMetadata(type, token1.traitData[type]!).name}
        <i className='icon icon-arrow-right' />
      </div>
      : null
    }
    {(showLabel || invalid) && token2.traitData[type] !== undefined
      ? <div className={`label label-right${invalidLabelClass2}`}>
        <i className='icon icon-arrow-left' />
        {getTraitMetadata(type, token2.traitData[type]!).name}
      </div>
      : null
    }
    {invalid ? 'INCOMPATIBLE' : children}
  </div>
}

export default SwapOption
