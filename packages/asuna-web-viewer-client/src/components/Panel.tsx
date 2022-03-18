import m from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import { RootState, Dispatch } from '../store/store'
import { TabId } from '../store/tab'
import upgrade from '../hoc/upgrade'
import Tab from './PanelTab'
import TabBody from './tabs/TabBody'
import TabParameters from './tabs/TabParameters'

export interface PanelStoreAttrs {
  activeTab: TabId
}
export interface PanelAttrs extends PanelStoreAttrs {
  dispatch: Dispatch
}

const TabComponents = {
  [TabId.Body]: TabBody,
  [TabId.Eye]: TabBody,
  [TabId.Parameters]: TabParameters
}

class Panel extends MithrilTsxComponent<PanelAttrs> {
  view({ attrs }: m.Vnode<PanelAttrs, Panel>) {
    const TabCompnent = TabComponents[attrs.activeTab]
    return <div class='flex w-235 bg-dark-800'>
      <div class='flex flex-col px-60 py-160'>
        <Tab id={TabId.Body} activeTab={attrs.activeTab}>BODY</Tab>
        <Tab id={TabId.Parameters} activeTab={attrs.activeTab}>PARAMETERS</Tab>
      </div>
      <div class='flex-1 w-full bg-dark-900 border-dark-700'>
        <TabCompnent />
      </div>
    </div>
  }
}

export default upgrade(Panel)
  .connect((state: RootState): PanelStoreAttrs => ({
    activeTab: state.tab
  }))
