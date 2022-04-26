import { useState } from 'react'
import wildcard from '../../../assets/media/wildcard.jpg'

function AwaitSwapPage() {
  const [loaded, setLoaded] = useState(false)
  const loadedClass = loaded ? ' opacity-100' : ' opacity-0'

  const handleLoad = () => {
    setLoaded(true)
  }

  return <div className="page page-d3 h-full flex justify-center items-center font-bold">
    <img src={wildcard}
      className={`asuna-ratio h-210 mb-80 rounded-lg transition duration-1000${loadedClass}`}
      onLoad={handleLoad}
      alt='importing'
    />
    Regenerating...
  </div>
}

export default AwaitSwapPage
