import React from 'react'

import styles from './GridContainer.module.scss'

function GridContainer({ children }: React.PropsWithChildren<{}>) {

  return <div className={`${styles['grid-container']}`}>
    <div className='grid'>
      {children}
    </div>
  </div>
}

export default GridContainer
