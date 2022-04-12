import React from 'react'

interface ActionPanelProps {
  hidden: boolean
  className?: string
}

function ActionPanel({ hidden, className, children }: React.PropsWithChildren<ActionPanelProps>) {
  const hiddenClass = hidden ? ' hidden' : ''

  return <div className={`action-panel ${className}${hiddenClass}`}>
    {children}
  </div>
}

export default ActionPanel
