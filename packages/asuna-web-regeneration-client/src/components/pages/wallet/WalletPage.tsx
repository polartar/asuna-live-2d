import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { TokenData } from 'asuna-data'

import { HOLDER_ADDRESS, HOLDER_ABI } from '../../../web3/HolderContract'
import { store } from '../../../store/store'
import { ModalActions, ModalPage } from '../../../store/modal'
import { Page } from '../../App'
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
  const { account } = useWeb3React()
  const library = useWeb3React().library as ethers.providers.Web3Provider
  const dispatch = useAppDispatch()
  const [approved, setApproved] = useState(null as boolean | null)
  const [wallet, setWallet] = useState({} as { [tokenId: string]: TokenData })
  const [selection, setSelection] = useState({} as { [tokenId: string]: boolean })
  const [pending, setPending] = useState(false)
  const [importing, setImporting] = useState(false)
  const selectedCount = Object.keys(selection).length
  const buttonDisabledClass = pending ? ' disabled' : ''

  useEffect(() => {
    const approvedUrl = new URL('/api/isApproved', window.location.origin)
    approvedUrl.search = new URLSearchParams({ address: account! }).toString()

    fetch(approvedUrl.href)
      .then(res => res.json())
      .then((val: { approved: boolean }) => {
        setApproved(val.approved)
      })

    const walletUrl = new URL('/api/wallet', window.location.origin)
    walletUrl.search = new URLSearchParams({ address: account! }).toString()

    fetch(walletUrl.href)
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

  const handleImport = async () => {
    setPending(true)

    // setApprovalForAll if not approved
    if (approved === false) {
      dispatch(ModalActions.setPage(ModalPage.Approval))
      dispatch(ModalActions.setShow(true))
      try {
        await store.getState().modal.wait
        setApproved(true)
      } catch {
        setPending(false)
        return
      }
    }

    try {
      const contract = new ethers.Contract(HOLDER_ADDRESS, HOLDER_ABI, library.getSigner())
      const tx: ethers.providers.TransactionResponse = await contract.lock(Object.keys(selection).map(id => +id))

      dispatch(setLoaded(false))
      setImporting(true)

      const txr = await tx.wait()

      // extra padding for tx to clear
      await new Promise((resolve) => setTimeout(resolve, 2000))

      changePage(Page.Inventory)
    } catch {
      setPending(false)
      setImporting(false)
      return
    }
  }

  return (
    <SwitchTransition>
      <CSSTransition
        key={'' + importing}
        classNames='page-d2'
        timeout={300}
      >{
          importing
            ? <AwaitImportPage />
            : <div className={`page page-d2`}>
              <div className='header'>
                <button
                  className='px-100 mb-100'
                  onClick={() => changePage(Page.Inventory)}
                >
                  <i className='icon icon-arrow-left' />
                  Back
                </button>
                <h1 className='text-2xl leading-loose'>Select any number of Asunas to import</h1>
                <p>Imported Asunas will be unable to be withdrawn for a period of 3 days. Approved is {String(approved)}</p>
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
              <ActionPanel hidden={selectedCount === 0 || approved === null}>
                <button className={`w-210${buttonDisabledClass}`} onClick={handleImport}>
                  <i className='icon icon-download text-2xl' />
                  {pending ? 'Waiting...' : 'Import'}
                </button>
              </ActionPanel>
            </div>
        }</CSSTransition>
    </SwitchTransition >
  )
}

export default WalletPage
