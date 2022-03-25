import m, { Vnode } from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import { Dispatch, RootState } from '../../store/store'
import { Parameter, toggleOverride } from '../../store/parameters'
import upgrade from '../../hoc/upgrade'
import Slider from '../ui/Slider'

const parameters = [
  { param: Parameter.FaceX, label: 'Face X' },
  { param: Parameter.FaceY, label: 'Face Y' },
  { param: Parameter.BodyX, label: 'Body X' },
  { param: Parameter.BodyY, label: 'Body Y' }
] as { param: Parameter, label: string }[]

interface StoreAttrs {
  override: boolean
  values: { [p in Parameter]: number }
}
interface Attrs extends StoreAttrs {
  dispatch: Dispatch
}

class TabParameters extends MithrilTsxComponent<Attrs> {
  view({ attrs }: Vnode<Attrs>) {
    const disabledClass = attrs.override ? '' : ' opacity-40 pointer-events-none'
    const toggleChecked = () => {
      attrs.dispatch(toggleOverride({ value: !attrs.override }))
    }

    return <div class='px-120 py-140'>
      <h1 class='mb-100 text-lg text-right font-medium'>PARAMETERS</h1>
      <div class='form mb-150 cursor-pointer' onclick={toggleChecked}>
        <input
          type='checkbox'
          class='bg-dark-700 w-110 h-110 mr-80 border-none rounded-md align-middle appearance-none cursor-pointer checked:bg-slate-400'
          checked={attrs.override}
        />
        <label class='align-middle cursor-pointer'>Use custom parameters</label>
      </div>
      <div class={disabledClass}>
        {parameters.map((item) => <Slider
          param={item.param}
          label={item.label}
          value={attrs.values[item.param]}
        />)}
      </div>
    </div>
  }
}

export default upgrade(TabParameters)
  .connect((state: RootState): StoreAttrs => ({
    override: state.parameters.override,
    values: state.parameters.value
  }))

