import React, { useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { TraitType } from 'asuna-data'

import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setLoaded } from '../../../store/inventory'
import { Page } from '../../App'
import SwapOption from './SwapOption'
import ActionPanel from '../../ui/ActionPanel'
import SwapImage from './SwapImage'
import AwaitSwapPage from './AwaitSwapPage'


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
  const [swapping, setSwapping] = useState(false)
  const [highlightTrait, setHightlightTrait] = useState(undefined as TraitType | undefined)
  const [swapped, setSwapped] = useState({} as { [T in TraitType]?: boolean })
  const [highlight, setHighlight] = useState('flicker' as 'flash' | 'flicker')
  const swappedCount = Object.values(swapped).filter(val => val).length

  const handleEnter = (trait: TraitType) => {
    setHighlight('flicker')
    setHightlightTrait(trait)
  }

  const handleExit = () => {
    setHightlightTrait(undefined)
  }

  const handleClick = (trait: TraitType) => {
    setHighlight('flash')
    setSwapped({
      ...swapped,
      [trait]: !swapped[trait]
    })
  }

  const handleRegenerate = () => {
    dispatch(setLoaded(false))
    setSwapping(true)

    fetch('/api/swap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tokenId1: +selected[0].id,
        tokenId2: +selected[1].id,
        traitTypes: Object.entries(swapped).filter(item => item[1]).map(item => +item[0])
      })
    })
      .then(res => res.json())
      .then(() => {
        changePage(Page.Inventory)
      })
  }

  return (
    <SwitchTransition>
      <CSSTransition
        key={'' + swapping}
        classNames='page-d1'
        timeout={300}
      >{
          swapping
            ? <AwaitSwapPage />
            : <div className='page page-d1'>
              <div className='header text-center'>
                <h1 className='text-2xl leading-loose'>Regeneration Preview</h1>
                <p>Select traits to swap.</p>
              </div>
              <div className='text-center mt-0 mb-50'>
                <i className='icon icon-swap text-7xl' />
              </div>
              <div className='flex'>
                <div className='flex-1 overflow-hidden rounded-md'>
                  <SwapImage
                    token1={selected[0]}
                    token2={selected[1]}
                    swappedTraits={swapped}
                    highlight={highlight}
                    highlightTrait={highlightTrait}
                  />
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
                      swapped={!!swapped[item.type]}
                    >
                      {item.text}
                    </SwapOption>
                  )}
                </div>
                <div className='flex-1 overflow-hidden rounded-md'>
                  <SwapImage
                    token1={selected[1]}
                    token2={selected[0]}
                    swappedTraits={swapped}
                    highlight={highlight}
                    highlightTrait={highlightTrait}
                  />
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
                <button
                  className={`flex justify-center items-center w-210${swappedCount === 0 ? ' hide' : ''}`}
                  onClick={() => { handleRegenerate() }}
                >
                  <i className='icon icon-sparkle text-xl' />
                  Regenerate
                </button>
                <div className='flex-1'></div>
              </ActionPanel>
            </div>
        }</CSSTransition>
    </SwitchTransition >
  )
}

export default SwapPage
