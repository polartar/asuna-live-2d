import React from 'react'
import { useAppSelector, useAppDispatch } from '../store/store'
import { swapTrait } from '../store/inventory'
import LayeredImage from './LayeredImage'
import { TraitType } from 'asuna-data'


const TraitTypes = [
  { type: TraitType.Appendage, text: 'Tail/wing' },
  { type: TraitType.Background, text: 'Background' },
  { type: TraitType.ClipAccessory, text: 'Clip' },
  { type: TraitType.Ears, text: 'Ears' },
  { type: TraitType.HairColor, text: 'Hair Color' },
  { type: TraitType.HairFront, text: 'Front Hairstyle' },
  { type: TraitType.HairBack, text: 'Back Hairstyle' },
  { type: TraitType.FaceAccessory, text: 'Face Acces.' },
  { type: TraitType.Hand, text: 'Hand' },
  { type: TraitType.HeadAccessory, text: 'Hat / Head Acces.' },
  { type: TraitType.Mouth, text: 'Mouth' },
  { type: TraitType.Outfit, text: 'Outfit' },
  { type: TraitType.SkinMarking, text: 'Skin Marking' },
  { type: TraitType.SkinTone, text: 'Skin Tone' },
  { type: TraitType.Weapon, text: 'Weapon' }
]

interface Props {
  togglePage: () => void
}

const SwapPage = function (props: React.PropsWithChildren<Props>) {
  const dispatch = useAppDispatch()
  const selected = useAppSelector(state => Object.keys(state.inventory.selected))
  const token1 = useAppSelector(state => state.inventory.tokens[selected[0]])
  const token2 = useAppSelector(state => state.inventory.tokens[selected[1]])

  const handleClick = (trait: TraitType) => () => {
    dispatch(swapTrait({
      id1: +selected[0],
      id2: +selected[1],
      trait
    }))
  }

  return (<div className='swap-page text-center'>
    <div className='flex'>
      <div className='flex-1 overflow-hidden rounded-md'><LayeredImage traits={token1.traits} quality={0} /></div>
      <div className='px-140 flex flex-col justify-between'>
        {TraitTypes.map(item =>
          <div
            onClick={handleClick(item.type)}
            className='bg-white w-180 py-50 font-semibold text-indigo-900 text-sm rounded cursor-pointer'
          >
            {item.text}
          </div>
        )}
      </div>
      <div className='flex-1 overflow-hidden rounded-md'><LayeredImage traits={token2.traits} quality={0} /></div>
    </div>
    <button
      onClick={props.togglePage}
      className='bg-orange-600 mt-160 mx-auto px-130 py-80 rounded-lg'
    >
      Confirm
    </button>
  </div>)
}

export default SwapPage