import { ViewState } from './state/ViewState'

export class Canvas {
  element: HTMLCanvasElement
  viewState: ViewState

  constructor(viewState: ViewState) {
    this.viewState = viewState
    this.element = document.createElement('canvas')
    this.resizeCanvas()
    document.body.appendChild(this.element)

    window.onresize = this.resizeCanvas.bind(this)
  }

  resizeCanvas() {
    this.element.width = window.innerWidth;
    this.element.height = window.innerHeight;
    this.viewState.width = this.element.width
    this.viewState.height = this.element.height
  }
}
