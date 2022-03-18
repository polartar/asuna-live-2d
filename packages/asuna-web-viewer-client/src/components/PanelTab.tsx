import m from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import { Dispatch } from '../store/store'
import upgrade from '../hoc/upgrade'
import { TabId, setActiveTab } from '../store/tab'

type TabAttrs = {
  dispatch: Dispatch,
  id: TabId,
  activeTab: TabId
}

class Tab extends MithrilTsxComponent<TabAttrs> {
  view({ attrs, children }: m.Vnode<TabAttrs>) {
    const activeClass = attrs.id === attrs.activeTab ? ' bg-dark-700' : ''
    return <div
      class={`hover:bg-dark-700 flex justify-center items-center w-170 h-170 mb-60 cursor-pointer text-xs rounded-lg text-center${activeClass}`}
      onclick={() => attrs.dispatch(setActiveTab(attrs.id))}
    >
      {children}
    </div>
  }
}

export default upgrade(Tab)
  .connect()
