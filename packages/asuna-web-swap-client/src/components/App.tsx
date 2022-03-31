import React, { MouseEventHandler, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../store/store'
import { addToken } from '../store/inventory'
import LayeredImage from './LayeredImage'
import TokenItem from './TokenItem'
import InventoryPage from './InventoryPage'
import SwapPage from './SwapPage'


enum Page {
  Inventory,
  Swap
}

interface Props {
}

const App = function (props: Props) {
  const [pageValue, setPage] = useState(0)
  let ActivePage = InventoryPage
  if (pageValue === Page.Inventory) {
    ActivePage = InventoryPage
  } else if (pageValue === Page.Swap) {
    ActivePage = SwapPage
  }

  const togglePage = () => {
    if (pageValue === Page.Inventory) {
      setPage(Page.Swap)
    } else {
      setPage(Page.Inventory)
    }
  }

  return (
    <div className='container'>
      <ActivePage togglePage={togglePage} />
    </div>
  )
}

export default App