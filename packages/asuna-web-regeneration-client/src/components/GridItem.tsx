import React from "react"
import { TokenData } from "asuna-data"

interface GridItemProps {
  tokenData: TokenData,
  selected: boolean,
  handleClick: () => void,
  disabled?: boolean
}

function GridItem({ selected, handleClick, children, disabled }: React.PropsWithChildren<GridItemProps>) {
  const selectedClass = selected ? ' selected' : ''
  const disabledClass = disabled === true ? ' disabled' : ''
  return <div
    className={`grid-item${selectedClass}${disabledClass}`}
    onClick={handleClick}
  >
    {children}
  </div>
}

export default GridItem
