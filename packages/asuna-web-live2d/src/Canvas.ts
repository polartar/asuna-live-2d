
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
    this.element.width = window.innerWidth;
    this.element.height = window.innerHeight;
    this.state.view.width = this.element.width
    this.state.view.height = this.element.height
  }
}
