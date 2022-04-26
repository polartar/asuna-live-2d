import React from 'react'

function Modal({ show, children }: React.PropsWithChildren<{ show: boolean }>) {
  const hideClass = show ? '' : ' hide'

  return <div className={`modal-bg${hideClass}`}>
    {children}
  </div>
}

export default Modal
