import { ENHANCE_RES, MVP_SCALE } from './define'
import { WorldState } from './state/WorldState'


export class Canvas {
  element: HTMLCanvasElement
  state: WorldState

  constructor(worldState: WorldState) {
    this.state = worldState
    this.element = document.createElement('canvas')
    this.resizeCanvas()
    this.state.input.x = this.state.view.width / 2
    this.state.input.y = this.state.view.height / 2
    document.body.appendChild(this.element)

    window.onresize = this.resizeCanvas.bind(this)
  }

  resizeCanvas() {
    this.element.width = ENHANCE_RES * window.innerWidth
    this.element.height = ENHANCE_RES * window.innerHeight
    this.state.view.width = this.element.width
    this.state.view.height = this.element.height
    this.element.style.width = `${window.innerWidth}px`
    this.element.style.height = `${window.innerHeight}px`

    this.state.view.mvp.loadIdentity()
    this.state.view.mvp.scale(MVP_SCALE * this.state.view.height / this.state.view.width, MVP_SCALE * 1.0)
    this.state.view.mvp.translateY(.2)
  }
}
