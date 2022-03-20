import m from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import { Dispatch, RootState } from '../../store/store'
import { ItemGroup } from '../../store/items'
import upgrade from '../../hoc/upgrade'
import Item from './Item'

const items = [
  { id: 1, name: 'Black' },
  { id: 0, name: 'Blue' },
  { id: 2, name: 'Brown' },
  { id: 3, name: 'Gray' },
  { id: 4, name: 'Green' },
  { id: 5, name: 'Lilac' },
  { id: 6, name: 'Purple' },
  { id: 7, name: 'Red' }
]

interface StoreAttrs {
  activeItem: number
}
interface TabEyeAttrs extends StoreAttrs {
  dispatch: Dispatch
}

class TabEye extends MithrilTsxComponent<TabEyeAttrs> {
  view({ attrs }: m.Vnode<TabEyeAttrs>) {
    return <div class='px-120 py-140'>
      <h1 class='mb-100 text-lg text-right font-medium'>EYE COLOR</h1>
      {items.map((item, i) => <Item
        itemGroup={ItemGroup.EyeColor}
        itemIdx={i}
        active={attrs.activeItem === i}
        iconSrc={`/assets/icon/eye/${item.name}.png`}
        modelId='model/000001'
        index={1}
        variant={item.id}
      >{item.name}</Item>)}
    </div>
  }
}

export default upgrade(TabEye)
  .connect((state: RootState): StoreAttrs => ({
    activeItem: state.items.cursorPosition[ItemGroup.EyeColor]
  }))
