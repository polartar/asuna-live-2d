import React from 'react'
import { useAppSelector, useAppDispatch } from '../store/store'
import { toggleSelected } from '../store/inventory'

interface Props {
  tokenId: number,
  selected: boolean
}

const TokenItem = function (props: React.PropsWithChildren<Props>) {
  const dispatch = useAppDispatch()
  const selectedClass = props.selected ? ' bg-orange-600 hover:bg-orange-500' : ''

  const handleClick = () => {
    dispatch(toggleSelected(props.tokenId))
  }

  return (
    <div key={props.tokenId}
      className={`overflow-hidden cursor-pointer rounded-md bg-dark-600 text-center hover:bg-slate-600${selectedClass}`}
      onClick={handleClick}
    >
      {props.children}
    </div>
  )
}

export default TokenItem