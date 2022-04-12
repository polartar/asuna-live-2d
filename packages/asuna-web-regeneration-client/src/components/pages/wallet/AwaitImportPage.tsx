import { useState } from 'react'
import wildcard from '../../../assets/media/wildcard.jpg'

function AwaitImportPage() {
  const [loaded, setLoaded] = useState(false)
  const loadedClass = loaded ? ' opacity-100' : ' opacity-0'

  const handleLoad = () => {
    setLoaded(true)
  }

  return <div className="page page-d2 h-full flex justify-center items-center font-bold">
    <img src={wildcard}
      className={`asuna-ratio h-210 mb-80 rounded-lg transition duration-1000${loadedClass}`}
      onLoad={handleLoad}
      alt='importing'
    />
    Importing...
  </div>
}

export default AwaitImportPage
