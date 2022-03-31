import React, { MouseEventHandler, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../store/store'
import { addToken } from '../store/inventory'
import LayeredImage from './LayeredImage'
import TokenItem from './TokenItem'

interface Props {
  togglePage: () => void
}

const InventoryPage = function (props: Props) {
  const dispatch = useAppDispatch()
  const [inputValue, setInputValue] = useState(0)
  const tokens = useAppSelector(state => {
    return Object.values(state.inventory.tokens)
  })
  const selected = useAppSelector(state => {
    return { ...state.inventory.selected }
  })
  const canSwap = Object.keys(selected).length === 2
  const swapButtonClass = canSwap ? ' bg-orange-600' : ' bg-slate-500 opacity-40'

  const handleChange = (ev: any) => {
    if (isNaN(ev.currentTarget.value)) {
      setInputValue(inputValue)
    } else {
      let v = +ev.currentTarget.value
      v = Math.max(0, Math.min(9999, v))
      setInputValue(v)
    }
  }

  const handleClick = (ev: any) => {
    dispatch(addToken(inputValue))
    handleChange({ currentTarget: { value: Math.floor(10000 * Math.random()) } })
  }

  return (
    <div>
      <div className='flex justify-between'>
        <div>
          <input className='text-black px-100 py-75 rounded-l-lg' type='text' onChange={handleChange} value={inputValue} />
          <button className='bg-dark-600 px-100 py-75 rounded-r-lg' onClick={handleClick}>Add token</button>
        </div>
        <div>
          <button
            onClick={props.togglePage}
            disabled={!canSwap}
            className={`px-130 py-75 rounded-lg${swapButtonClass}`}
          >
            Swap
          </button>
        </div>
      </div>
      <div className='content-wrapper my-120 overflow-y-scroll'>
        <div className='grid grid-cols-6 gap-80'>
          {tokens.map(token =>
            <TokenItem tokenId={token.id} selected={token.id in selected}>
              <LayeredImage traits={token.traits} quality={0} />
              #{token.id}
            </TokenItem>)
          }
        </div>
      </div>
    </div>
  )
}

export default InventoryPage