import m from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import upgrade from '../../hoc/upgrade'
import { Dispatch } from '../../store/store'
import { ItemGroup, selectItem } from '../../store/items'
import { swapModel, swapTexture } from '../../store/iframe'
import { ModelLayer } from 'asuna-web-live2d/src/state/ModelState'

type ItemAttrs = {
  itemGroup: ItemGroup
  itemIdx: number
  active: boolean
  iconSrc?: string
  color?: string
  modelLayer?: ModelLayer
  modelId: string
  index?: number | number[]
  variant?: number
  dispatch: Dispatch
}

class Item extends MithrilTsxComponent<ItemAttrs> {
  view({ attrs, children }: m.Vnode<ItemAttrs>) {
    const activeClass = attrs.active ? ' bg-dark-700' : ''
    const colorStyle = attrs.color ? `background:${attrs.color};` : ''
    const iconStyle = attrs.iconSrc ? `background-image:url(${attrs.iconSrc})` : ''
    const modelIdx = Array.isArray(attrs.index) ? attrs.index : [attrs.index]

    const handleClick = () => {
      attrs.dispatch(selectItem({
        group: attrs.itemGroup,
        index: attrs.itemIdx,
        iFrameActions: attrs.itemGroup === ItemGroup.Outfit
          ? [swapModel({
            layer: attrs.modelLayer!,
            id: attrs.modelId
          })]
          : modelIdx.map(idx => swapTexture({
            modelId: attrs.modelId,
            index: idx!,
            variant: attrs.variant!
          }))
      }))
    }

    return <div
      class={`flex items-center bg-dark-800 p-110 my-80 rounded-lg cursor-pointer hover:bg-dark-700${activeClass}`}
      onclick={handleClick}
    >
      <div class='bg-cover bg-dark-900 w-120 h-120 rounded-lg mr-80' style={`${colorStyle}${iconStyle}`} />
      {children}
    </div>
  }
}

export default upgrade(Item).connect()
