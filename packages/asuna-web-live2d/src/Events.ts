import { ENHANCE_RES } from './define'
import { InputState } from './state/InputState'

export class Events {
  inputState: InputState

  constructor(inputState: InputState) {
    this.inputState = inputState

    window.addEventListener('mousedown', (ev) => {
      this.inputState.mouseDown = true
      this.inputState.drag = true
    })

    window.addEventListener('mouseup', (ev) => {
      this.inputState.drag = false
    })

    window.addEventListener('mousemove', (ev) => {
      this.inputState.x = ENHANCE_RES * ev.offsetX
      this.inputState.y = ENHANCE_RES * ev.offsetY
      this.inputState.lastUpdated = Date.now()
    })
  }
}
