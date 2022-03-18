import m from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import upgrade from '../../hoc/upgrade'
import { swapTexture } from '../../store/iframe'
import { Dispatch } from '../../store/store'

type TabBodyAttrs = {
  dispatch: Dispatch
}

class TabBody extends MithrilTsxComponent<TabBodyAttrs> {
  view({ attrs }: m.Vnode<TabBodyAttrs>) {
    return <div class='px-120 py-140'>
      <h1>Body</h1>
      <button onclick={() => attrs.dispatch(swapTexture())}>click me</button>
    </div>
  }
}

export default upgrade(TabBody).connect()
