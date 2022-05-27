import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import InventoryPage from './pages/inventory/InventoryPage'
import WalletPage from './pages/wallet/WalletPage'
import SwapPage from './pages/swap/SwapPage'
import logo from './assets/media/logo-white.png'
import Wrapper from './components/Wrapper'
import ConnectPage from './pages/connect/ConnectPage'
import Modal from './components/Modal'
import { useAppSelector } from './store/hooks'
import { ModalPage } from './store/modal'
import ApproveModal from './pages/wallet/ApproveModal'

import bg1 from './assets/media/bg1.jpg'
import WithdrawPage from './pages/withdraw/WithdrawPage'
import Dialogue from './dialogue/Dialogue'

export enum Page {
  Inventory,
  Wallet,
  Withdraw,
  Swap
}

function App() {
  const { active, account } = useWeb3React()
  const { page: modalPage, show: showModal } = useAppSelector(state => state.modal)
  const [firstLoad, setFirstLoad] = useState(true) // the first time inventory is mounted, if inventory is empty, transition to import from wallet
  const [page, setPage] = useState(0 as Page)
  const address = account || '0x'.padStart(40, '0')

  const changePage = (n: number) => {
    if ((n % 4) === Page.Inventory) {
      setFirstLoad(false)
    }
    setPage(n % 4)
  }

  return (
    <div className='flex h-full bg-cover bg-top overflow-hidden' style={{ backgroundImage: `url(${bg1})` }}>
      <div className='flex-1 pt-120 pl-120'>
        <img src={logo} className='max-h-180' alt='logo' />
      </div>
      <Wrapper className='flex flex-col'>
        <div className='flex flex-1 relative overflow-hidden'>
          <SwitchTransition>
            <CSSTransition
              key={active.toString()}
              classNames='page-d0'
              timeout={300}
            >
              {!active ? <ConnectPage />
                : <SwitchTransition>
                  <CSSTransition
                    key={page}
                    classNames='page-d1'
                    timeout={300}
                  >
                    {page === Page.Inventory ? <InventoryPage firstLoad={firstLoad} changePage={changePage} />
                      : page === Page.Wallet ? <WalletPage changePage={changePage} />
                        : page === Page.Withdraw ? <WithdrawPage changePage={changePage} />
                          : page === Page.Swap ? <SwapPage changePage={changePage} />
                            : null
                    }
                  </CSSTransition>
                </SwitchTransition>
              }
            </CSSTransition>
          </SwitchTransition>
        </div>
      </Wrapper>
      <div
        className={`flex-1 flex justify-end items-start pt-120 pr-120 transition${active ? ' opacity-100' : ' opacity-0'}`}
      >
        <div className='flex items-center px-100 py-50 border border-white rounded-full'>
          <i className='icon icon-sparkle mr-50' />
          {`${address.substring(0, 5)}...${address.substring(address.length - 4)}`}
        </div>
      </div>
      <SwitchTransition>
        <CSSTransition
          key={'' + !active}
          classNames='fade'
          timeout={400}
        >
          {!active ? <Dialogue /> : <div></div>}
        </CSSTransition>
      </SwitchTransition>
      <Modal show={showModal}>
        <SwitchTransition>
          <CSSTransition
            key={modalPage}
            classNames='fade'
            timeout={300}
          >
            {modalPage === ModalPage.None ? <div></div>
              : modalPage === ModalPage.Approval ? <ApproveModal />
                : null
            }
          </CSSTransition>
        </SwitchTransition>
      </Modal>
    </div >
  )
}

export default App
