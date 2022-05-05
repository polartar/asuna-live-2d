import React from 'react'

import styles from './ActionPanel.module.scss'

interface ActionPanelProps {
  hidden: boolean
  className?: string
}

function ActionPanel({ hidden, className, children }: React.PropsWithChildren<ActionPanelProps>) {
  const hiddenClass = hidden ? ' hide' : ''

  return <div className={`${styles['action-panel']} ${className || ''}${hiddenClass}`}>
    {children}
  </div>
}

export default ActionPanel
