import React, { useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import InventoryPage from './pages/inventory/InventoryPage'
import WalletPage from './pages/wallet/WalletPage'
import SwapPage from './pages/SwapPage'

import bg from '../assets/media/bg.png'
import logo from '../assets/media/logo-white.png'
import Wrapper from './Wrapper'
import { walletAddress } from '../wallet'


export enum Page {
  Inventory,
  Wallet,
  Swap
}

function App() {
  let [firstLoad, setFirstLoad] = useState(true) // the first time inventory is mounted, if inventory is empty, transition to import from wallet
  let [page, setPage] = useState(0 as Page)

  const changePage = (n: number) => {
    if ((n % 3) === Page.Inventory) {
      setFirstLoad(false)
    }
    setPage(n % 3)
  }

  return (
    <div className='flex h-full bg-cover' style={{ backgroundImage: `url(${bg})` }}>
      <div className='flex-1 pt-120 pl-120'>
        <img src={logo} className='h-180' alt='logo' />
      </div>
      <Wrapper className='flex flex-col'>
        <div className='flex flex-1 relative overflow-hidden'>
          <SwitchTransition>
            <CSSTransition
              key={page}
              classNames='page-d0'
              timeout={300}
            >
              {page === Page.Inventory ? <InventoryPage firstLoad={firstLoad} changePage={changePage} />
                : page === Page.Wallet ? <WalletPage changePage={changePage} />
                  : <SwapPage />
              }
            </CSSTransition>
          </SwitchTransition>
        </div>
      </Wrapper>
      <div className='flex-1 flex justify-end items-start pt-120 pr-120'>
        <div className='flex items-center px-100 py-50 border border-white rounded-full'>
          <i className='icon icon-sparkle mr-50' />
          {`${walletAddress.substring(0, 7)}...${walletAddress.substring(walletAddress.length - 5)}`}
        </div>
      </div>
    </div>
  )
}

export default App
