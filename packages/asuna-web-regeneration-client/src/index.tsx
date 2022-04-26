import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'

import { store } from './store/store'
import App from './components/App'

import './styles/index.scss'

const getLibrary = (provider: any) => {
  return new ethers.providers.Web3Provider(provider)
}

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <App />
      </Provider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
