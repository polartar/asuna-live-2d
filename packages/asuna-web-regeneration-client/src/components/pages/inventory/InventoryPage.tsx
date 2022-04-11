import React, { useEffect, useState } from "react"
import { TokenData } from "asuna-data"

import { Page } from '../../App'
import { walletAddress } from '../../../wallet'
import LayeredImage, { LayeredImageQuality } from "../../ui/LayeredImage"
import GridItem from "../../ui/GridItem"


export interface InventoryPageProps {
  firstLoad: boolean,
  changePage: (n: number) => void
}

function InventoryPage({ firstLoad, changePage }: React.PropsWithoutRef<InventoryPageProps>) {
  const [inventory, setInventory] = useState({} as { [tokenId: string]: TokenData })
  const [selection, setSelection] = useState({} as { [tokenId: string]: boolean })

  const handleSelect = (id: number) => {
    let next = {
      ...selection
    }
    if (id in next) {
      delete next[id]
    } else {
      next[id] = true
    }
    setSelection(next)
  }

  useEffect(() => {
    const url = new URL('/api/inventory', window.location.origin)
    url.search = new URLSearchParams({ address: walletAddress }).toString()

    fetch(url.href)
      .then(res => res.json())
      .then((val) => {
        setInventory(val)
        if (firstLoad && Object.keys(val).length === 0) {
          changePage(Page.Wallet)
        }
      })
  }, [])

  const hideClass = firstLoad && Object.keys(inventory).length === 0 ? ' hidden' : ''

  return <div className={`page page-d0${hideClass}`}>
    <h1 className="text-2xl leading-loose">Select two Asunas to regenerate</h1>
    <p>Or import Asunas from wallet.</p>

    <div className="grid-container">
      <div className="grid">
        {Object.values(inventory).map(token =>
          <GridItem
            key={token.id}
            handleClick={() => handleSelect(token.id)}
            tokenData={token}
            selected={token.id in selection}
          >
            <LayeredImage quality={LayeredImageQuality.Low} tokenData={token} />
          </GridItem>
        )}
      </div>
    </div>
  </div>
}

export default InventoryPage
