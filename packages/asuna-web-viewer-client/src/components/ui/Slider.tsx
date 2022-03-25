import m, { Vnode } from 'mithril'
import { MithrilTsxComponent } from 'mithril-tsx-component'
import { Dispatch } from '../../store/store'
import { Parameter, slideParameter } from '../../store/parameters'
import upgrade from '../../hoc/upgrade'

interface Attrs {
  param: Parameter
  label: string,
  value: number,
  dispatch: Dispatch
}

class Slider extends MithrilTsxComponent<Attrs> {
  attrs: Attrs | null
  x: number
  width: number
  drag: boolean

  constructor() {
    super()
    this.x = 0
    this.width = 0
    this.drag = false
    this.attrs = null
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
  }

  oncreate({ dom }: m.VnodeDOM) {
    this.x = dom.getBoundingClientRect().x
    this.width = (dom as HTMLElement).offsetWidth

    window.addEventListener('mouseup', this.handleMouseUp)
    window.addEventListener('mousemove', this.handleMouseMove)
  }

  onbeforeremove() {
    window.removeEventListener('mouseup', this.handleMouseUp)
    window.removeEventListener('mousemove', this.handleMouseMove)
  }

  view({ attrs }: Vnode<Attrs>) {
    this.attrs = attrs
    const valueStyle = `left:${attrs.value}%;`

    return <div class='my-110'>
      <div>{attrs.label}</div>
      <div
        class='relative bg-dark-600 h-70 my-80 rounded cursor-pointer'
        onmousedown={this.handleMouseDown}
      >
        <div class='absolute bg-white rounded-full w-100 h-100 -mt-45 -ml-60 cursor-grab' style={`${valueStyle}`} />
      </div>
    </div>
  }

  handleMouseDown(ev: MouseEvent) {
    this.drag = true
    this.handleMouseMove(ev)
  }

  handleMouseUp(ev: MouseEvent) {
    this.drag = false
  }

  handleMouseMove(ev: MouseEvent) {
    if (this.drag && this.attrs) {
      this.attrs.dispatch(slideParameter({
        param: this.attrs.param,
        value: (ev.pageX - this.x) / this.width * 100
      }))
      m.redraw()
    }
  }
}

export default upgrade(Slider).connect()
