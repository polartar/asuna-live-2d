import { InputState } from './state/InputState'

export class Events {
  inputState: InputState

  constructor(inputState: InputState) {
    this.inputState = inputState

    window.addEventListener('mousedown', (ev) => {
      this.inputState.drag = true
    })

    window.addEventListener('mouseup', (ev) => {
      this.inputState.drag = false
    })

    window.addEventListener('mousemove', (ev) => {
      this.inputState.x = ev.offsetX
      this.inputState.y = ev.offsetY
      this.inputState.lastUpdated = Date.now()
    })
  }
}
