import React from 'react'

interface WrapperProps {
  className?: string
}

function Wrapper({ className, children }: React.PropsWithChildren<WrapperProps>) {
  return <div className={`wrapper ${className}`}>
    {children}
  </div>
}

export default Wrapper
