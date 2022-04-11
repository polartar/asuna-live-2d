import React, { useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import InventoryPage from './pages/inventory/InventoryPage'
import WalletPage from './pages/wallet/WalletPage'
import SwapPage from './pages/SwapPage'

import logo from '../assets/media/logo-white.png'
import Wrapper from './Wrapper'


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
    <Wrapper className='flex flex-col h-full'>
      <div className='pt-100 pb-110'>
        <img src={logo} className='h-170' alt='logo' />
      </div>
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
  )
}

export default App
