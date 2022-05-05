import React from 'react'

import styles from './Wrapper.module.scss'

interface WrapperProps {
  className?: string
}

function Wrapper({ className, children }: React.PropsWithChildren<WrapperProps>) {
  return <div className={`${styles['wrapper']} ${className}`}>
    {children}
  </div>
}

export default Wrapper
