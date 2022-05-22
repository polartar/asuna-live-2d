import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Page } from '../../App'
import ActionPanel from '../../components/ActionPanel'
import GridContainer from '../../components/GridContainer'
import GridItem from '../../components/GridItem'
import GridItemTimer from '../../components/GridItemTimer'
import LayeredImage, { LayeredImageQuality } from '../../components/LayeredImage'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setLoaded } from '../../store/inventory'
import { store } from '../../store/store'
import { getOrderedInput, HOLDER_ABI, HOLDER_ADDRESS } from '../../web3/HolderContract'
import AwaitWithdrawPage from './AwaitWithdrawPage'


export interface WithdrawPageProps {
  changePage: (n: number) => void
}

function WithdrawPage({ changePage }: WithdrawPageProps) {
  const library = useWeb3React().library as ethers.providers.Web3Provider
  const dispatch = useAppDispatch()
  const { inventory } = useAppSelector(state => state.inventory)
  const [timestamps, setTimestamps] = useState({} as { [tokenId: string]: number })
  const [now, setNow] = useState(Date.now())
  const [selection, setSelection] = useState({} as { [tokenId: string]: boolean })
  const [pending, setPending] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const selectedCount = Object.keys(selection).length
  const buttonDisabledClass = pending ? ' disabled' : ''

  useEffect(() => {
    const walletUrl = new URL('/api/unlockDates', window.location.origin)
    walletUrl.search = new URLSearchParams({ ids: Object.keys(inventory).join(',') }).toString()

    fetch(walletUrl.href)
      .then(res => res.json())
      .then((obj) => {
        let next: typeof timestamps = {}
        for (let i = 0, arr = Object.keys(inventory); i < arr.length; i++) {
          next[arr[i]] = obj[i]
        }

        setTimestamps(next)
      })

    const tid = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tid)
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

  const handleWithdraw = async () => {
    setPending(true)

    try {
      const contract = new ethers.Contract(HOLDER_ADDRESS, HOLDER_ABI, library.getSigner())
      const orderedIds = getOrderedInput([...store.getState().inventory.stateOrder], Object.keys(selection).map(id => +id))
      const tx: ethers.providers.TransactionResponse = await contract.withdraw(orderedIds)

      dispatch(setLoaded(false))
      setWithdrawing(true)

      await tx.wait()
      await new Promise((resolve) => setTimeout(resolve, 2000)) // extra padding for tx to clear

      changePage(Page.Inventory)
    } catch (err) {
      setPending(false)
      setWithdrawing(false)
      return
    }
  }

  return (
    <SwitchTransition>
      <CSSTransition
        key={'' + withdrawing}
        classNames='page-d2'
        timeout={300}
      >{
          withdrawing
            ? <AwaitWithdrawPage />
            : <div className='page page-d2'>
              <div className='header'>
                <button
                  className='px-100 mb-100'
                  onClick={() => changePage(Page.Inventory)}
                >
                  <i className='icon icon-arrow-left' />
                  Back
                </button>
                <h1 className='text-2xl leading-loose'>Select Asunas to withdraw</h1>
                <p>Asunas can be withdrawn after the holding period is complete.</p>
              </div>
              {
                Object.keys(timestamps).length > 0
                  ? <GridContainer>
                    {Object.values(inventory)
                      .sort((a, b) => timestamps[a.id] < timestamps[b.id] ? -1 : 1)
                      .map(token =>
                        <GridItem
                          key={token.id}
                          handleClick={() => handleSelect(token.id)}
                          tokenData={token}
                          disabled={timestamps[token.id] - now >= 0}
                          selected={token.id in selection}
                        >
                          <LayeredImage quality={LayeredImageQuality.Low} tokenData={token} />
                          <GridItemTimer now={now} timestamp={timestamps[token.id]} />
                        </GridItem>
                      )}
                  </GridContainer>
                  : null
              }
              <ActionPanel hidden={selectedCount === 0}>
                <button className={`w-210${buttonDisabledClass}`} onClick={() => handleWithdraw()}>
                  <i className='icon icon-download text-2xl' />
                  {pending ? 'Waiting...' : 'Withdraw'}
                </button>
              </ActionPanel>
            </div>
        }
      </CSSTransition>
    </SwitchTransition >)
}

export default WithdrawPage
