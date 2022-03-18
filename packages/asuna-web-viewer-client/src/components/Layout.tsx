import m from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import Embed from './Embed'
import Panel from './Panel'

export interface LayoutAttrs { }

class Layout extends MithrilTsxComponent<LayoutAttrs>{
  view({ attrs }: m.Vnode<LayoutAttrs, Layout>) {
    return <div class='app flex h-full'>
      <div class='flex justify-center items-center flex-1 w-full'>
        <Embed />
      </div>
      <Panel />
    </div>
  }
}

export default Layout
