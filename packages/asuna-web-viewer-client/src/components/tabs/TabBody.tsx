import m from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import { Dispatch, RootState } from '../../store/store'
import { ItemGroup } from '../../store/items'
import upgrade from '../../hoc/upgrade'
import Item from '../ui/Item'

const items = [
  { name: 'Neutral', color: '#f3ccbf' },
  { name: 'Bright', color: '#f3d3cd' },
  { name: 'Warm', color: '#e3bdaf' },
  { name: 'Tan', color: '#d1a79b' },
  { name: 'Dark', color: '#c09589' }
]

interface StoreAttrs {
  activeItem: number
}
interface TabBodyAttrs extends StoreAttrs {
  dispatch: Dispatch
}

class TabBody extends MithrilTsxComponent<TabBodyAttrs> {
  view({ attrs }: m.Vnode<TabBodyAttrs>) {
    return <div class='px-120 py-140'>
      <h1 class='mb-100 text-lg text-right font-medium'>BODY COLOR</h1>
      {items.map((item, i) => <Item
        itemGroup={ItemGroup.BodyColor}
        itemIdx={i}
        active={attrs.activeItem === i}
        color={item.color}
        modelId='model/000001'
        index={0}
        variant={i}
      >{item.name}</Item>)}
    </div>
  }
}

export default upgrade(TabBody)
  .connect((state: RootState): StoreAttrs => ({
    activeItem: state.items.cursorPosition[ItemGroup.BodyColor]
  }))
