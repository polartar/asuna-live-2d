import React, { useEffect, useState } from 'react'
import { TokenData } from 'asuna-data'

import { Page } from '../../App'
import { walletAddress } from '../../../wallet'
import LayeredImage, { LayeredImageQuality } from '../../ui/LayeredImage'
import GridItem from '../../ui/GridItem'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { setInventory, setLoaded, toggleSelected } from '../../../store/inventory'
import ActionPanel from '../../ui/ActionPanel'

import wildcard from '../../../assets/media/wildcard.jpg'


export interface InventoryPageProps {
  firstLoad: boolean,
  changePage: (n: number) => void
}

function InventoryPage({ firstLoad, changePage }: React.PropsWithoutRef<InventoryPageProps>) {
  // Other components should run `dispatch(setLoaded(false))` when changing inventory to force reload here
  const { loaded, selected, inventory } = useAppSelector(state => state.inventory)
  const dispatch = useAppDispatch()
  const hideClass = firstLoad && Object.keys(inventory).length === 0 ? ' hidden' : ''
  const renderedInv = loaded ? inventory : {}
  const slotTokens = Object.values(selected)

  const handleSelect = (id: number) => {
    dispatch(toggleSelected(id))
  }

  useEffect(() => {
    const url = new URL('/api/inventory', window.location.origin)
    url.search = new URLSearchParams({ address: walletAddress }).toString()

    if (!loaded) {
      fetch(url.href)
        .then(res => res.json())
        .then((val) => {
          dispatch(setInventory(val))
          dispatch(setLoaded(true))

          if (firstLoad && Object.keys(val).length === 0) {
            changePage(Page.Wallet)
          }
        })
    }
  }, [])

  return <div className={`page page-d0${hideClass}`}>
    <div className='header flex items-end'>
      <div className='flex-1'>
        <h1 className='text-2xl leading-loose'>Select two Asunas to regenerate</h1>
        <p>Or import Asunas from wallet.</p>
      </div>
      <div className='page-actions'>
        <button className='w-185 ml-80'>
          <i className='icon icon-upload text-xl' />
          Withdraw
        </button>
        <button className='w-185 ml-80' onClick={() => changePage(Page.Wallet)}>
          <i className='icon icon-download text-xl' />
          Import
        </button>
      </div>
    </div>
    <div className='grid-container'>
      <div className='grid'>
        {Object.values(renderedInv).map(token =>
          <GridItem
            key={token.id}
            handleClick={() => handleSelect(token.id)}
            tokenData={token}
            selected={token.id in selected}
          >
            <LayeredImage quality={LayeredImageQuality.Low} tokenData={token} />
          </GridItem>
        )}
      </div>
    </div>
    <ActionPanel hidden={false}>
      {[0, 1].map(idx =>
        <div key={idx} className='slot'>
          {slotTokens[idx] !== undefined
            ? <LayeredImage
              key={slotTokens[idx].id}
              quality={LayeredImageQuality.Low}
              tokenData={slotTokens[idx]}
              labelPosition='bottom'
            />
            : null}
        </div>
      )}
      <button>
        <i className='icon icon-swap text-2xl' />
        Regenerate
      </button>
    </ActionPanel>
  </div>
}

export default InventoryPage
