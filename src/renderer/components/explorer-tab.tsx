import { ChevronDown, ChevronRight, FilePlus } from 'lucide-react'
import { useState } from 'react'

type ComponentProps = {
  tabName: string
  component: React.JSX.Element
  visible?: boolean
}

export function ExplorerTab({
  tabName,
  component,
  visible = false,
}: ComponentProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(visible)

  const chevronClasses = 'w-4 text-neutral-700'

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex w-full">
          <button
            className="flex gap-2 hover:bg-neutral-900 w-full rounded-sm"
            onClick={() => setIsExpanded(s => !s)}
          >
            {isExpanded ? (
              <ChevronDown className={chevronClasses} />
            ) : (
              <ChevronRight className={chevronClasses} />
            )}
            <span>{tabName}</span>
          </button>
        </div>
        <div>
          <FilePlus className="w-4" />
        </div>
      </div>
      {isExpanded ? component : null}
    </>
  )
}
