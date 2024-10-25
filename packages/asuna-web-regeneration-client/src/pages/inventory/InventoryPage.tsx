import React, { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

import { Page } from '../../App'
import LayeredImage, { LayeredImageQuality } from '../../components/LayeredImage'
import GridItem from '../../components/GridItem'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setInventory, setLoaded, toggleSelected, restoreSelected, setOrder } from '../../store/inventory'
import ActionPanel from '../../components/ActionPanel'
import GridContainer from '../../components/GridContainer'

export interface InventoryPageProps {
  firstLoad: boolean,
  changePage: (n: number) => void
}

function InventoryPage({ firstLoad, changePage }: React.PropsWithoutRef<InventoryPageProps>) {
  // Other components should run `dispatch(setLoaded(false))` when changing inventory to force reload here
  const { account } = useWeb3React()
  const { loaded, selected, inventory } = useAppSelector(state => state.inventory)
  const dispatch = useAppDispatch()
  const hideClass = firstLoad && Object.keys(inventory).length === 0 ? ' hidden' : ''
  const renderedInv = loaded ? inventory : {}
  const slotTokens = Object.values(selected)
  const hideNextClass = slotTokens.length === 2 ? '' : 'hide'

  const handleSelect = (id: number) => {
    dispatch(toggleSelected(id))
  }

  useEffect(() => {
    if (!loaded) {
      const url = new URL('/api/inventory', window.location.origin)
      url.search = new URLSearchParams({ address: account! }).toString()

      fetch(url.href)
        .then(res => res.json())
        .then((obj) => {
          dispatch(setInventory(obj.tokenData))
          dispatch(setOrder(obj.unsortedIds))
          dispatch(restoreSelected())
          dispatch(setLoaded(true))

          if (firstLoad && Object.keys(obj.tokenData).length === 0) {
            changePage(Page.Wallet)
          }
        })
    }
  }, [])

  return <div className={`page page-d1${hideClass}`}>
    <div className='header flex items-end'>
      <div className='flex-1'>
        <h1 className='text-2xl leading-loose'>Select two Asunas to regenerate</h1>
        <p>Or import Asunas from wallet.</p>
      </div>
      <div className='page-actions'>
        <button className='w-185 ml-80' onClick={() => changePage(Page.Withdraw)}>
          <i className='icon icon-upload text-xl' />
          Withdraw
        </button>
        <button className='w-185 ml-80' onClick={() => changePage(Page.Wallet)}>
          <i className='icon icon-download text-xl' />
          Import
        </button>
      </div>
    </div>
    <GridContainer>
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
    </GridContainer>
    <ActionPanel hidden={!loaded || slotTokens.length === 0}>
      <div className='flex-1'></div>
      <div className='flex items-center'>
        {[0, -1, 1].map(idx =>
          idx === -1
            ? <i key={idx} className='icon icon-swap text-4xl p-50' />
            : <div
              key={idx}
              className='slot relative cursor-pointer'
              onClick={() => slotTokens[idx] !== undefined ? dispatch(toggleSelected(slotTokens[idx].id)) : null}
            >
              {loaded && slotTokens[idx] !== undefined
                ? <LayeredImage
                  key={slotTokens[idx].id}
                  quality={LayeredImageQuality.Low}
                  tokenData={slotTokens[idx]}
                  labelPosition='bottom'
                />
                : null}
              {slotTokens[idx] !== undefined
                ? <i className='icon icon-close absolute -top-60 -right-60 p-20 bg-indigo-400 text-white rounded-full' />
                : null
              }
            </div>
        )}
      </div>
      <div className='flex-1 flex justify-end'>
        <button
          className={hideNextClass}
          onClick={() => changePage(Page.Swap)}
        >
          Next
          <i className='icon icon-arrow-right' />
        </button>
      </div>
    </ActionPanel>
  </div>
}

export default InventoryPage
