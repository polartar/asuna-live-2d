import m from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import { Dispatch, RootState } from '../../store/store'
import { ItemGroup } from '../../store/items'
import upgrade from '../../hoc/upgrade'
import Item from '../ui/Item'
import { ModelLayer } from 'asuna-web-live2d/src/state/ModelState'

const items = [
  { name: 'School Uniform', id: 'model/Outfit/School_Uniform', color: '#fff' },
  { name: 'Priestess', id: 'model/Outfit/Priestess', color: '#fff' },
  { name: 'Vietnamese Dress', id: 'model/Outfit/Qipao', color: '#fff' }
]

interface StoreAttrs {
  activeItem: number
}
interface TabOutfitAttrs extends StoreAttrs {
  dispatch: Dispatch
}

class TabOutfit extends MithrilTsxComponent<TabOutfitAttrs> {
  view({ attrs }: m.Vnode<TabOutfitAttrs>) {
    return <div class='px-120 py-140'>
      <h1 class='mb-100 text-lg text-right font-medium'>OUTFIT</h1>
      {items.map((item, i) => <Item
        itemGroup={ItemGroup.Outfit}
        itemIdx={i}
        active={attrs.activeItem === i}
        color={item.color}
        modelLayer={ModelLayer.Outfit}
        modelId={item.id}
        index={0}
        variant={i}
      >{item.name}</Item>)}
    </div>
  }
}

export default upgrade(TabOutfit)
  .connect((state: RootState): StoreAttrs => ({
    activeItem: state.items.cursorPosition[ItemGroup.Outfit]
  }))
