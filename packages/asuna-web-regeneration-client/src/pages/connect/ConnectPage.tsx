import { useWeb3React } from '@web3-react/core'
import { connectors } from '../../web3/connectors'

function ConnectPage() {
  const { activate } = useWeb3React()

  const handleConnect = async () => {
    await activate(connectors.metamask)
  }

  return <div className='page page-d0 h-full flex justify-center items-center font-bold'>
    <button
      className='w-210 py-80 border-2 rounded-full transition duration-300 hover:bg-white hover:text-slate-400'
      onClick={handleConnect}
    >Connect Wallet</button>
  </div>
}

export default ConnectPage
