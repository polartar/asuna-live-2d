import React from "react"

interface ImportPanelProps {
  count: number
}

function ImportPanel({ count, children }: React.PropsWithChildren<ImportPanelProps>) {
  const hiddenClass = count === 0 ? ' hidden' : ''

  return <div className={`action-panel w-full${hiddenClass}`}>
    {children}
  </div>
}

export default ImportPanel
