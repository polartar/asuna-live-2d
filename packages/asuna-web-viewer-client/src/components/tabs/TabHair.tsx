import m from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import { Dispatch, RootState } from '../../store/store'
import { ItemGroup } from '../../store/items'
import upgrade from '../../hoc/upgrade'
import Item from './Item'

const items = [
  { id: 3, name: 'Ash', color: '#937a6f' },
  { id: 1, name: 'Azure', color: '#677aab' },
  { id: 2, name: 'Black Turquoise', color: '#292929' },
  { id: 0, name: 'Gray', color: '#504c4e' },
  { id: 4, name: 'Strawberry', color: '#dd93a2' }
]

interface StoreAttrs {
  activeItem: number
}
interface TabHairAttrs extends StoreAttrs {
  dispatch: Dispatch
}

class TabHair extends MithrilTsxComponent<TabHairAttrs> {
  view({ attrs }: m.Vnode<TabHairAttrs>) {
    return <div class='px-120 py-140'>
      <h1 class='mb-100 text-lg text-right font-medium'>HAIR COLOR</h1>
      {items.map((item, i) => <Item
        itemGroup={ItemGroup.HairColor}
        itemIdx={i}
        active={attrs.activeItem === i}
        color={item.color}
        modelId='model/000001'
        index={[4, 5]}
        variant={item.id}
      >{item.name}</Item>)}
    </div>
  }
}

export default upgrade(TabHair)
  .connect((state: RootState): StoreAttrs => ({
    activeItem: state.items.cursorPosition[ItemGroup.HairColor]
  }))
