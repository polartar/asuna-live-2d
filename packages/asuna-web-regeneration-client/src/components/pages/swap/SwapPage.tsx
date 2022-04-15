import React, { useState } from 'react'
import { TraitType } from 'asuna-data'

import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { swapTrait } from '../../../store/inventory'
import LayeredImage from '../../ui/LayeredImage'
import { Page } from '../../App'
import SwapOption from './SwapOption'
import ActionPanel from '../../ui/ActionPanel'


const TraitTypes = [
  { type: TraitType.HairColor, text: 'Hair Color' },
  { type: TraitType.HairFront, text: 'Front Hairstyle' },
  { type: TraitType.HairBack, text: 'Back Hairstyle' },
  { type: TraitType.SkinTone, text: 'Skin Tone' },
  { type: TraitType.SkinMarking, text: 'Skin Marking' },
  { type: TraitType.EyeColor, text: 'Eye Color' },
  { type: TraitType.Eyes, text: 'Eye Shape' },
  { type: TraitType.Mouth, text: 'Mouth' },
  { type: TraitType.Ears, text: 'Ears' },
  { type: TraitType.Outfit, text: 'Outfit' },
  { type: TraitType.HeadAccessory, text: 'Head Accessory' },
  { type: TraitType.FaceAccessory, text: 'Face Accessory' },
  { type: TraitType.ClipAccessory, text: 'Hair Clip' },
  { type: TraitType.Hand, text: 'Hand' },
  { type: TraitType.Weapon, text: 'Weapon' },
  { type: TraitType.Appendage, text: 'Tail/wing' },
  { type: TraitType.Background, text: 'Background' },
]

export interface SwapPageProps {
  changePage: (n: number) => void
}

function SwapPage({ changePage }: SwapPageProps) {
  const dispatch = useAppDispatch()
  const selected = useAppSelector(state => Object.values(state.inventory.selected))
  const [highlightTrait, setHightlightTrait] = useState(undefined as TraitType | undefined)
  const [swapped, setSwapped] = useState(Array(Object.keys(TraitType).length).fill(false) as boolean[])
  const [highlight, setHighlight] = useState('flicker' as 'flash' | 'flicker')

  const handleEnter = (trait: TraitType) => {
    setHighlight('flicker')
    setHightlightTrait(trait)
  }

  const handleExit = () => {
    setHightlightTrait(undefined)
  }

  const handleClick = (trait: TraitType) => {
    setHighlight('flash')
    let next = [...swapped]
    next[trait] = !next[trait]
    setSwapped(next)
    dispatch(swapTrait({
      id1: +selected[0].id,
      id2: +selected[1].id,
      trait
    }))
  }

  return <div className='page page-d1'>
    <div className='header text-center'>
      <h1 className='text-2xl leading-loose'>Regeneration Preview</h1>
      <p>Select traits to swap.</p>
    </div>
    <div className='text-center mt-0 mb-50'>
      <i className='icon icon-swap text-7xl' />
    </div>
    <div className='flex'>
      <div className='flex-1 overflow-hidden rounded-md'>
        <LayeredImage labelSize='large' tokenData={selected[0]} quality={0} highlight={highlight} highlightTrait={highlightTrait} />
      </div>
      <div className='px-100 flex flex-col justify-between'>
        {TraitTypes.map(item =>
          <SwapOption
            key={item.type}
            handleEnter={() => handleEnter(item.type)}
            handleExit={() => handleExit()}
            handleClick={() => handleClick(item.type)}
            token1={selected[0]}
            token2={selected[1]}
            type={item.type}
            swapped={swapped[item.type]}
          >
            {item.text}
          </SwapOption>
        )}
      </div>
      <div className='flex-1 overflow-hidden rounded-md'>
        <LayeredImage labelSize='large' tokenData={selected[1]} quality={0} highlight={highlight} highlightTrait={highlightTrait} />
      </div>
    </div>
    <ActionPanel hidden={false}>
      <div className='flex-1 self-start'>
        <span
          className='cursor-pointer'
          onClick={() => changePage(Page.Inventory)}
        >
          <i className='icon icon-arrow-left' />
          Back
        </span>
      </div>
      <button className='flex justify-center items-center w-210' onClick={() => { }}>
        <i className='icon icon-sparkle text-xl' />
        Regenerate
      </button>
      <div className='flex-1'></div>
    </ActionPanel>
  </div>
}

export default SwapPage
