import { useState } from 'react'
import asunaBox from '../../assets/media/asuna_box.gif'

function AwaitWithdrawPage() {
  const [loaded, setLoaded] = useState(false)
  const loadedClass = loaded ? ' opacity-100' : ' opacity-0'

  const handleLoad = () => {
    setLoaded(true)
  }

  return <div className="page page-d3 h-full flex justify-center items-center font-bold">
    <img src={asunaBox}
      className={`h-210 mb-80 transition duration-1000${loadedClass}`}
      onLoad={handleLoad}
      alt='withdrawing'
    />
    Withdrawing...
  </div>
}

export default AwaitWithdrawPage
