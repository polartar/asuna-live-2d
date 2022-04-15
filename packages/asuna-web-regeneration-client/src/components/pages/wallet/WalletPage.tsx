import React, { useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { TokenData } from 'asuna-data'

import { Page } from '../../App'
import { walletAddress } from '../../../wallet'
import LayeredImage, { LayeredImageQuality } from '../../ui/LayeredImage'
import GridItem from '../../ui/GridItem'
import ActionPanel from '../../ui/ActionPanel'
import AwaitImportPage from './AwaitImportPage'
import { useAppDispatch } from '../../../store/hooks'
import { setLoaded } from '../../../store/inventory'


export interface WalletPageProps {
  changePage: (n: number) => void
}

function WalletPage({ changePage }: WalletPageProps) {
  const dispatch = useAppDispatch()
  const [wallet, setWallet] = useState({} as { [tokenId: string]: TokenData })
  const [selection, setSelection] = useState({} as { [tokenId: string]: boolean })
  const [importing, setImporting] = useState(false)
  const selectedCount = Object.keys(selection).length

  useEffect(() => {
    const url = new URL('/api/wallet', window.location.origin)
    url.search = new URLSearchParams({ address: walletAddress }).toString()

    fetch(url.href)
      .then(res => res.json())
      .then((val) => {
        setWallet(val)
      })
  }, [])

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

  const handleImport = () => {
    dispatch(setLoaded(false))
    setImporting(true)

    fetch('/api/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        address: walletAddress,
        tokenIds: Object.keys(selection).map(id => +id)
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
        key={'' + importing}
        classNames='page-d1'
        timeout={300}
      >{
          importing
            ? <AwaitImportPage />
            : <div className={`page page-d1`}>
              <div className='header'>
                <button
                  className='px-100 mb-100'
                  onClick={() => changePage(Page.Inventory)}
                >
                  <i className='icon icon-arrow-left' />
                  Back
                </button>
                <h1 className='text-2xl leading-loose'>Select any number of Asunas to import</h1>
                <p>Imported Asunas will be unable to be withdrawn for a period of 3 days.</p>
              </div>
              <div className='grid-container'>
                <div className='grid'>
                  {Object.values(wallet).map(token =>
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
              <ActionPanel hidden={selectedCount === 0}>
                <button className='w-210' onClick={handleImport}>
                  <i className='icon icon-download text-2xl' />
                  Import
                </button>
              </ActionPanel>
            </div>
        }</CSSTransition>
    </SwitchTransition >
  )
}

export default WalletPage
