import m from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import { RootState, Dispatch } from '../store/store'
import { TabId } from '../store/tab'
import upgrade from '../hoc/upgrade'
import Tab from './PanelTab'
import TabBody from './tabs/TabBody'
import TabEye from './tabs/TabEye'
import TabHair from './tabs/TabHair'
import TabParameters from './tabs/TabParameters'

export interface PanelStoreAttrs {
  activeTab: TabId
}
export interface PanelAttrs extends PanelStoreAttrs {
  dispatch: Dispatch
}

const TabComponents = {
  [TabId.Body]: TabBody,
  [TabId.Eye]: TabEye,
  [TabId.Hair]: TabHair,
  [TabId.Parameters]: TabParameters
}

class Panel extends MithrilTsxComponent<PanelAttrs> {
  view({ attrs }: m.Vnode<PanelAttrs, Panel>) {
    const TabCompnent = TabComponents[attrs.activeTab]
    return <div class='flex w-240 bg-dark-800'>
      <div class='flex flex-col px-65 py-175'>
        <Tab id={TabId.Body} activeTab={attrs.activeTab}>BODY</Tab>
        <Tab id={TabId.Eye} activeTab={attrs.activeTab}>EYES</Tab>
        <Tab id={TabId.Hair} activeTab={attrs.activeTab}>HAIR</Tab>
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
