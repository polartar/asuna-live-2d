import { TokenData, TraitType, canSwap, getTraitMetadata } from 'asuna-data'
import React, { useState } from 'react'

interface SwapOptionProps {
  handleEnter: () => void
  handleExit: () => void
  handleClick: () => void
  token1: TokenData
  token2: TokenData
  type: TraitType
  swapped: boolean
}

function SwapOption({ handleEnter, handleExit, handleClick, token1, token2, type, swapped, children }: React.PropsWithChildren<SwapOptionProps>) {
  const [showLabel, setShowLabel] = useState(false)
  const swapStatus = canSwap(token1, token2, type)
  const hiddenClass = !swapStatus.swappable ? ' hide' : ''
  const swappedClass = swapped ? ' swapped' : ''

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
    className={`swap-option${hiddenClass}${swappedClass}`}
  >
    {showLabel && token1.traitData[type] !== undefined
      ? <div className='label label-left'>
        {getTraitMetadata(type, token1.traitData[type]!).name}
        <i className='icon icon-arrow-right' />
      </div>
      : null
    }
    {showLabel && token2.traitData[type] !== undefined
      ? <div className='label label-right'>
        <i className='icon icon-arrow-left' />
        {getTraitMetadata(type, token2.traitData[type]!).name}
      </div>
      : null
    }
    {children}
  </div>
}

export default SwapOption
