import React from 'react'

interface GridItemTimerProps {
  now: number
  timestamp: number
}

function GridItemTimer({ now, timestamp }: GridItemTimerProps) {
  const timer = Math.max(0, Math.floor((timestamp - now) / 1000))
  const hr = '' + Math.floor(timer / 3600)
  const min = '' + Math.floor(timer % 3600 / 60)
  const sec = '' + timer % 60
  const hideClass = timestamp - now < 0 ? ' hide' : ''
  const percent = timer / (3 * 24 * 60 * 60 + 60) * 100

  return < div className={`grid-timer${hideClass}`} >
    <span className='text-sm font-bold'>
      <div
        className='w-150 h-150 mx-auto my-100 bg-slate-700 rounded-full opacity-80'
        style={{ backgroundImage: `conic-gradient(#818cf8 ${percent}%, rgba(0,0,0,0) 0)` }}
      />
      {`${hr.padStart(2, '0')}:${min.padStart(2, '0')}:${sec.padStart(2, '0')}`}
    </span>
  </div >
}

export default GridItemTimer
