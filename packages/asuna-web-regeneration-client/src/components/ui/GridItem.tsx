import React from "react"
import { TokenData } from "asuna-data"

interface GridItemProps {
  tokenData: TokenData,
  selected: boolean,
  handleClick: () => void
}

function GridItem({ selected, handleClick, children }: React.PropsWithChildren<GridItemProps>) {
  const selectedClass = selected ? ' selected' : ''
  return <div
    className={`grid-item${selectedClass}`}
    onClick={handleClick}
  >
    {children}
  </div>
}

export default GridItem
