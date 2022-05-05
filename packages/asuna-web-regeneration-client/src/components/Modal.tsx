import React from 'react'

import styles from './Modal.module.scss'

function Modal({ show, children }: React.PropsWithChildren<{ show: boolean }>) {
  const hideClass = show ? '' : ' hide'

  return <div className={`${styles['modal-bg']}${hideClass}`}>
    {children}
  </div>
}

export default Modal
